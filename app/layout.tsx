import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DevHire Tracker — Job search, organised",
    template: "%s · DevHire Tracker",
  },
  description:
    "Track every job application on a Kanban board, never miss a follow-up, and see what is actually working with built-in analytics.",
  applicationName: "DevHire Tracker",
  keywords: [
    "job tracker",
    "job application tracker",
    "kanban",
    "career",
    "Next.js",
  ],
  openGraph: {
    title: "DevHire Tracker",
    description:
      "A Kanban board and analytics dashboard for your job search. Free, fast, and private.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevHire Tracker",
    description:
      "A Kanban board and analytics dashboard for your job search.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f6f9" },
    { media: "(prefers-color-scheme: dark)", color: "#08080c" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
