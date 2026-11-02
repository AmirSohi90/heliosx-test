# MedExpress Genovia — Consultation: Plan

## Will do

### Brief requirements

- React app — Next.js (App Router) + TypeScript
- Consultation page asking 5 yes/no questions
- One question at a time; the next is revealed only once the current one is answered
- After the last question: a simple thank-you message
- Collected data passed to a service function that `console.log`s it (async, to mimic an API call)
- Usable at mobile and desktop widths
- Header with a brand logo (SVG, with alt text)
- Footer: two columns at desktop, stacked on mobile
- README: run instructions, Node version (22), trade-offs

### Supporting decisions

- **Landing page** — minimal, with a "Start consultation" link (journey step 2)
- **Routing** — `/consultation/[condition]` with `generateStaticParams`; `notFound()` for unknown conditions
- **Faux CMS** — `lib/cms.ts` → `getConsultation(slug)`, validated with zod, loaded in a server component and passed to the client stepper
- **Question schema** — discriminated union on a semantic `type`; only `yesNo` implemented, exhaustive `never` check
- **State** — pure reducer (`consultationReducer.ts`, no React) used by a `useConsultation` hook
  - `Answers = Record<QuestionId, AnswerValue>` — keyed by question id; unanswered questions have no key
  - `QuestionId = Question["id"]` (alias in `schema.ts`) used wherever a question id appears: answers, `questionIds`, the `ANSWER` action, the payload
  - `AnswerValue = boolean` (in `schema.ts`) — one member per question type, widened as types are added; the reducer never inspects the value
  - Flat `status` field: `answering | submitting | error | submitted` (submitting/error happen on the last step with the form still visible, so a union would repeat `step` in each variant)
  - Actions: `ANSWER`, `NEXT`, `BACK`, `SUBMIT_START`, `SUBMIT_SUCCESS`, `SUBMIT_FAILURE`
  - Validation and guards live in the reducer; invalid actions return the same state
- **Copy** — consultation content (question text, hints) from the CMS; UI text from `src/locales/en/`, one file per namespace (`home.ts`, `common.ts`, `consultation.ts`), created as needed. Mirrors react-i18next/next-intl namespaces so moving to a library is `.ts` → `.json` plus `t()` calls; variables use `{placeholder}` strings, not functions
- **Form semantics** — one `<form>`; current question only, as a `fieldset` whose `legend` contains the question heading
- **Answer input** — native radio buttons (Yes / No)
- **Navigation buttons**
  - Back: `type="button"`, **hidden** on the first question (not disabled — disabled buttons are skipped by keyboard and give no reason why)
  - Continue: `type="submit"` on questions 1–4
  - Submit: `type="submit"` on question 5, triggers the service call
  - Continue/Submit are always enabled; pressing with no answer shows an inline error ("Select yes or no") linked to the fieldset via `aria-describedby` (GOV.UK pattern — avoids disabled-button issues)
  - Going Back keeps the previous answer selected
- **Question heading** — the question is the page's `h1`, inside the `legend`, with "Condition · Question X of 5" as a caption; hint and error sit outside the legend and are linked via `aria-describedby` (read once, not repeated for every radio). The heading already has `tabIndex={-1}` and accepts a `ref`, ready for focus management (deferred — see trade-offs)
- **Submission** — pending state (button shows "Submitting…" with `aria-disabled`, so focus isn't lost; the reducer locks answers and ignores repeat submits) and an error state (`role="alert"`) with retry
- **Thank you** — separate static route `/consultation/[condition]/complete`; `redirect()` (replace) during render once status is `submitted`, so refresh keeps the confirmation, Back doesn't return to the form, and Next's route announcer reads the new title; copy explains a doctor will review the answers today
- **Payload** — `{ condition, consultationVersion, answers: [{ questionId, questionText, answer }], submittedAt }`
- **Accessibility** — landmarks (`header`/`main`/`footer`), skip link, single `h1` per view, visible focus, 44px targets, native radios (Tab enters the group, arrows move between options)
- **Responsive (mobile-first Tailwind)** — headings scale up at `md:`/`lg:`; body text and spacing increase at `md:`; buttons are full width and stacked (Continue on top via `flex-col-reverse`, DOM order unchanged) on mobile, side by side from `sm:`; logo grows at `md:`/`lg:`; footer is two columns from `md:`; form gap 0.5rem → 1rem at `md:`. Mobile-first also covers zoom/reflow
- **Theme** — light only; the scaffold's `prefers-color-scheme: dark` block was removed because components assume a light background
- **Tests**
  - Unit (Vitest): reducer, `buildSubmission`, service, CMS/schema, `formatLocaleString`
  - Feature (React Testing Library): `Consultation` with fixture data — validation error, Back keeps answers, exact payload, redirect, submission failure and retry; service and `next/navigation` mocked
  - Pages: consultation page (static params, metadata, renders first question from the real CMS, 404 for unknown slug) and landing page (link to the consultation); async Server Components tested by calling, awaiting and rendering them
  - axe checks (`vitest-axe`) in the default and error states
  - Not tested: the thank-you page (static copy only) — would add with more time, alongside focus-management tests and Playwright E2E

## Structure

```
src/
  app/                                  # routes — thin: fetch data, notFound(), render a feature
    layout.tsx                          # skip link, Header, <main>, Footer
    page.tsx                            # landing
    consultation/[condition]/
      page.tsx
      loading.tsx                       # role="status" text; rarely seen since the page is static
      complete/
        page.tsx                        # thank-you page (static, own generateStaticParams)

  features/                             # PascalCase folders: each feature builds a component
    Consultation/
      Consultation.tsx                  # 'use client' — the one public component; flow (hook, step, buttons, submission error, redirect); private QuestionStepHeading at module level
      components/                       # internal building blocks of the feature
        QuestionStep.tsx                # maps question.type → UI; exhaustive never check (compile time) + throw (runtime)
      useConsultation.ts                # hook: wires reducer + submission; no hooks/ folder for a single hook
      consultationReducer.ts
      service.ts                        # submitConsultation → console.log
      types.ts                          # ConsultationSubmission
      utils.ts                          # buildSubmission (pure: answers + content → payload)
      __tests__/

  components/                           # presentational only — props in, markup out; one folder per component
    Header/                             # dark bar, logo links home
    Footer/                             # two columns at md+, stacks on mobile
    FooterSection/                      # heading + children; section named by its heading via useId
    Button/                             # primary/secondary; each variant styles its own disabled/aria-disabled state; type defaults to "button"
    Fieldset/                           # fieldset + legend + hint/error (HelpText) wired via aria-describedby; children are the controls; provides a guard context
    Radio/                              # input + label (htmlFor via useId); native input props pass through; must be inside a Fieldset
    HelpText/                           # hint | error variants

  utils/
    cn.ts                               # clsx + tailwind-merge
    formatLocaleString.ts               # fills {placeholders} in copy strings

  locales/                              # UI text by language and namespace (no i18n library yet)
    en/
      home.ts                           # landing page
      common.ts                         # skip link, header, footer, loading
      consultation.ts                   # Back, Continue, Submit, Yes/No, errors, progress

  lib/                                  # shared data layer
    cms.ts
    schema.ts
    routes.ts                           # single source for URLs (home, consultation, consultationComplete)
    __tests__/
```

- No `src/pages/` folder — Next.js would treat it as the Pages Router
- Feature folders are PascalCase (`features/Consultation/`) because each feature's purpose is to build a component from presentational ones; renames are done with `git mv` since macOS is case-insensitive
- `Fieldset` is generic — a group of related controls (radios now; checkboxes or day/month/year inputs later). A single text input would use a label, not a fieldset. Started as `RadioGroup`, renamed once it was clear nothing in it was radio-specific
- `Radio` calls `useFieldsetGuard("Radio")`, which throws "Radio must be rendered inside a Fieldset". "Only Radios inside a Fieldset" isn't enforced — TypeScript can't check element types and a runtime `child.type` check breaks with wrappers
- `QuestionStep` is the adapter: `"yesNo"` → `Fieldset` with `Radio`s mapped from Yes/No options (copy from `locales/en/consultation.ts`), using booleans directly; the string `value` attribute is for valid HTML only
- `Consultation` passes the heading into `QuestionStep` as a `heading` prop, so each question type decides the container (legend for radios, label for a future text input)
- CMS and schema stay in `lib/` — data layer shared by the landing page and future features

### Import rules

- `app/` → may import `features/`, `components/`, `lib/`, `locales/`
- `features/` → may import `components/`, `lib/`, `locales/`; never another feature
- `components/` → nothing app-specific (text arrives via props, not from `locales/`)
- `lib/` → never imports from `features/`

## Won't do (noted in README)

### Excluded by the brief

- Visual polish
- Clinically realistic questions or eligibility logic
- Localisation / i18n
- Regulatory or compliance features
- Card details / subscription, doctor review, payment, dispatch (outside the consultation phase)
- A real API / backend — the service only logs

### Our own trade-offs

- **No auto-advance** — the live site auto-advances using option buttons; we use native radios + explicit Continue for correct choice semantics, the chance to change an answer before moving on, and one consistent pattern when checkbox/text questions arrive. If auto-advance is wanted, the accessible route is answer buttons that submit, not radios that advance on change (WCAG 3.2.2)
- **No review ("check answers") step** — the brief goes straight to thank-you; first item under "with more time"
- **No form library** — React Hook Form becomes worthwhile once question types grow; zod is used at the data boundary
- **No question types beyond `yesNo`** — the schema is ready for them; "answered" is `!== undefined`, which will need a per-type check once multi-select or text questions arrive
- **`QuestionId` is an alias, not a branded type** — documents intent but the compiler still accepts any string; zod's `.brand<"QuestionId">()` would catch mixed-up ids at the cost of casts in test fixtures
- **No URL-synced steps** — browser Back leaves the flow; noted trade-off
- **sessionStorage persistence** — stretch goal only, behind a `hydrated` flag to avoid a flash of question 1, with restored answers validated against current question ids
- **No focus management between steps (yet)** — a screen reader user isn't told when the question changes. With more time: move focus to the new question's heading when the step changes (an effect comparing the previous question number, so it skips first load and survives Strict Mode's double effects), and on a validation error focus the first option in the submit handler so the linked error is announced on every press. The thank-you page doesn't need it — Next's route announcer reads its title
- **No dark mode** — doing it properly means theme tokens and `dark:` variants per component, not just swapping the page background
- **No** auth, analytics, E2E tests (Playwright) or CI — "with more time"
- **No custom error or not-found pages** — Next.js defaults are used. With more time: `error.tsx` (friendly message + "Try again" via Next 16's `retry`, error logged to a monitoring service) and `not-found.tsx` for unknown conditions. Invalid CMS data fails the build rather than reaching users, because pages are statically generated
- **No Storybook** — in a real project I'd document the presentational components (`Button`, `Fieldset`, `Radio`, `HelpText`, etc.) in Storybook, with stories for each state (default, selected, error, disabled) and the a11y addon
- **Committed straight to `main`** — normally I'd work on feature branches and merge via pull requests with review and CI; for a short, solo exercise built in isolation, small commits on `main` keep the history readable without the overhead
