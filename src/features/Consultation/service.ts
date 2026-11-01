import type { ConsultationSubmission } from "./types";

export async function submitConsultation(
  submission: ConsultationSubmission,
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("Consultation submitted", submission);
}
