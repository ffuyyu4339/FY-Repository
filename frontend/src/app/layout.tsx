import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { NextDevtoolsI18n } from "@/components/next-devtools-i18n";
import { SiteHeader } from "@/components/site-header";

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
  description: "个人求职追踪与 JD 解析项目初始化仓库。",
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
      <body className="min-h-full bg-[var(--color-surface)] text-[var(--color-ink)]">
        <NextDevtoolsI18n />
        <div className="min-h-screen bg-[var(--color-surface)]">
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-[1040px] flex-col px-5 pb-14 pt-6 sm:px-8 lg:px-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
