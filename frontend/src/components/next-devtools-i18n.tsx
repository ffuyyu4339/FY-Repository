"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

function getRouteKind(pathname: string) {
  if (pathname.startsWith("/jobs/") && pathname !== "/jobs/new") {
    return "动态";
  }

  return "静态";
}

export function NextDevtoolsI18n() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-[2147483647] font-sans text-slate-950">
      {open ? (
        <div
          aria-label="Next.js 开发工具菜单"
          className="mb-3 w-[370px] overflow-hidden rounded-2xl border border-slate-200 bg-white text-[22px] shadow-[0_18px_46px_rgba(15,23,42,0.18)]"
          role="menu"
        >
          <div className="grid grid-cols-[1fr_auto] gap-6 px-5 py-4">
            <span>路由</span>
            <span className="text-slate-500">{getRouteKind(pathname)}</span>
          </div>
          <div className="grid grid-cols-[1fr_auto] gap-6 px-5 py-4">
            <span>打包器</span>
            <span className="font-medium text-blue-600 underline underline-offset-2">
              Webpack
            </span>
          </div>
          <button
            className="grid w-full grid-cols-[1fr_auto] gap-6 px-5 py-4 text-left hover:bg-slate-50"
            role="menuitem"
            type="button"
          >
            <span>路由信息</span>
            <span className="text-slate-500">›</span>
          </button>
          <button
            className="grid w-full grid-cols-[1fr_auto] gap-6 border-t border-slate-200 px-5 py-4 text-left hover:bg-slate-50"
            role="menuitem"
            type="button"
          >
            <span>偏好设置</span>
            <span className="text-slate-500">⚙</span>
          </button>
        </div>
      ) : null}

      <button
        aria-expanded={open}
        aria-label={open ? "关闭开发工具" : "打开开发工具"}
        className="flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-slate-900 text-2xl text-white shadow-[0_10px_24px_rgba(15,23,42,0.28)] ring-1 ring-slate-950/20 transition hover:bg-[var(--color-accent)]"
        onClick={() => setOpen((current) => !current)}
        type="button"
      >
        N
      </button>
    </div>
  );
}
