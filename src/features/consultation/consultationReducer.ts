import { AnswerValue } from "@/lib/schema";

export type Answers = Record<string, AnswerValue>;

export type ConsultationStatus =
  | "answering"
  | "submitting"
  | "error"
  | "submitted";

export type ConsultationState = {
  questionIds: string[];
  step: number;
  answers: Answers;
  status: ConsultationStatus;
  showValidationError: boolean;
};

export type ConsultationAction =
  | { type: "ANSWER"; questionId: string; answer: AnswerValue }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_FAILURE" };

export function createInitialState(questionIds: string[]): ConsultationState {
  return {
    questionIds,
    step: 0,
    answers: {},
    status: "answering",
    showValidationError: false,
  };
}

export function isCurrentAnswered(state: ConsultationState): boolean {
  return state.answers[state.questionIds[state.step]] !== undefined;
}

export function isComplete(state: ConsultationState): boolean {
  return state.questionIds.every((id) => state.answers[id] !== undefined);
}

export function isLastStep(state: ConsultationState): boolean {
  return state.step === state.questionIds.length - 1;
}

export function consultationReducer(
  state: ConsultationState,
  action: ConsultationAction,
): ConsultationState {
  const isLocked =
    state.status === "submitting" || state.status === "submitted";

  switch (action.type) {
    case "ANSWER":
      if (isLocked) return state;
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.answer },
        showValidationError: false,
      };

    case "NEXT":
      if (isLocked || isLastStep(state)) return state;
      if (!isCurrentAnswered(state))
        return { ...state, showValidationError: true };
      return { ...state, step: state.step + 1, showValidationError: false };

    case "BACK":
      if (isLocked || state.step === 0) return state;
      return {
        ...state,
        step: state.step - 1,
        status: "answering",
        showValidationError: false,
      };

    case "SUBMIT_START":
      if (isLocked || !isLastStep(state)) return state;
      if (!isComplete(state)) return { ...state, showValidationError: true };
      return { ...state, status: "submitting", showValidationError: false };

    case "SUBMIT_SUCCESS":
      if (state.status !== "submitting") return state;
      return { ...state, status: "submitted" };

    case "SUBMIT_FAILURE":
      if (state.status !== "submitting") return state;
      return { ...state, status: "error" };
  }
}
