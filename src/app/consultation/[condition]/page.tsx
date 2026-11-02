import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getConsultation, getConsultationSlugs } from "@/lib/cms";
import { Consultation } from "@/features/Consultation";

export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await getConsultationSlugs();
  return slugs.map((condition) => ({ condition }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ condition: string }>;
}): Promise<Metadata> {
  const { condition } = await params;
  const consultation = await getConsultation(condition);
  return {
    title: consultation
      ? `${consultation.conditionName} consultation`
      : "Consultation not found",
  };
}

export default async function ConsultationPage({
  params,
}: {
  params: Promise<{ condition: string }>;
}) {
  const { condition } = await params;
  const consultation = await getConsultation(condition);
  if (!consultation) notFound();

  return <Consultation consultation={consultation} />;
}
