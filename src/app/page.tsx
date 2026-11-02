import Link from "next/link";
import { home } from "@/locales/en/home";
import { routes } from "@/lib/routes";

export default function Home() {
  const { heading, intro, startConsultation } = home;
  return (
    <>
      <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl">{heading}</h1>
      <p className="mt-4">{intro}</p>
      <Link
        href={routes.consultation("genovian-pear-allergy")}
        className="mt-8 inline-flex min-h-11 items-center rounded bg-blue-700 px-6 font-semibold text-white hover:bg-blue-800 focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {startConsultation}
      </Link>
    </>
  );
}
