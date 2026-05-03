import Link from "next/link";

const workflowSteps = [
  {
    label: "01",
    title: "打开来源网页",
    body: "从平台入口进入招聘站点，用浏览器本地登录态查看岗位。",
  },
  {
    label: "02",
    title: "复制 JD 原文",
    body: "保留公司、岗位、薪资、要求、职责和技能关键词。",
  },
  {
    label: "03",
    title: "解析并修正",
    body: "自动提取结构化字段、匹配分和匹配等级后人工确认。",
  },
  {
    label: "04",
    title: "投递与复盘",
    body: "用状态流和 Dashboard 跟进投递、面试与技能趋势。",
  },
];

const sourceTabs = ["BOSS直聘", "猎聘", "拉勾", "自定义链接"];

const jdSignals = [
  { label: "公司", value: "星图智能" },
  { label: "岗位", value: "AI 应用开发工程师" },
  { label: "城市", value: "上海 / 远程" },
  { label: "薪资", value: "25K-35K" },
];

const workspaceLinks = [
  {
    href: "/sources",
    eyebrow: "Source",
    title: "平台入口",
    body: "保存搜索页和筛选条件，打开外部网页后回到系统录入 JD。",
  },
  {
    href: "/jobs/new",
    eyebrow: "JD",
    title: "新增岗位",
    body: "粘贴 JD 原文，解析公司、岗位、薪资、经验、技能和方向。",
  },
  {
    href: "/jobs?status=ready_to_apply&sort_by=match_score",
    eyebrow: "Queue",
    title: "待投递队列",
    body: "按匹配分处理高优先级岗位，并维护状态和简历版本。",
  },
  {
    href: "/dashboard",
    eyebrow: "Review",
    title: "统计复盘",
    body: "查看方向分布、高分岗位和高频技能词，调整求职策略。",
  },
];

export default function Home() {
  return (
    <section className="space-y-7">
      <div className="grid gap-6 border-b border-[var(--color-line)] pb-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--color-accent)]">
            Job Tracker + JD Analyzer
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
            把招聘网页里的 JD 变成可比较的投递队列
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-[var(--color-muted)]">
            从来源网页打开岗位，复制
            JD，解析成结构化字段，再用匹配分和状态流决定下一步。
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/sources"
              className="rounded-full bg-[var(--color-ink)] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)]"
            >
              打开平台入口
            </Link>
            <Link
              href="/jobs/new"
              className="rounded-full border border-[var(--color-line)] bg-white px-4 py-2 text-sm font-medium text-[var(--color-muted)] shadow-sm transition hover:border-slate-300 hover:text-[var(--color-ink)]"
            >
              粘贴 JD 解析
            </Link>
          </div>
        </div>

        <div className="min-w-0 max-w-full overflow-hidden rounded-[1.35rem] border border-slate-200 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
          <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            <div className="ml-2 min-w-0 max-w-[220px] flex-1 truncate rounded-full bg-slate-100 px-3 py-1.5 font-mono text-[11px] text-slate-500 sm:max-w-none">
              https://job.example.com/search?city=shanghai&keyword=LLM
            </div>
          </div>
          <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="border-b border-slate-100 p-4 lg:border-b-0 lg:border-r">
              <p className="text-xs font-semibold text-slate-500">
                招聘网页来源
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {sourceTabs.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">搜索条件</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    上海 · AI 应用 · Python / LLM / RAG
                  </p>
                </div>
                <div className="rounded-xl border border-orange-100 bg-orange-50 p-3">
                  <p className="text-xs text-orange-700">下一步</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">
                    打开网页，复制 JD，回到新增岗位
                  </p>
                </div>
              </div>
            </div>

            <div className="min-w-0 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-500">
                    JD 摘要
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950">
                    AI 应用开发工程师
                  </h2>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  92 分
                </span>
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {jdSignals.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
                  >
                    <p className="text-[11px] text-slate-400">{item.label}</p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-slate-900">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
                <p className="text-xs font-semibold text-slate-500">
                  技能关键词
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {["Python", "LLM", "RAG", "REST API", "Docker"].map(
                    (skill) => (
                      <span
                        key={skill}
                        className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
                      >
                        {skill}
                      </span>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {workflowSteps.map((item) => (
          <div
            key={item.label}
            className="group border-l border-slate-200 bg-white/60 px-4 py-3 transition hover:border-[var(--color-accent)] hover:bg-white"
          >
            <span className="font-mono text-xs text-[var(--color-accent)]">
              {item.label}
            </span>
            <h2 className="mt-2 text-base font-semibold text-slate-950">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-3 lg:grid-cols-4">
        {workspaceLinks.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-2xl border border-[var(--color-line)] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-[var(--color-accent-soft)]"
          >
            <p className="font-mono text-xs text-[var(--color-accent)]">
              {item.eyebrow}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-950">
              {item.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
              {item.body}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
