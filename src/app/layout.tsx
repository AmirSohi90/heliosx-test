import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "../components/Header";

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
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full
  antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Header
          homeHref="/"
          logo={{
            src: "/medexpress-logo.svg",
            alt: "MedExpress home",
            width: 184,
            height: 40,
          }}
        />

        <main
          id="main"
          tabIndex={-1}
          className="mx-auto w-full
  max-w-3xl flex-1 px-4 py-8"
        >
          {children}
        </main>

        <footer className="border-t">
          <div
            className="mx-auto grid max-w-3xl gap-8 px-4 py-8
  md:grid-cols-2"
          >
            <div>Footer column 1</div>
            <div>Footer column 2</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
