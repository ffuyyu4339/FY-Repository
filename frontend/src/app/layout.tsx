import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/app-shell";
import { NextDevtoolsI18n } from "@/components/next-devtools-i18n";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Job Tracker + JD Analyzer",
  description: "个人求职追踪、JD 解析与投递决策作战台。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${manrope.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--color-paper)] text-[var(--color-text-primary)]">
        <NextDevtoolsI18n />
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
