import { afterEach, describe, expect, it } from "vitest";
import { clearProgress, loadProgress, saveProgress } from "../storage";

const consultation = { slug: "royal-wave-fatigue", version: "2026-11-01" };

describe("progress storage", () => {
  afterEach(() => {
    sessionStorage.clear();
  });

  it("saves and loads progress", () => {
    saveProgress(consultation, {
      step: 1,
      answers: { "parade-wrist-pain": true },
    });
    expect(loadProgress(consultation)).toEqual({
      step: 1,
      answers: { "parade-wrist-pain": true },
    });
  });

  it("returns null when nothing is saved", () => {
    expect(loadProgress(consultation)).toBeNull();
  });

  it("ignores progress saved for a different version of the questions", () => {
    saveProgress(
      { ...consultation, version: "2026-10-01" },
      { step: 1, answers: {} },
    );
    expect(loadProgress(consultation)).toBeNull();
  });

  it("ignores corrupted or tampered data", () => {
    const key = "consultation:royal-wave-fatigue:2026-11-01";

    sessionStorage.setItem(key, "{not json");
    expect(loadProgress(consultation)).toBeNull();

    sessionStorage.setItem(
      key,
      JSON.stringify({ step: "two", answers: { a: "yes" } }),
    );
    expect(loadProgress(consultation)).toBeNull();
  });

  it("clears progress", () => {
    saveProgress(consultation, { step: 0, answers: {} });
    clearProgress(consultation);
    expect(loadProgress(consultation)).toBeNull();
  });
});
