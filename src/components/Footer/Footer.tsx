import type { ReactNode } from "react";

type FooterProps = {
  children: ReactNode;
};

export function Footer({ children }: FooterProps) {
  return (
    <footer className="border-t bg-slate-900 text-white">
      <div className="mx-auto grid max-w-3xl gap-8 px-4 py-8 md:grid-cols-2">
        {children}
      </div>
    </footer>
  );
}
