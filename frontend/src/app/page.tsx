import Link from "next/link";
import { quickLinks } from "@/lib/project";

export default function Home() {
  return (
    <section className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
      <div className="rounded-[2rem] border border-[var(--color-line)] bg-[var(--color-panel)] p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-[var(--color-accent)]">
          Job Tracker + JD Analyzer
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl">
          Job Tracker + JD Analyzer 已经进入可用 MVP 实现阶段。
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
          现在可以在这里完成岗位录入、JD 解析、人工修正、投递状态维护与统计面板查看，后端通过
          FastAPI 提供 CRUD、Analyzer 与 Dashboard API。
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/jobs"
            className="rounded-full bg-[var(--color-accent)] px-5 py-3 font-medium text-white transition hover:-translate-y-0.5"
          >
            进入岗位列表
          </Link>
          <Link
            href="/dashboard"
            className="rounded-full border border-[var(--color-line)] bg-white px-5 py-3 font-medium text-[var(--color-ink)] transition hover:border-[var(--color-accent)]"
          >
            查看统计面板
          </Link>
        </div>
      </div>

      <div className="grid gap-4">
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[1.5rem] border border-[var(--color-line)] bg-[var(--color-panel-strong)] p-6 transition hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(194,65,12,0.12)]"
          >
            <p className="font-mono text-sm text-[var(--color-accent)]">{item.label}</p>
            <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">{item.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
