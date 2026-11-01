import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer/Footer";
import { FooterSection } from "@/components/FooterSection/FooterSection";
import { Header } from "@/components/Header/Header";
import { common } from "@/locales/en/common";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "MedExpress Genovia",
    template: "%s | MedExpress Genovia",
  },
  description:
    "Online consultations and prescriptions, delivered across Genovia.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const { footer } = common;
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:text-black"
        >
          {common.skipLink}
        </a>

        <Header
          homeHref="/"
          logo={{
            src: "/medexpress-logo.svg",
            alt: common.header.logoAlt,
            width: 184,
            height: 40,
          }}
        />

        <main
          id="main"
          tabIndex={-1}
          className="mx-auto w-full max-w-3xl flex-1 px-4 py-8"
        >
          {children}
        </main>

        <Footer>
          <FooterSection heading={footer.about.heading}>
            <p>{footer.about.body}</p>
          </FooterSection>
          <FooterSection heading={footer.contact.heading}>
            <p>
              <a href={`mailto:${footer.contact.email}`} className="underline">
                {footer.contact.email}
              </a>
            </p>
            <p>{footer.contact.hours}</p>
          </FooterSection>
        </Footer>
      </body>
    </html>
  );
}
