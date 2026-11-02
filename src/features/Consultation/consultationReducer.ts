import type { AnswerValue, QuestionId } from "@/lib/schema";

export type Answers = Record<QuestionId, AnswerValue>;

export type ConsultationStatus =
  | "answering"
  | "submitting"
  | "error"
  | "submitted";

export type ConsultationState = {
  questionIds: QuestionId[];
  step: number;
  answers: Answers;
  status: ConsultationStatus;
  showValidationError: boolean;
  hasRestored: boolean;
};

export type ConsultationAction =
  | { type: "ANSWER"; questionId: QuestionId; answer: AnswerValue }
  | { type: "NEXT" }
  | { type: "BACK" }
  | { type: "SUBMIT_START" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_FAILURE" }
  | { type: "RESTORE"; progress: { step: number; answers: Answers } | null };

export function createInitialState(
  questionIds: QuestionId[],
): ConsultationState {
  return {
    questionIds,
    step: 0,
    answers: {},
    status: "answering",
    showValidationError: false,
    hasRestored: false,
  };
}

export function consultationReducer(
  state: ConsultationState,
  action: ConsultationAction,
): ConsultationState {
  switch (action.type) {
    case "ANSWER":
      if (isLocked(state)) return state;
      return {
        ...state,
        answers: { ...state.answers, [action.questionId]: action.answer },
        showValidationError: false,
      };

    case "NEXT":
      if (isLocked(state) || isLastStep(state)) return state;
      if (!isCurrentAnswered(state))
        return { ...state, showValidationError: true };
      return { ...state, step: state.step + 1, showValidationError: false };

    case "BACK":
      if (isLocked(state) || isFirstStep(state)) return state;
      return {
        ...state,
        step: state.step - 1,
        status: "answering",
        showValidationError: false,
      };

    case "SUBMIT_START":
      if (isLocked(state) || !isLastStep(state)) return state;
      if (!isComplete(state)) return { ...state, showValidationError: true };
      return { ...state, status: "submitting", showValidationError: false };

    case "SUBMIT_SUCCESS":
      if (state.status !== "submitting") return state;
      return { ...state, status: "submitted" };

    case "SUBMIT_FAILURE":
      if (state.status !== "submitting") return state;
      return { ...state, status: "error" };

    case "RESTORE": {
      if (state.hasRestored || state.status !== "answering") return state;
      if (!action.progress) return { ...state, hasRestored: true };

      const answers: Answers = {};
      for (const id of state.questionIds) {
        const answer = action.progress.answers[id];
        if (answer !== undefined) answers[id] = answer;
      }

      const firstUnanswered = state.questionIds.findIndex(
        (id) => answers[id] === undefined,
      );
      const lastAllowedStep =
        firstUnanswered === -1 ? state.questionIds.length - 1 : firstUnanswered;

      return {
        ...state,
        answers,
        step: Math.min(Math.max(action.progress.step, 0), lastAllowedStep),
        showValidationError: false,
        hasRestored: true,
      };
    }
  }
}

export function isCurrentAnswered(state: ConsultationState): boolean {
  return state.answers[state.questionIds[state.step]] !== undefined;
}

export function isComplete(state: ConsultationState): boolean {
  return state.questionIds.every((id) => state.answers[id] !== undefined);
}

export function isFirstStep(state: ConsultationState): boolean {
  return state.step === 0;
}

export function isLastStep(state: ConsultationState): boolean {
  return state.step === state.questionIds.length - 1;
}

export function isLocked(state: ConsultationState): boolean {
  return state.status === "submitting" || state.status === "submitted";
}
