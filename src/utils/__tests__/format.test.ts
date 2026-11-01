import { describe, expect, it } from "vitest";
import { formatLocaleStringWithPlaceholders } from "../formatLocaleString";

describe("format", () => {
  it("replaces placeholders with values", () => {
    expect(
      formatLocaleStringWithPlaceholders("Question {current} of {total}", {
        current: 2,
        total: 5,
      }),
    ).toBe("Question 2 of 5");
  });

  it("leaves unknown placeholders untouched", () => {
    expect(formatLocaleStringWithPlaceholders("Hello {name}", {})).toBe(
      "Hello {name}",
    );
  });
});
