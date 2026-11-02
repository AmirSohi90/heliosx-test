import { z } from "zod";
import type { Consultation } from "@/lib/schema";

const savedProgressSchema = z.object({
  step: z.number().int().min(0),
  answers: z.record(z.string(), z.boolean()),
});

export type SavedProgress = z.infer<typeof savedProgressSchema>;

type ConsultationKey = Pick<Consultation, "slug" | "version">;

function storageKey({ slug, version }: ConsultationKey) {
  return `consultation:${slug}:${version}`;
}

export function loadProgress(
  consultation: ConsultationKey,
): SavedProgress | null {
  try {
    const raw = sessionStorage.getItem(storageKey(consultation));
    if (raw === null) return null;
    const result = savedProgressSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

export function saveProgress(
  consultation: ConsultationKey,
  progress: SavedProgress,
) {
  try {
    sessionStorage.setItem(storageKey(consultation), JSON.stringify(progress));
  } catch {}
}

export function clearProgress(consultation: ConsultationKey) {
  try {
    sessionStorage.removeItem(storageKey(consultation));
  } catch {}
}
