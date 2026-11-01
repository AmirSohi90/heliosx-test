import type { Consultation } from "@/lib/schema";
import type { Answers } from "./consultationReducer";
import type { ConsultationSubmission } from "./types";

export function buildSubmission(
  consultation: Consultation,
  answers: Answers,
  submittedAt: Date = new Date(),
): ConsultationSubmission {
  return {
    condition: consultation.slug,
    consultationVersion: consultation.version,
    answers: consultation.questions.map((question) => {
      const answer = answers[question.id];
      if (answer === undefined) {
        throw new Error(`Missing answer for question "${question.id}"`);
      }
      return { questionId: question.id, questionText: question.text, answer };
    }),
    submittedAt: submittedAt.toISOString(),
  };
}
