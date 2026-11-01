import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
  homeHref: string;
  logo: { src: string; alt: string; width: number; height: number };
};

export function Header({ homeHref, logo }: HeaderProps) {
  return (
    <header className="bg-slate-900">
      <div className="mx-auto max-w-3xl px-4 py-4">
        <Link
          href={homeHref}
          className="inline-flex min-h-11 items-center
  focus-visible:outline-2 focus-visible:outline-offset-4
  focus-visible:outline-white"
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            preload
            className="h-8 w-auto md:h-10 lg:h-12"
          />
        </Link>
      </div>
    </header>
  );
}
