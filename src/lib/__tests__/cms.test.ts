import { describe, expect, it } from "vitest";
import { getConsultation, getConsultationSlugs } from "../cms";
import { consultationSchema } from "../schema";

describe("getConsultation", () => {
  it("returns null for an unknown condition", async () => {
    expect(await getConsultation("unknown")).toBeNull();
  });

  it("returns null for built-in object keys", async () => {
    expect(await getConsultation("constructor")).toBeNull();
  });

  it("lists available slugs", async () => {
    expect(await getConsultationSlugs()).toContain("genovian-pear-allergy");
  });
});

describe("consultationSchema", () => {
  const base = { slug: "x", version: "1", conditionName: "X" };

  it("rejects duplicate question ids", () => {
    const result = consultationSchema.safeParse({
      ...base,
      questions: [
        { id: "a", type: "yesNo", text: "One?" },
        { id: "a", type: "yesNo", text: "Two?" },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects unknown question types", () => {
    const result = consultationSchema.safeParse({
      ...base,
      questions: [{ id: "a", type: "slider", text: "One?" }],
    });
    expect(result.success).toBe(false);
  });
});
