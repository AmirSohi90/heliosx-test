"use client";

import type { Consultation as ConsultationContent } from "@/lib/schema";
import { consultation as copy } from "@/locales/en/consultation";
import { formatLocaleStringWithPlaceholders } from "@/utils/formatLocaleString";
import { useConsultation } from "./useConsultation";
import { useId } from "react";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { Button } from "@/components/Button/Button";

type ConsultationProps = {
  consultation: ConsultationContent;
};

export function Consultation({ consultation }: ConsultationProps) {
  const {
    yesNo,
    progress,
    back: backText,
    submit: submitText,
    submitting,
    continue: continueText,
  } = copy;
  const {
    question,
    questionNumber,
    totalQuestions,
    currentAnswer,
    isFirstStep,
    isLastStep,
    answer,
    back,
    next,
    submit,
    showValidationError,
    status,
  } = useConsultation(consultation);

  const errorId = useId();

  if (status === "submitted") {
    redirect(routes.consultationComplete(consultation.slug));
  }

  const options = [
    { value: true, label: yesNo.yes },
    { value: false, label: yesNo.no },
  ];

  const submitAnswersButtonText =
    status === "submitting" ? submitting : submitText;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isLastStep) {
      next();
      return;
    }
    await submit();
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <fieldset>
        <legend>
          <span className="block text-gray-600">
            {consultation.conditionName} ·{" "}
            {formatLocaleStringWithPlaceholders(progress, {
              current: questionNumber,
              total: totalQuestions,
            })}
          </span>
          <h1 className="mt-2 text-2xl font-bold">{question.text}</h1>
        </legend>

        {question.hint && <p className="mt-2 text-gray-600">{question.hint}</p>}
        {showValidationError && (
          <p id={errorId} className="mt-4 font-semibold text-red-700">
            {yesNo.required}
          </p>
        )}

        <div className="mt-6 space-y-3">
          {options.map((option) => (
            <label
              key={option.label}
              className="flex min-h-11 cursor-pointer items-center gap-3"
            >
              <input
                type="radio"
                name={question.id}
                checked={currentAnswer === option.value}
                onChange={() => answer(option.value)}
                className="size-6"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
      {status === "error" && (
        <p role="alert" className="mt-6 font-semibold text-red-700">
          {copy.submitError}
        </p>
      )}
      <div className="mt-8 flex gap-4">
        {!isFirstStep && (
          <Button type="button" onClick={back} variant="secondary">
            {backText}
          </Button>
        )}
        <Button type="submit" aria-disabled={status === "submitting"}>
          {!isLastStep ? continueText : submitAnswersButtonText}
        </Button>
      </div>
    </form>
  );
}
