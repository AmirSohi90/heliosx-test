import type { AnswerValue, Consultation } from "@/lib/schema";
import { useReducer } from "react";
import {
  consultationReducer,
  createInitialState,
  isComplete,
  isFirstStep,
  isLastStep,
  isLocked,
} from "./consultationReducer";
import { submitConsultation } from "./service";
import { buildSubmission } from "./utils";

export function useConsultation(consultation: Consultation) {
  const [state, dispatch] = useReducer(
    consultationReducer,
    consultation.questions,
    (questions) => createInitialState(questions.map((q) => q.id)),
  );

  const question = consultation.questions[state.step];
  const lastStep = isLastStep(state);
  const canSubmit = lastStep && isComplete(state) && !isLocked(state);

  const answer = (value: AnswerValue) => {
    dispatch({ type: "ANSWER", questionId: question.id, answer: value });
  };

  const back = () => {
    dispatch({ type: "BACK" });
  };

  const submitStep = async () => {
    if (!lastStep) {
      dispatch({ type: "NEXT" });
      return;
    }

    dispatch({ type: "SUBMIT_START" });

    if (!canSubmit) return;

    try {
      await submitConsultation(buildSubmission(consultation, state.answers));
      dispatch({ type: "SUBMIT_SUCCESS" });
    } catch {
      dispatch({ type: "SUBMIT_FAILURE" });
    }
  };

  return {
    question,
    questionNumber: state.step + 1,
    totalQuestions: consultation.questions.length,
    currentAnswer: state.answers[question.id],
    status: state.status,
    showValidationError: state.showValidationError,
    isFirstStep: isFirstStep(state),
    isLastStep: lastStep,
    answer,
    back,
    submitStep,
  };
}
