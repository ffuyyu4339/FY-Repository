import Link from "next/link";
import { quickLinks } from "@/lib/project";

const workflowSteps = [
  {
    label: "01",
    title: "收集岗位",
    body: "从招聘平台复制 JD，新建岗位时直接粘贴原文。",
  },
  {
    label: "02",
    title: "解析修正",
    body: "一键提取城市、薪资、技能、方向和匹配分，再手动确认。",
  },
  {
    label: "03",
    title: "投递跟进",
    body: "用状态流记录待投递、已投递、笔试、面试和 Offer。",
  },
  {
    label: "04",
    title: "复盘决策",
    body: "在 Dashboard 查看高分岗位、状态分布和高频技能。",
  },
];

export default function Home() {
  return (
    <section className="space-y-6">
      <div className="grid gap-5 border-b border-[var(--color-line)] pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--color-accent)]">
            Job Tracker + JD Analyzer
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">
            今天的求职工作从这里开始
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            入口按真实流程组织：先录入
            JD，再解析修正，随后投递跟进，最后用统计结果复盘方向。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/jobs/new"
            className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)]"
          >
            新增岗位
          </Link>
          <Link
            href="/jobs?status=ready_to_apply&sort_by=match_score"
            className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:border-slate-300 hover:text-[var(--color-ink)]"
          >
            处理待投递
          </Link>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {workflowSteps.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-[var(--color-line)] bg-white p-4 shadow-[0_14px_32px_rgba(15,23,42,0.04)]"
          >
            <span className="font-mono text-xs text-[var(--color-accent)]">
              {item.label}
            </span>
            <h2 className="mt-2 text-base font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {quickLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-[var(--color-line)] bg-white p-5 transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-[var(--color-accent-soft)]"
          >
            <p className="font-mono text-xs text-[var(--color-accent)]">
              {item.label}
            </p>
            <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
