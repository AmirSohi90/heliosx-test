import { describe, expect, it } from "vitest";
import {
  consultationReducer as reduce,
  createInitialState,
  type ConsultationAction,
  type ConsultationState,
} from "../consultationReducer";

const ids = ["a", "b", "c"];

function run(
  actions: ConsultationAction[],
  state = createInitialState(ids),
): ConsultationState {
  return actions.reduce(reduce, state);
}

const answerAndNext = (id: string): ConsultationAction[] => [
  { type: "ANSWER", questionId: id, answer: true },
  { type: "NEXT" },
];

const onLastStepAllAnswered = (): ConsultationState =>
  run([
    ...answerAndNext("a"),
    ...answerAndNext("b"),
    { type: "ANSWER", questionId: "c", answer: false },
  ]);

describe("consultationReducer", () => {
  it("starts on the first question with no answers", () => {
    expect(createInitialState(ids)).toMatchObject({
      step: 0,
      answers: {},
      status: "answering",
    });
  });

  it("records an answer by question id", () => {
    const state = run([{ type: "ANSWER", questionId: "a", answer: false }]);
    expect(state.answers).toEqual({ a: false });
  });

  describe("NEXT", () => {
    it("shows a validation error and stays put when the question is unanswered", () => {
      const state = run([{ type: "NEXT" }]);
      expect(state).toMatchObject({ step: 0, showValidationError: true });
    });

    it("clears the validation error once the question is answered", () => {
      const state = run([
        { type: "NEXT" },
        { type: "ANSWER", questionId: "a", answer: true },
      ]);
      expect(state.showValidationError).toBe(false);
    });

    it("moves to the next question when answered", () => {
      expect(run(answerAndNext("a")).step).toBe(1);
    });

    it("does nothing on the last question", () => {
      const state = onLastStepAllAnswered();
      expect(reduce(state, { type: "NEXT" })).toBe(state);
    });
  });

  describe("BACK", () => {
    it("does nothing on the first question", () => {
      const state = createInitialState(ids);
      expect(reduce(state, { type: "BACK" })).toBe(state);
    });

    it("returns to the previous question and keeps its answer", () => {
      const state = run([...answerAndNext("a"), { type: "BACK" }]);
      expect(state).toMatchObject({ step: 0, answers: { a: true } });
    });
  });

  describe("submission", () => {
    it("is ignored before the last question", () => {
      const state = run([{ type: "ANSWER", questionId: "a", answer: true }]);
      expect(reduce(state, { type: "SUBMIT_START" })).toBe(state);
    });

    it("shows a validation error if the last question is unanswered", () => {
      const state = run([
        ...answerAndNext("a"),
        ...answerAndNext("b"),
        { type: "SUBMIT_START" },
      ]);
      expect(state).toMatchObject({
        status: "answering",
        showValidationError: true,
      });
    });

    it("moves to submitting, then submitted", () => {
      const submitting = reduce(onLastStepAllAnswered(), {
        type: "SUBMIT_START",
      });
      expect(submitting.status).toBe("submitting");
      expect(reduce(submitting, { type: "SUBMIT_SUCCESS" }).status).toBe(
        "submitted",
      );
    });

    it("locks answers and navigation while submitting", () => {
      const submitting = reduce(onLastStepAllAnswered(), {
        type: "SUBMIT_START",
      });
      expect(
        reduce(submitting, { type: "ANSWER", questionId: "c", answer: true }),
      ).toBe(submitting);
      expect(reduce(submitting, { type: "BACK" })).toBe(submitting);
    });

    it("allows a retry after a failure", () => {
      const failed = run(
        [{ type: "SUBMIT_START" }, { type: "SUBMIT_FAILURE" }],
        onLastStepAllAnswered(),
      );
      expect(failed.status).toBe("error");
      expect(reduce(failed, { type: "SUBMIT_START" }).status).toBe(
        "submitting",
      );
    });

    it("ignores everything once submitted", () => {
      const submitted = run(
        [{ type: "SUBMIT_START" }, { type: "SUBMIT_SUCCESS" }],
        onLastStepAllAnswered(),
      );
      expect(reduce(submitted, { type: "BACK" })).toBe(submitted);
      expect(reduce(submitted, { type: "SUBMIT_START" })).toBe(submitted);
    });
  });
});
