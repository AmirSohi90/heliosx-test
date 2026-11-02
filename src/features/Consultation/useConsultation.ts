import type { AnswerValue, Consultation } from "@/lib/schema";
import { useEffect, useReducer } from "react";
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
import { clearProgress, loadProgress, saveProgress } from "./storage";

export function useConsultation(consultation: Consultation) {
  const [state, dispatch] = useReducer(
    consultationReducer,
    consultation.questions,
    (questions) => createInitialState(questions.map((q) => q.id)),
  );

  const question = consultation.questions[state.step];
  const lastStep = isLastStep(state);
  const canSubmit = lastStep && isComplete(state) && !isLocked(state);

  useEffect(() => {
    dispatch({ type: "RESTORE", progress: loadProgress(consultation) });
  }, [consultation]);

  useEffect(() => {
    if (!state.hasRestored || state.status === "submitted") return;
    saveProgress(consultation, { step: state.step, answers: state.answers });
  }, [
    consultation,
    state.hasRestored,
    state.step,
    state.answers,
    state.status,
  ]);

  const answer = (value: AnswerValue) => {
    dispatch({ type: "ANSWER", questionId: question.id, answer: value });
  };

  const back = () => {
    dispatch({ type: "BACK" });
  };

  const next = () => {
    dispatch({ type: "NEXT" });
  };

  const submit = async () => {
    dispatch({ type: "SUBMIT_START" });
    if (!canSubmit) return;

    try {
      await submitConsultation(buildSubmission(consultation, state.answers));
      clearProgress(consultation);
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
    hasRestored: state.hasRestored,
    isFirstStep: isFirstStep(state),
    isLastStep: lastStep,
    answer,
    back,
    next,
    submit,
  };
}
