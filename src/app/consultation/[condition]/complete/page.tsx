import type { Metadata } from "next";
import { consultation as copy } from "@/locales/en/consultation";
import { getConsultationSlugs } from "@/lib/cms";

export const dynamicParams = false;

export const metadata: Metadata = {
  title: copy.thankYou.heading,
};

export async function generateStaticParams() {
  const slugs = await getConsultationSlugs();
  return slugs.map((condition) => ({ condition }));
}

export default function ConsultationCompletePage() {
  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">{copy.thankYou.heading}</h1>
      <p className="mt-4">{copy.thankYou.body}</p>
    </>
  );
}
