import { z } from "zod";

export const yesNoQuestionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("yesNo"),
  text: z.string().min(1),
  hint: z.string().optional(),
});

export const questionSchema = z.discriminatedUnion("type", [
  yesNoQuestionSchema,
]);

export const consultationSchema = z
  .object({
    slug: z.string().min(1),
    version: z.string().min(1),
    conditionName: z.string().min(1),
    questions: z.array(questionSchema).min(1),
  })
  .refine(
    (c) => new Set(c.questions.map((q) => q.id)).size === c.questions.length,
    { message: "Question ids must be unique" },
  );

export type YesNoQuestion = z.infer<typeof yesNoQuestionSchema>;
export type Question = z.infer<typeof questionSchema>;
export type Consultation = z.infer<typeof consultationSchema>;
export type AnswerValue = boolean;
