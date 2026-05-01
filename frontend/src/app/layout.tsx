import type { Metadata } from "next";
import { IBM_Plex_Mono, Manrope } from "next/font/google";
import "./globals.css";
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
        <div className="min-h-screen bg-[linear-gradient(180deg,#f7f8f4_0%,#f8fafc_48%,#eef4f7_100%)]">
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-[1040px] flex-col px-5 pb-14 pt-6 sm:px-8 lg:px-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
