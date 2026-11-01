import Link from "next/link";
import { home } from "@/locales/home";

export default function Home() {
  const { heading, intro, startConsultation } = home;
  return (
    <>
      <h1 className="text-3xl font-bold">{heading}</h1>
      <p className="mt-4">{intro}</p>
      <Link
        href="/consultation/genovian-pear-allergy"
        className="mt-8 inline-flex min-h-11 items-center rounded
  bg-blue-700 px-6 font-semibold text-white hover:bg-blue-800
  focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {startConsultation}
      </Link>
    </>
  );
}
