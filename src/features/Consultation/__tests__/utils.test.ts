import { describe, expect, it } from "vitest";
import type { Consultation } from "@/lib/schema";
import { buildSubmission } from "../utils";

const consultation: Consultation = {
  slug: "royal-wave-fatigue",
  version: "2026-11-01",
  conditionName: "Royal wave fatigue",
  questions: [
    {
      id: "parade-wrist-pain",
      type: "yesNo",
      text: "Does your wrist ache after a royal parade?",
    },
    {
      id: "pear-exposure",
      type: "yesNo",
      text: "Have you handled a Genovian pear in the last 24 hours?",
    },
  ],
};

describe("buildSubmission", () => {
  it("maps answers to the payload in question order, with question text", () => {
    const submission = buildSubmission(
      consultation,
      { "pear-exposure": false, "parade-wrist-pain": true },
      new Date("2026-11-01T09:00:00Z"),
    );

    expect(submission).toEqual({
      condition: "royal-wave-fatigue",
      consultationVersion: "2026-11-01",
      answers: [
        {
          questionId: "parade-wrist-pain",
          questionText: "Does your wrist ache after a royal parade?",
          answer: true,
        },
        {
          questionId: "pear-exposure",
          questionText: "Have you handled a Genovian pear in the last 24 hours?",
          answer: false,
        },
      ],
      submittedAt: "2026-11-01T09:00:00.000Z",
    });
  });

  it("throws if a question is unanswered", () => {
    expect(() =>
      buildSubmission(consultation, { "parade-wrist-pain": true }),
    ).toThrow('Missing answer for question "pear-exposure"');
  });
});
