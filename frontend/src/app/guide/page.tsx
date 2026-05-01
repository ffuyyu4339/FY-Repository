import Link from "next/link";

const guideSteps = [
  {
    label: "01",
    title: "打开平台入口",
    body: "从平台入口页打开已保存的招聘站点或搜索链接，使用浏览器本地登录态查看岗位。",
  },
  {
    label: "02",
    title: "复制 JD 并录入",
    body: "在平台内手动复制岗位 JD，回到新增岗位页粘贴原文，保留来源平台和岗位链接。",
  },
  {
    label: "03",
    title: "解析并人工确认",
    body: "使用规则或 LLM 解析结构化字段，检查城市、薪资、技能、方向和匹配等级。",
  },
  {
    label: "04",
    title: "手动投递并记录结果",
    body: "在外部平台完成投递后，在岗位详情页记录投递事件和后续笔试、面试、Offer 状态。",
  },
];

export default function GuidePage() {
  return (
    <section className="space-y-5">
      <div className="grid gap-5 border-b border-slate-200 pb-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <p className="font-mono text-xs uppercase text-[var(--color-accent)]">
            workspace / guide
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            使用指南
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            本系统负责收集、解析、记录和复盘，不接管招聘平台账号，也不替你自动投递。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/sources"
            className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[var(--color-accent)]"
          >
            打开平台入口
          </Link>
          <Link
            href="/jobs/new"
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:text-slate-950"
          >
            新增岗位
          </Link>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {guideSteps.map((step) => (
          <section
            key={step.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <p className="font-mono text-xs text-[var(--color-accent)]">
              {step.label}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-slate-950">
              {step.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{step.body}</p>
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-950">边界说明</h2>
        <div className="mt-3 grid gap-3 text-sm leading-6 text-slate-500 md:grid-cols-3">
          <p>
            平台登录只发生在你的浏览器里，系统不保存账号、密码、Cookie
            或验证码。
          </p>
          <p>
            自动化只辅助打开入口、解析 JD、记录投递结果，不模拟点击投递按钮。
          </p>
          <p>
            LLM 只处理你粘贴进系统的 JD 文本，外部招聘页面不会被服务端抓取。
          </p>
        </div>
      </section>
    </section>
  );
}
