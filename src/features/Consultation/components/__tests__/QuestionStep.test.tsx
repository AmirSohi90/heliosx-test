import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { Question } from "@/lib/schema";
import { QuestionStep } from "../QuestionStep";

const question: Question = {
  id: "parade-wrist-pain",
  type: "yesNo",
  text: "Does your wrist ache after a royal parade?",
  hint: "Include state visits and coronations.",
};

function renderQuestionStep(
  props: Partial<Parameters<typeof QuestionStep>[0]> = {},
) {
  const onAnswer = vi.fn();
  const user = userEvent.setup();
  render(
    <QuestionStep
      question={question}
      heading={<h1>{question.text}</h1>}
      value={undefined}
      showError={false}
      onAnswer={onAnswer}
      {...props}
    />,
  );
  return { user, onAnswer };
}

describe("QuestionStep", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("yesNo questions", () => {
    it("renders the heading as the group's name, with Yes and No options", () => {
      renderQuestionStep();

      const group = screen.getByRole("group", { name: question.text });
      expect(group).toHaveAccessibleDescription(question.hint);
      expect(screen.getByRole("radio", { name: "Yes" })).not.toBeChecked();
      expect(screen.getByRole("radio", { name: "No" })).not.toBeChecked();
    });

    it("checks the option matching the current answer", () => {
      renderQuestionStep({ value: false });

      expect(screen.getByRole("radio", { name: "No" })).toBeChecked();
      expect(screen.getByRole("radio", { name: "Yes" })).not.toBeChecked();
    });

    it("reports the answer as a boolean", async () => {
      const { user, onAnswer } = renderQuestionStep();

      await user.click(screen.getByRole("radio", { name: "Yes" }));
      expect(onAnswer).toHaveBeenLastCalledWith(true);

      await user.click(screen.getByRole("radio", { name: "No" }));
      expect(onAnswer).toHaveBeenLastCalledWith(false);
    });

    it("shows the yes/no error and links it to the group", () => {
      renderQuestionStep({ showError: true });

      expect(
        screen.getByRole("group", { name: question.text }),
      ).toHaveAccessibleDescription(`${question.hint} Select yes or no`);
    });
  });

  it("throws for a question type it doesn't support", () => {
    const unsupported = { ...question, type: "slider" } as unknown as Question;
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => renderQuestionStep({ question: unsupported })).toThrow(
      "Unsupported question type: slider",
    );
  });
});
