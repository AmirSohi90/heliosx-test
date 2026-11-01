"use client";

import type { Consultation as ConsultationContent } from "@/lib/schema";
import { consultation as copy } from "@/locales/en/consultation";
import { formatLocaleStringWithPlaceholders } from "@/utils/formatLocaleString";
import { useConsultation } from "./useConsultation";

type ConsultationProps = {
  consultation: ConsultationContent;
};

export function Consultation({ consultation }: ConsultationProps) {
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
  } = useConsultation(consultation);

  const options = [
    { value: true, label: copy.yesNo.yes },
    { value: false, label: copy.yesNo.no },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLastStep) {
      await submit();
    } else {
      next();
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit}>
      <fieldset>
        <legend>
          <span className="block text-gray-600">
            {consultation.conditionName} ·{" "}
            {formatLocaleStringWithPlaceholders(copy.progress, {
              current: questionNumber,
              total: totalQuestions,
            })}
          </span>
          <h1 className="mt-2 text-2xl font-bold">{question.text}</h1>
        </legend>

        {question.hint && <p className="mt-2 text-gray-600">{question.hint}</p>}

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

      <div className="mt-8 flex gap-4">
        {!isFirstStep && (
          <button
            type="button"
            onClick={back}
            className="min-h-11 rounded border px-6 font-semibold"
          >
            {copy.back}
          </button>
        )}
        <button
          type="submit"
          className="min-h-11 rounded bg-blue-700 px-6 font-semibold text-white"
        >
          {isLastStep ? copy.submit : copy.continue}
        </button>
      </div>
    </form>
  );
}
