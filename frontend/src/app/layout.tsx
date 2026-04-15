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
        <div className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7ed_0%,#fef3c7_24%,#f8fafc_60%)]">
          <SiteHeader />
          <main className="mx-auto flex w-full max-w-6xl flex-col px-4 pb-12 pt-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
