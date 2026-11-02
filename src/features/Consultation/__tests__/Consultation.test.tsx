import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { redirect } from "next/navigation";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";
import type { Consultation as ConsultationContent } from "@/lib/schema";
import { Consultation } from "../Consultation";
import * as service from "../service";

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

const consultation: ConsultationContent = {
  slug: "royal-wave-fatigue",
  version: "2026-11-01",
  conditionName: "Royal wave fatigue",
  questions: [
    {
      id: "parade-wrist-pain",
      type: "yesNo",
      text: "Does your wrist ache after a royal parade?",
      hint: "Include state visits and coronations.",
    },
    {
      id: "pear-exposure",
      type: "yesNo",
      text: "Have you handled a Genovian pear in the last 24 hours?",
    },
  ],
};

function renderConsultation() {
  const user = userEvent.setup();
  const view = render(<Consultation consultation={consultation} />);
  return { user, ...view };
}

describe("Consultation", () => {
  let submitSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    submitSpy = vi.spyOn(service, "submitConsultation").mockResolvedValue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.mocked(redirect).mockClear();
  });

  it("shows the first question with its progress and no Back button", () => {
    renderConsultation();

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Does your wrist ache after a royal parade?",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Question 1 of 2/)).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Back" }),
    ).not.toBeInTheDocument();
  });

  it("shows an error and stays on the question when Continue is pressed without an answer", async () => {
    const { user } = renderConsultation();

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(screen.getByText("Select yes or no")).toBeInTheDocument();
    expect(screen.getByText(/Question 1 of 2/)).toBeInTheDocument();
  });

  it("clears the error once an answer is chosen", async () => {
    const { user } = renderConsultation();

    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("radio", { name: "Yes" }));

    expect(screen.queryByText("Select yes or no")).not.toBeInTheDocument();
  });

  it("keeps the previous answer when going back", async () => {
    const { user } = renderConsultation();

    await user.click(screen.getByRole("radio", { name: "No" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("button", { name: "Back" }));

    expect(screen.getByRole("radio", { name: "No" })).toBeChecked();
  });

  it("submits the answers and redirects to the thank-you page", async () => {
    const { user } = renderConsultation();

    await user.click(screen.getByRole("radio", { name: "Yes" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("radio", { name: "No" }));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(submitSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        condition: "royal-wave-fatigue",
        answers: [
          expect.objectContaining({
            questionId: "parade-wrist-pain",
            answer: true,
          }),
          expect.objectContaining({
            questionId: "pear-exposure",
            answer: false,
          }),
        ],
      }),
    );
    expect(redirect).toHaveBeenCalledWith(
      "/consultation/royal-wave-fatigue/complete",
    );
  });

  it("shows an error if submission fails, and lets the user retry", async () => {
    submitSpy.mockRejectedValueOnce(new Error("Network error"));
    const { user } = renderConsultation();

    await user.click(screen.getByRole("radio", { name: "Yes" }));
    await user.click(screen.getByRole("button", { name: "Continue" }));
    await user.click(screen.getByRole("radio", { name: "Yes" }));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /Something went wrong/,
    );
    expect(redirect).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(submitSpy).toHaveBeenCalledTimes(2);
    expect(redirect).toHaveBeenCalled();
  });

  it("has no accessibility violations, including when showing an error", async () => {
    const { user, container } = renderConsultation();
    expect(await axe(container)).toHaveNoViolations();

    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(await axe(container)).toHaveNoViolations();
  });

  it("links the hint and the validation error to the question for screen readers", async () => {
    const { user } = renderConsultation();
    const group = screen.getByRole("group", {
      name: /Does your wrist ache after a royal parade\?/,
    });

    expect(group).toHaveAccessibleDescription(
      "Include state visits and coronations.",
    );

    await user.click(screen.getByRole("button", { name: "Continue" }));

    expect(group).toHaveAccessibleDescription(
      "Include state visits and coronations. Select yes or no",
    );
  });

  it("throws for a question type it doesn't support", () => {
    const unsupported = {
      ...consultation,
      questions: [{ ...consultation.questions[0], type: "slider" }],
    } as unknown as ConsultationContent;
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      render(<Consultation consultation={unsupported} />),
    ).toThrow("Unsupported question type: slider");
  });
});
