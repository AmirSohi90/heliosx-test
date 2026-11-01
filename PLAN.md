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
  - Answers keyed by question `id`, stored as `boolean`
  - Flat `status` field: `answering | submitting | error | submitted` (submitting/error happen on the last step with the form still visible, so a union would repeat `step` in each variant)
  - Actions: `ANSWER`, `NEXT`, `BACK`, `SUBMIT_START`, `SUBMIT_SUCCESS`, `SUBMIT_FAILURE`
  - Validation and guards live in the reducer; invalid actions return the same state
- **Copy** — consultation content (question text, hints) from the CMS; UI text (Yes/No, Back, Continue, errors) from a `copy.ts` object
- **Form semantics** — one `<form>`; current question only, as a `fieldset` whose `legend` contains the question heading
- **Answer input** — native radio buttons (Yes / No)
- **Navigation buttons**
  - Back: `type="button"`, **hidden** on the first question (not disabled — disabled buttons are skipped by keyboard and give no reason why)
  - Continue: `type="submit"` on questions 1–4
  - Submit: `type="submit"` on question 5, triggers the service call
  - Continue/Submit are always enabled; pressing with no answer shows an inline error ("Select yes or no") linked via `aria-describedby`, and focus stays on the question (GOV.UK pattern — avoids disabled-button issues)
  - Going Back keeps the previous answer selected
- **Focus** — on each step, focus moves to the question heading (`tabIndex={-1}`); "Question X of 5" shown as a caption in the heading. No separate `aria-live` region (avoids double announcement)
- **Submission** — pending state (button shows "Submitting…", form disabled) and error state with retry
- **Thank you** — heading receives focus, no back navigation, copy explains a doctor will review the answers today
- **Payload** — `{ condition, consultationVersion, answers: [{ questionId, questionText, answer }], submittedAt }`
- **Accessibility** — landmarks (`header`/`main`/`footer`), skip link, single `h1` per view, visible focus, 44px targets, `prefers-reduced-motion`
- **Tests**
  - Vitest: reducer unit tests
  - React Testing Library: full happy-path flow (answer all, submit, thank you, service called with payload), validation error, Back behaviour
  - One axe check (`vitest-axe`)

## Structure

```
src/
  app/                                  # routes — thin: fetch data, notFound(), render a feature
    layout.tsx                          # skip link, Header, <main>, Footer
    page.tsx                            # landing
    consultation/[condition]/
      page.tsx
      loading.tsx
      error.tsx

  features/
    consultation/
      components/
        Consultation.tsx                # 'use client' — uses the hook, renders the current step
        QuestionStep.tsx                # maps question.type → UI; exhaustive never check
        ThankYou.tsx
      hooks/
        useConsultation.ts
      consultationReducer.ts
      consultationService.ts
      copy.ts
      __tests__/

  components/                           # presentational only — props in, markup out
    Header.tsx
    Footer.tsx
    Button.tsx
    RadioGroup.tsx
    ErrorMessage.tsx

  lib/                                  # shared data layer
    cms.ts
    schema.ts
    __tests__/
```

- No `src/pages/` folder — Next.js would treat it as the Pages Router
- `RadioGroup` is generic: legend, hint, options (`{ value, label }[]`), value, error and `onChange` all come from props; it knows nothing about consultations or yes/no
- `QuestionStep` is the adapter: `"yesNo"` → `RadioGroup` with Yes/No options from `copy.ts`, converting to/from `boolean`
- CMS and schema stay in `lib/` — data layer shared by the landing page and future features

### Import rules
- `app/` → may import `features/`, `components/`, `lib/`
- `features/` → may import `components/`, `lib/`; never another feature
- `components/` → nothing app-specific
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
- **No question types beyond `yesNo`** — the schema is ready for them
- **No URL-synced steps** — browser Back leaves the flow; noted trade-off
- **sessionStorage persistence** — stretch goal only, behind a `hydrated` flag to avoid a flash of question 1, with restored answers validated against current question ids
- **No** auth, analytics, E2E tests (Playwright) or CI — "with more time"
