import type { Consultation } from "./schema";
import { consultationSchema } from "./schema";

const consultations = new Map<string, unknown>([
  [
    "genovian-pear-allergy",
    {
      slug: "genovian-pear-allergy",
      version: "2026-11-01",
      conditionName: "Genovian pear allergy",
      questions: [
        {
          id: "symptoms",
          type: "yesNo",
          text: "Do you get allergic symptoms after eating or touching Genovian pears?",
          hint: "For example sneezing, itching, a rash or an upset stomach.",
        },
        {
          id: "anaphylaxis",
          type: "yesNo",
          text: "Have you ever had a severe allergic reaction?",
          hint: "For example difficulty breathing, or swelling of the face, lips or throat.",
        },
        {
          id: "other-medication",
          type: "yesNo",
          text: "Are you currently taking any other medication?",
          hint: "Include prescription, over-the-counter and herbal remedies.",
        },
        {
          id: "other-conditions",
          type: "yesNo",
          text: "Do you have any other medical conditions?",
          hint: "For example asthma, or liver or kidney disease.",
        },
        {
          id: "pregnancy",
          type: "yesNo",
          text: "Are you pregnant, breastfeeding or planning a pregnancy?",
        },
      ],
    },
  ],
]);

export async function getConsultation(
  slug: string,
): Promise<Consultation | null> {
  const data = consultations.get(slug);
  if (data === undefined) return null;
  return consultationSchema.parse(data);
}

export async function getConsultationSlugs(): Promise<string[]> {
  return [...consultations.keys()];
}
