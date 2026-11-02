import type { ReactNode } from "react";
import { Radio } from "@/components/Radio/Radio";
import type { AnswerValue, Question } from "@/lib/schema";
import { consultation as copy } from "@/locales/en/consultation";
import { Fieldset } from "@/components/Fieldset/Fieldset";

type QuestionStepProps = {
  question: Question;
  heading: ReactNode;
  value: AnswerValue | undefined;
  showError: boolean;
  onAnswer: (value: AnswerValue) => void;
};

export function QuestionStep({
  question,
  heading,
  value,
  showError,
  onAnswer,
}: QuestionStepProps) {
  switch (question.type) {
    case "yesNo": {
      const options = [
        { value: true, label: copy.yesNo.yes },
        { value: false, label: copy.yesNo.no },
      ];

      return (
        <Fieldset
          legend={heading}
          hint={question.hint}
          error={showError ? copy.yesNo.required : undefined}
        >
          {options.map((option) => (
            <Radio
              key={option.label}
              name={question.id}
              value={String(option.value)}
              label={option.label}
              checked={value === option.value}
              onChange={() => onAnswer(option.value)}
            />
          ))}
        </Fieldset>
      );
    }

    default: {
      const unhandled: never = question.type;
      throw new Error(`Unsupported question type: ${unhandled}`);
    }
  }
}
