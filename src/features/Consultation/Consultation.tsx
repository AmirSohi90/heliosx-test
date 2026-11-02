"use client";

import type { Ref } from "react";
import type { Consultation as ConsultationContent } from "@/lib/schema";
import { consultation as copy } from "@/locales/en/consultation";
import { useConsultation } from "./useConsultation";
import { redirect } from "next/navigation";
import { routes } from "@/lib/routes";
import { Button } from "@/components/Button/Button";
import { HelpText } from "@/components/HelpText/HelpText";
import { QuestionStep } from "./components/QuestionStep";
import { formatLocaleStringWithPlaceholders } from "@/utils/formatLocaleString";
import { cn } from "@/utils/cn";

type ConsultationProps = {
  consultation: ConsultationContent;
};

type QuestionHeadingProps = {
  progressText: string;
  questionText: string;
  ref?: Ref<HTMLHeadingElement>;
};

export function Consultation({ consultation }: ConsultationProps) {
  const {
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
    hasRestored,
  } = useConsultation(consultation);

  if (status === "submitted") {
    redirect(routes.consultationComplete(consultation.slug));
  }

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
    <form
      noValidate
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col gap-2 md:gap-4",
        !hasRestored && "invisible",
      )}
    >
      <QuestionStep
        question={question}
        heading={
          <QuestionStepHeading
            questionText={question.text}
            progressText={`${consultation.conditionName} · ${formatLocaleStringWithPlaceholders(
              copy.progress,
              {
                current: questionNumber,
                total: totalQuestions,
              },
            )}`}
          />
        }
        value={currentAnswer}
        showError={showValidationError}
        onAnswer={answer}
      />
      {status === "error" && (
        <HelpText variant="error" role="alert">
          {copy.submitError}
        </HelpText>
      )}
      <div className="flex flex-col-reverse gap-4 sm:flex-row">
        {!isFirstStep && (
          <Button
            type="button"
            onClick={back}
            variant="secondary"
            className="w-full sm:w-auto"
          >
            {backText}
          </Button>
        )}
        <Button
          type="submit"
          aria-disabled={status === "submitting"}
          className="w-full sm:w-auto"
        >
          {!isLastStep ? continueText : submitAnswersButtonText}
        </Button>
      </div>
    </form>
  );
}

function QuestionStepHeading({
  progressText,
  questionText,
  ref,
}: QuestionHeadingProps) {
  return (
    <>
      <span className="block text-gray-600">{progressText}</span>
      <h1
        ref={ref}
        tabIndex={-1}
        className="mt-2 text-2xl font-bold md:text-3xl lg:text-4xl"
      >
        {questionText}
      </h1>
    </>
  );
}
