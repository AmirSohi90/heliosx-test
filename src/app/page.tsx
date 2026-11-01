import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-3xl font-bold">
        Treatment for Genovian pear allergy
      </h1>
      <p className="mt-4">
        Answer a few questions online. A Genovian doctor will review your
        answers today and, if suitable, prescribe treatment delivered monthly to
        your door.
      </p>
      <Link
        href="/consultation/genovian-pear-allergy"
        className="mt-8 inline-flex min-h-11 items-center rounded
  bg-blue-700 px-6 font-semibold text-white hover:bg-blue-800
  focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        Start consultation
      </Link>
    </>
  );
}
