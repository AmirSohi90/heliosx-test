import { render, screen } from "@testing-library/react";
import { notFound } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import ConsultationPage, {
  generateMetadata,
  generateStaticParams,
} from "../page";

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  redirect: vi.fn(),
}));

const props = (condition: string) => ({
  params: Promise.resolve({ condition }),
});

describe("consultation page", () => {
  it("is statically generated for each consultation in the CMS", async () => {
    expect(await generateStaticParams()).toContainEqual({
      condition: "genovian-pear-allergy",
    });
  });

  it("titles the page after the condition", async () => {
    expect(await generateMetadata(props("genovian-pear-allergy"))).toEqual({
      title: "Genovian pear allergy consultation",
    });
  });

  it("renders the first question of the consultation", async () => {
    render(await ConsultationPage(props("genovian-pear-allergy")));

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Do you get allergic symptoms after eating or touching Genovian pears?",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Question 1 of 5/)).toBeInTheDocument();
  });

  it("returns a 404 for an unknown condition", async () => {
    await expect(ConsultationPage(props("unknown"))).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );
    expect(notFound).toHaveBeenCalled();
  });
});
