import type { AnswerValue, QuestionId } from "@/lib/schema";

export type ConsultationSubmission = {
  condition: string;
  consultationVersion: string;
  answers: {
    questionId: QuestionId;
    questionText: string;
    answer: AnswerValue;
  }[];
  submittedAt: string;
};
