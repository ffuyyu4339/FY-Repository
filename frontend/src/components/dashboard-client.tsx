"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { fetchDashboardSummary } from "@/lib/api";
import { formatStatusLabel, formatTrackLabel, type DashboardSummary } from "@/lib/types";

export function DashboardClient() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSummary() {
      try {
        setLoading(true);
        const data = await fetchDashboardSummary();
        if (!cancelled) {
          setSummary(data);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "统计面板加载失败");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadSummary();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-[var(--color-line)] bg-white px-4 py-6 text-sm text-[var(--color-muted)]">
        正在加载统计面板...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!summary) {
    return null;
  }

  const stats = [
    { label: "总岗位数", value: summary.total_jobs },
    { label: "上海岗位数", value: summary.shanghai_jobs },
    { label: "高分岗位数", value: summary.top_jobs.length },
    { label: "高频技能数", value: summary.top_skills.length },
  ];

  return (
    <section className="space-y-6">
      <div className="rounded-[1.75rem] border border-[var(--color-line)] bg-[var(--color-panel)] p-6">
        <p className="font-mono text-sm uppercase tracking-[0.2em] text-[var(--color-accent)]">
          /dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold">统计面板</h1>
        <p className="mt-3 max-w-3xl text-[var(--color-muted)]">
          汇总当前岗位总数、状态分布、方向分布、上海岗位数、高分岗位和高频技能词。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-5"
          >
            <p className="text-sm text-[var(--color-muted)]">{item.label}</p>
            <p className="mt-4 text-4xl font-semibold">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-6">
          <h2 className="text-xl font-semibold">状态分布</h2>
          <div className="mt-4 space-y-3">
            {summary.status_counts.map((item) => (
              <div key={item.status} className="flex items-center justify-between text-sm">
                <span>{formatStatusLabel(item.status)}</span>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-6">
          <h2 className="text-xl font-semibold">方向分布</h2>
          <div className="mt-4 space-y-3">
            {summary.track_counts.map((item) => (
              <div key={item.track} className="flex items-center justify-between text-sm">
                <span>{formatTrackLabel(item.track)}</span>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-6">
          <h2 className="text-xl font-semibold">高分岗位 Top N</h2>
          <div className="mt-4 space-y-4">
            {summary.top_jobs.map((job) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="block rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-[var(--color-muted)]">{job.company_name || "未填写公司"}</p>
                <p className="mt-1 font-semibold">{job.job_title || "未填写岗位"}</p>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {job.match_score} 分 · {job.city || "未知城市"}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-[var(--color-line)] bg-white p-6">
          <h2 className="text-xl font-semibold">高频技能词</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {summary.top_skills.map((item) => (
              <span
                key={item.skill}
                className="rounded-full bg-[var(--color-accent-soft)] px-3 py-2 text-sm text-[var(--color-accent)]"
              >
                {item.skill} · {item.count}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
