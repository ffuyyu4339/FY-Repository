import Link from "next/link";

import {
  PageHero,
  accentButtonClass,
  secondaryButtonClass,
} from "@/components/ui";

const flowSteps = [
  {
    title: "打开平台",
    body: "从招聘入口库打开外部平台或搜索链接，使用浏览器本地登录态查看岗位。",
  },
  {
    title: "复制 JD",
    body: "在外部网页中手动复制岗位描述，不让系统抓取招聘页面内容。",
  },
  {
    title: "录入岗位",
    body: "回到 JD Intake Studio，填入来源平台、岗位链接和 JD 原文。",
  },
  {
    title: "解析确认",
    body: "执行 JD 解析，检查公司、城市、薪资、技能、方向、匹配分和等级。",
  },
  {
    title: "手动投递",
    body: "在招聘平台内由你本人完成投递，系统不自动点击投递按钮。",
  },
  {
    title: "跟进结果",
    body: "在岗位详情中更新状态、简历版本、备注和投递事件时间线。",
  },
];

const boundaries = [
  "不保存招聘平台账号、密码、Cookie、验证码或登录令牌。",
  "不模拟登录，不绕过验证码、风控、反爬或平台限制。",
  "不自动抓取招聘平台页面内容，不替用户自动投递或沟通。",
  "LLM 只处理用户主动粘贴到系统内的 JD 文本。",
];

export default function GuidePage() {
  return (
    <section className="space-y-5">
      <PageHero
        breadcrumb="workspace / guide"
        title="流程蓝图"
        description="把外部招聘网页、JD 解析、手动投递和结果跟进串成一条可回溯流程。"
        actions={
          <>
            <Link href="/sources" className={accentButtonClass}>
              打开平台入口
            </Link>
            <Link href="/jobs/new" className={secondaryButtonClass}>
              录入岗位
            </Link>
          </>
        }
      />

      <section className="rounded-lg border border-[var(--color-border)] bg-white p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
              Operating Line
            </p>
            <h2 className="mt-1 text-lg font-semibold text-[var(--color-text-primary)]">
              求职操作线
            </h2>
          </div>
          <span className="hidden text-xs text-[var(--color-text-secondary)] sm:block">
            从入口到跟进
          </span>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-6">
          {flowSteps.map((step, index) => (
            <div key={step.title} className="relative">
              {index < flowSteps.length - 1 ? (
                <span className="absolute left-5 top-5 hidden h-px w-[calc(100%+1rem)] bg-[var(--color-border)] lg:block" />
              ) : null}
              <div className="relative flex gap-3 lg:block">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-ink)] font-mono text-xs font-semibold text-white">
                  0{index + 1}
                </span>
                <div className="min-w-0 lg:mt-4">
                  <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-[var(--color-text-secondary)]">
                    {step.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-[var(--color-border)] bg-white p-5">
        <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
          边界说明
        </h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {boundaries.map((item) => (
            <p
              key={item}
              className="rounded-lg bg-[var(--color-surface-muted)] px-3 py-2 text-sm leading-6 text-[var(--color-text-secondary)]"
            >
              {item}
            </p>
          ))}
        </div>
      </section>
    </section>
  );
}
