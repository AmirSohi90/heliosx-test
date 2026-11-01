import { afterEach, describe, expect, it, vi } from "vitest";
import { submitConsultation } from "../service";
import type { ConsultationSubmission } from "../types";

const submission: ConsultationSubmission = {
  condition: "royal-wave-fatigue",
  consultationVersion: "2026-11-01",
  answers: [
    {
      questionId: "parade-wrist-pain",
      questionText: "Does your wrist ache after a royal parade?",
      answer: true,
    },
  ],
  submittedAt: "2026-11-01T09:00:00.000Z",
};

describe("submitConsultation", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("logs the submission", async () => {
    vi.useFakeTimers();
    const log = vi.spyOn(console, "log").mockImplementation(() => {});

    const pending = submitConsultation(submission);
    await vi.runAllTimersAsync();
    await pending;

    expect(log).toHaveBeenCalledWith("Consultation submitted", submission);
  });
});
