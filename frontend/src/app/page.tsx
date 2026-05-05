import Link from "next/link";

import { accentButtonClass, secondaryButtonClass } from "@/components/ui";

const missionMetrics = [
  {
    label: "总岗位",
    value: "24",
    detail: "本地求职档案",
    tone: "text-white",
    line: "bg-white/70",
  },
  {
    label: "优先处理",
    value: "5",
    detail: "按匹配分排序",
    tone: "text-orange-200",
    line: "bg-[var(--color-accent)]",
  },
  {
    label: "待分析",
    value: "12",
    detail: "等待 JD 解析",
    tone: "text-amber-200",
    line: "bg-[var(--color-amber)]",
  },
  {
    label: "面试中",
    value: "2",
    detail: "需要跟进",
    tone: "text-blue-200",
    line: "bg-[var(--color-blue)]",
  },
];

const focusJobs = [
  {
    company: "星图智能",
    job: "AI 应用开发工程师",
    score: 92,
    status: "优先处理",
    next: "检查薪资与简历版本",
  },
  {
    company: "海澜数据",
    job: "数据分析师",
    score: 86,
    status: "待投递",
    next: "打开网页手动投递",
  },
  {
    company: "云栈科技",
    job: "Python 后端工程师",
    score: 81,
    status: "待确认",
    next: "补充 JD 原文",
  },
];

const quickActions = [
  {
    href: "/sources",
    label: "01",
    title: "打开入口库",
    body: "进入保存的招聘平台和搜索链接。",
  },
  {
    href: "/jobs/new",
    label: "02",
    title: "录入岗位",
    body: "粘贴 JD 原文并解析结构化字段。",
  },
  {
    href: "/jobs?match_level=priority_apply&sort_by=match_score",
    label: "03",
    title: "处理优先队列",
    body: "按排序建议检查高分候选。",
  },
  {
    href: "/dashboard",
    label: "04",
    title: "查看数据看板",
    body: "复盘方向分布和技能词趋势。",
  },
];

const workflowSteps = [
  ["打开网页", "使用浏览器本地登录态查看岗位"],
  ["复制 JD", "手动复制岗位描述和关键条件"],
  ["解析确认", "提取字段、匹配分和状态建议"],
  ["手动投递", "在招聘平台本人完成投递"],
];

const boundaries = [
  "不保存招聘平台账号、密码、Cookie 或验证码",
  "不自动投递，不抓取招聘网站",
  "LLM 只增强用户主动粘贴的 JD 解析",
];

export default function Home() {
  return (
    <section className="space-y-2.5">
      <section className="relative overflow-hidden rounded-lg border border-black/20 bg-[var(--color-ink)] p-3.5 text-white shadow-[var(--shadow-crisp)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(135deg, rgba(217,91,43,.18), rgba(21,134,168,.12) 46%, transparent 68%)",
            backgroundSize: "36px 36px, 36px 36px, auto",
          }}
        />
        <div className="relative grid gap-3 xl:grid-cols-[minmax(0,1fr)_390px]">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.18em] text-orange-200">
              个人工作区 / 本地求职档案
            </p>
            <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                  求职任务控制台
                </h1>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/62">
                  基于 JD
                  解析字段、偏好配置和状态流给出排序建议；最终判断、打开网页和投递动作都由你手动完成。
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Link
                  href="/sources"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-[var(--color-ink)] transition hover:-translate-y-0.5 hover:bg-[var(--color-accent-soft)] hover:text-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                >
                  打开入口库
                </Link>
                <Link
                  href="/jobs/new"
                  className="inline-flex h-10 items-center justify-center rounded-lg bg-[var(--color-accent)] px-4 text-sm font-semibold text-white shadow-[0_10px_22px_rgba(217,91,43,0.22)] transition hover:-translate-y-0.5 hover:bg-[#b94620] focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                >
                  录入岗位
                </Link>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {missionMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs text-white/52">
                        {metric.label}
                      </p>
                      <p className="mt-1 text-xs text-white/36">
                        {metric.detail}
                      </p>
                    </div>
                    <p
                      className={`text-3xl font-bold tracking-tight ${metric.tone}`}
                    >
                      {metric.value}
                    </p>
                  </div>
                  <span
                    className={`mt-3 block h-1 rounded-full ${metric.line}`}
                  />
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-lg border border-orange-300/20 bg-white/[0.06] p-4">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-orange-200">
              下一轮处理
            </p>
            <div className="mt-3 space-y-2">
              {focusJobs.slice(0, 2).map((job) => (
                <Link
                  key={`${job.company}-${job.job}`}
                  href="/jobs?match_level=priority_apply&sort_by=match_score"
                  className="grid grid-cols-[minmax(0,1fr)_3.25rem] gap-3 rounded-lg border border-white/10 bg-black/10 px-3 py-3 transition hover:border-orange-300/40 hover:bg-white/[0.08]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">
                      {job.job}
                    </span>
                    <span className="mt-1 block truncate text-xs text-white/45">
                      {job.company} · {job.next}
                    </span>
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-sm font-bold text-[var(--color-ink)]">
                    {job.score}
                  </span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="grid gap-3 xl:grid-cols-[250px_minmax(0,1fr)_310px]">
        <aside className="rounded-lg border border-white/70 bg-white p-4 shadow-[var(--shadow-soft)]">
          <p className="text-[11px] font-semibold tracking-[0.16em] text-[var(--color-accent)]">
            快速动作
          </p>
          <div className="mt-3 grid gap-2">
            {quickActions.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group grid grid-cols-[2rem_minmax(0,1fr)] gap-3 rounded-lg border border-[var(--color-border)] bg-white px-3 py-3 transition hover:border-orange-200 hover:bg-[var(--color-accent-soft)]"
              >
                <span className="grid h-8 w-8 place-items-center rounded-md bg-[var(--color-surface-muted)] font-mono text-xs font-semibold text-[var(--color-accent)] group-hover:bg-white">
                  {item.label}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-[var(--color-text-primary)]">
                    {item.title}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[var(--color-text-secondary)]">
                    {item.body}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </aside>

        <section className="min-w-0 overflow-hidden rounded-lg border border-white/70 bg-white shadow-[var(--shadow-soft)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] bg-[var(--color-ink)] px-4 py-3 text-white">
            <div>
              <p className="text-[11px] font-semibold tracking-[0.16em] text-white/45">
                决策队列
              </p>
              <h2 className="mt-1 text-base font-semibold">今天先看这些岗位</h2>
            </div>
            <Link
              href="/jobs"
              className="rounded-lg border border-white/15 bg-white/[0.06] px-3 py-2 text-sm font-semibold text-white/76 transition hover:bg-white hover:text-[var(--color-ink)]"
            >
              查看全部
            </Link>
          </div>

          <div className="hidden grid-cols-[72px_minmax(0,1.2fr)_130px_minmax(150px,0.6fr)] border-b border-[var(--color-border)] bg-[rgba(239,239,241,0.82)] px-4 py-2 text-[11px] font-semibold tracking-[0.12em] text-[var(--color-text-secondary)] lg:grid">
            <span>分数</span>
            <span>岗位信息</span>
            <span>状态</span>
            <span>下一步</span>
          </div>

          {focusJobs.map((job) => (
            <Link
              key={`${job.company}-${job.job}-${job.score}`}
              href="/jobs?match_level=priority_apply&sort_by=match_score"
              className="grid gap-3 border-b border-[var(--color-border)] px-4 py-3 transition last:border-b-0 hover:bg-[var(--color-accent-soft)] lg:grid-cols-[72px_minmax(0,1.2fr)_130px_minmax(150px,0.6fr)] lg:items-center"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-[var(--color-accent-soft)] text-lg font-bold text-[var(--color-accent)]">
                {job.score}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-base font-semibold text-[var(--color-text-primary)]">
                  {job.job}
                </span>
                <span className="mt-1 block truncate text-sm text-[var(--color-text-secondary)]">
                  {job.company} · 上海 / 远程
                </span>
              </span>
              <span className="w-fit rounded-full border border-orange-200 bg-[var(--color-accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--color-accent)]">
                {job.status}
              </span>
              <span className="text-sm leading-6 text-[var(--color-text-secondary)]">
                {job.next}
              </span>
            </Link>
          ))}
        </section>

        <aside className="space-y-3">
          <section className="rounded-lg border border-black/20 bg-[var(--color-ink)] p-4 text-white shadow-[var(--shadow-soft)]">
            <p className="text-[11px] font-semibold tracking-[0.16em] text-orange-200">
              安全边界
            </p>
            <div className="mt-3 space-y-2 text-sm leading-6 text-white/62">
              {boundaries.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/70 bg-white p-4 shadow-[var(--shadow-soft)]">
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
              本地存储 (PostgreSQL)
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-secondary)]">
              岗位、偏好、入口链接和投递事件写入本地数据库，首页只做个人工作区聚合。
            </p>
          </section>

          <div className="grid grid-cols-2 gap-2">
            <Link href="/settings" className={secondaryButtonClass}>
              系统设置
            </Link>
            <Link href="/jobs/new" className={accentButtonClass}>
              新增岗位
            </Link>
          </div>
        </aside>
      </section>

      <section className="grid gap-2 rounded-lg border border-white/70 bg-white p-3 shadow-[var(--shadow-soft)] sm:grid-cols-4">
        {workflowSteps.map(([title, body], index) => (
          <div
            key={title}
            className="rounded-lg bg-[var(--color-surface-muted)] px-3 py-2"
          >
            <p className="font-mono text-xs font-semibold text-[var(--color-accent)]">
              0{index + 1}
            </p>
            <h2 className="mt-1 text-sm font-semibold text-[var(--color-text-primary)]">
              {title}
            </h2>
            <p className="mt-1 text-xs leading-5 text-[var(--color-text-secondary)]">
              {body}
            </p>
          </div>
        ))}
      </section>
    </section>
  );
}
