# Job Tracker + JD Analyzer - 单独验收回执单

## 文档用途
本文件用于记录本项目各阶段和最终交付的验收状态。

---

## 项目信息
- 项目名称：Job Tracker + JD Analyzer
- 技术栈：React + Next.js + Python + FastAPI + PostgreSQL + Docker + Linux
- 验收范围：MVP + 合规辅助自动化增强
- 验收基准：`docs/job-tracker/PRD.md`
- 当前状态：非 Docker MVP+ 验收通过；Docker 验证按用户要求暂时搁置
- 最终结论：本机非 Docker MVP+ 验收通过；Docker Compose 全量验收延期，未计入当前继续推进范围

---

## 验收状态说明
- `PENDING`：未验收
- `PASS`：通过
- `FAIL`：未通过
- `BLOCKED`：阻塞

---

## A. 治理与初始化验收

| 编号 | 验收项 | 状态 | 验收说明 |
|---|---|---|---|
| A-01 | `AGENTS.md` 已建立 | PASS | 已按约束技术栈与治理规则创建 |
| A-02 | PRD 已建立且范围清晰 | PASS | 已写入 MVP 范围、边界与验收标准 |
| A-03 | 任务卡已建立 | PASS | 已建立并同步当前完成状态 |
| A-04 | 操作日志已建立 | PASS | 已记录初始化与重构日志 |
| A-05 | 验收回执单已建立 | PASS | 已建立并同步当前验收状态 |

---

## B. 工程脚手架验收

| 编号 | 验收项 | 状态 | 验收说明 |
|---|---|---|---|
| B-01 | Next.js 前端初始化完成 | PASS | 已迁移到 `frontend/` 并保留 TypeScript + Tailwind |
| B-02 | FastAPI 后端初始化完成 | PASS | 已创建 `backend/app` 基础骨架 |
| B-03 | Dockerfile 已完成 | PASS | 前后端 Dockerfile 均已创建 |
| B-04 | docker-compose.yml 已完成 | PASS | 已创建根级服务编排文件 |
| B-05 | Docker Compose 可启动基础服务 | BLOCKED | Docker CLI / Compose 插件存在，Compose 配置可解析且容器内部地址已修正为 `db:5432` / `backend:8000`，但 Docker Desktop Linux Engine 不可连接；按用户要求暂时搁置 |
| B-06 | Linux 运行说明完整 | PASS | README 已补充 Linux 部署与运行说明 |

---

## C. 数据层验收

| 编号 | 验收项 | 状态 | 验收说明 |
|---|---|---|---|
| C-01 | PostgreSQL schema 已实现 | PASS | `jobs` 表结构已在 SQL 与模型中定义 |
| C-02 | 数据库初始化脚本已完成 | PASS | `db/init.sql` 已创建 |
| C-03 | FastAPI 数据库连接正常 | PASS | PostgreSQL 16 已安装，`jobtracker` 数据库已初始化，`/api/jobs` 已通过真实数据库返回空列表 |
| C-04 | jobs 数据访问层可用 | PASS | 已创建基础仓储与 schema 骨架 |
| C-05 | MVP+ 新增数据表可用 | PASS | 已新增 `app_preferences`、`source_links`、`job_events`，并通过 `python -m app.cli init-db` 应用到本机 PostgreSQL |

---

## D. 后端 API 验收

| 编号 | 验收项 | 状态 | 验收说明 |
|---|---|---|---|
| D-01 | Jobs CRUD API 可用 | PASS | 已实现列表、创建、详情、更新、删除接口 |
| D-02 | Analyzer API 可用 | PASS | 已实现 JD 解析、字段抽取、匹配分与匹配等级返回 |
| D-03 | Dashboard API 可用 | PASS | 已实现总数、状态分布、方向分布、上海岗位数、Top N、高频技能词汇总 |
| D-04 | API 错误处理基础可用 | PASS | 已补充 404、422、500 级别基础错误响应 |
| D-05 | Preferences API 可用 | PASS | `GET/PUT /api/preferences` 已实现并通过本机 API 验证 |
| D-06 | Source Links API 可用 | PASS | `GET/POST/PUT/DELETE /api/source-links` 已实现，默认平台入口可返回 |
| D-07 | Job Events API 可用 | PASS | `GET/POST /api/jobs/{id}/events` 已实现，临时岗位事件记录验证通过 |
| D-08 | MVP+ 列表逻辑修复可用 | PASS | 搜索已覆盖技能数组和关键词数组，`status_group=interviewing` 已覆盖一面、二面、HR 面 |

---

## E. 前端页面验收

| 编号 | 验收项 | 状态 | 验收说明 |
|---|---|---|---|
| E-01 | `/jobs` 页面可用 | PASS | 已接入岗位列表请求，支持筛选、排序与详情跳转；已按浏览器备注优化导航、头部、筛选区、状态信息与空状态视觉 |
| E-02 | `/jobs/new` 页面可用 | PASS | 已接入新增岗位表单与 JD 解析入口；已重构为左侧 JD 原文与解析、右侧结构化表单的 split-pane 工作流布局；当 Codespaces 浏览器仍注入 `http://localhost:8000` 时，前端会自动改写为当前工作区的 8000 转发地址 |
| E-03 | `/jobs/[id]` 页面可用 | PASS | 已接入详情编辑、状态维护与删除操作 |
| E-04 | `/dashboard` 页面可用 | PASS | 已接入统计汇总、高分岗位与技能词展示 |
| E-05 | 页面基础导航可用 | PASS | 已提供首页入口、全局导航与页面布局 |
| E-06 | `/sources` 页面可用 | PASS | 已新增平台入口页，支持展示默认来源、打开外部链接、创建/编辑/删除来源、跳转新增岗位并预填平台与链接 |
| E-07 | `/settings` 页面可用 | PASS | 已新增偏好设置页，支持目标城市、方向、技能、薪资、默认简历版本与 LLM 开关 |
| E-08 | `/guide` 页面可用 | PASS | 已新增新人使用指南页，说明平台入口、复制 JD、解析确认、手动投递与记录结果流程 |

---

## F. JD Analyzer 验收

| 编号 | 验收项 | 状态 | 验收说明 |
|---|---|---|---|
| F-01 | 可粘贴 JD 原文 | PASS | 详情/新增页已提供 JD 原文输入区 |
| F-02 | 技能关键词提取可用 | PASS | 已接入后端分析结果回填技能关键词 |
| F-03 | 经验要求识别可用 | PASS | 已接入后端分析结果回填经验字段 |
| F-04 | 学历要求识别可用 | PASS | 已接入后端分析结果回填学历字段 |
| F-05 | 城市识别可用 | PASS | 已接入后端分析结果回填城市字段 |
| F-06 | 薪资解析可用 | PASS | 已接入后端分析结果回填薪资文本与区间 |
| F-07 | 岗位方向分类可用 | PASS | 已接入后端分析结果回填方向枚举 |
| F-08 | 匹配分计算可用 | PASS | 已接入后端分析结果回填匹配分 |
| F-09 | 匹配等级映射可用 | PASS | 已接入后端分析结果回填匹配等级 |
| F-10 | 支持人工修正分析结果 | PASS | 解析结果回填后可在表单中直接修正并保存；Codespaces 下前端会自动命中 8000 转发后端，FastAPI 也已允许对应来源跨域访问 |
| F-11 | LLM 解析与规则回退可用 | PASS | `analysis_source` 已返回 `rules` / `llm` / `fallback`；未配置或调用失败时自动回退规则引擎 |

---

## G. 投递流程管理验收

| 编号 | 验收项 | 状态 | 验收说明 |
|---|---|---|---|
| G-01 | 状态流转可用 | PASS | 详情页已支持更新岗位状态 |
| G-02 | 简历版本字段可用 | PASS | 详情页已支持维护简历版本字段 |
| G-03 | 备注字段可用 | PASS | 详情页已支持备注字段维护 |
| G-04 | 投递事件时间线可用 | PASS | 详情页已支持新增和查看打开来源、复制 JD、已投递、笔试、面试、Offer、拒绝等事件 |
| G-05 | 默认简历版本预填可用 | PASS | 新增岗位页已读取偏好配置中的 `default_resume_version` 并自动填入简历版本字段 |

---

## H. Dashboard 验收

| 编号 | 验收项 | 状态 | 验收说明 |
|---|---|---|---|
| H-01 | 总岗位数统计可用 | PASS | 已展示总岗位数指标卡 |
| H-02 | 各状态统计可用 | PASS | 已展示状态分布列表 |
| H-03 | 各方向统计可用 | PASS | 已展示方向分布列表 |
| H-04 | 上海岗位统计可用 | PASS | 已展示上海岗位统计指标 |
| H-05 | 高分岗位 Top N 可用 | PASS | 已展示高分岗位跳转列表，并排除 `ignore`、`rejected`、`archived` 岗位 |
| H-06 | 高频技能词展示可用 | PASS | 已展示高频技能词标签 |

---

## I. 质量验收

| 编号 | 验收项 | 状态 | 验收说明 |
|---|---|---|---|
| I-01 | 前端 lint 通过 | PASS | `npm run lint` 已通过 |
| I-02 | 后端 lint 通过 | PASS | `ruff check .` 与 `black --check .` 已通过 |
| I-03 | 后端 pytest 通过 | PASS | `pytest` 已通过，14 项测试覆盖 API、分析逻辑、偏好、来源、事件与 LLM 回退 |
| I-04 | 前端 build 通过 | PASS | `npm run build` 已通过，类型错误与本机构建链路已修复 |
| I-05 | Docker Compose 联调通过 | BLOCKED | `docker compose config` 已通过，实际 `docker compose up -d --build` 因 Docker daemon 不可连接失败，尚未完成容器内联调；按用户要求暂时搁置 |
| I-06 | README 完整 | PASS | 已改为本机 PostgreSQL + FastAPI + Next.js 运行说明，并保留 Docker 状态说明 |
| I-07 | 关键功能手工验证 | PASS | 已通过本机 API 与页面访问验证 JD 解析、岗位创建、事件记录、技能搜索、删除、Dashboard、Sources、Settings、Guide 页面 |
| I-08 | Codex 内置浏览器验收 | PASS | 已通过内置浏览器验证首页、岗位列表筛选、新增页 JD 解析回填、Dashboard、平台入口与指南页面 |
| I-09 | 开发调试菜单中文化 | PASS | 已在内置浏览器验证左下角开发工具菜单显示“路由 / 静态 / 打包器 / 路由信息 / 偏好设置”，英文官方菜单不再出现 |
| I-10 | 页面结构与网页/JD融合优化 | PASS | 已优化首页、平台入口、岗位列表、新增/详情页，使招聘网页来源、JD 原文、结构化解析与投递状态形成连续页面流程 |

---

## 验收证据
- Docker 配置证据：`docker compose config` 已确认后端容器 `DATABASE_URL` 指向 `db:5432`，前端容器 `BACKEND_INTERNAL_URL` 指向 `backend:8000`，本机 `.env` 不再污染容器内部地址
- Docker LLM 配置证据：`docker compose config` 已确认后端容器包含 `LLM_ENABLED`、`LLM_PROVIDER`、`LLM_API_BASE_URL`、`LLM_API_KEY`、`LLM_MODEL`
- Docker 启停命令：`docker compose up -d --build` 已执行，但 Docker daemon / Docker Desktop Linux Engine 不可用而阻塞
- 本轮 Docker 口径：2026-05-02 用户明确要求 Docker 问题暂时搁置，本次验收仅执行 `docker compose config`，不执行 `docker compose up`
- 非 Docker 重构证据：已新增 `scripts/check-local-env.ps1`、`scripts/init-local-postgres.ps1`、`scripts/start-backend.ps1`、`scripts/start-frontend.ps1`、`scripts/start-local.ps1`
- 非 Docker 配置证据：`.env.example` 已指向 `localhost:5432`，`.env.docker.example` 保留 Docker Compose 配置
- PostgreSQL 验证：`postgresql-x64-16` 服务 Running，5432 端口监听，`jobtracker.jobs` 表存在
- MVP+ 数据库验证：`python -m app.cli init-db` 已应用 `app_preferences`、`source_links`、`job_events`，默认来源链接已写入本机 PostgreSQL
- 后端真实联通：`GET /api/health` 返回 `{"status":"ok"}`，`GET /api/dashboard/summary` 可返回当前统计数据
- 本轮后端验收：`GET /api/health` 返回 `ok`；`GET /api/preferences`、`GET /api/source-links`、`GET /api/dashboard/summary` 均成功；临时来源链接 CRUD、临时岗位创建/状态更新/事件记录/删除均成功
- 前端真实访问：`GET http://localhost:3000/jobs` 返回 HTTP 200
- 新增页访问验证：`GET http://localhost:3000/jobs/new` 返回 HTTP 200
- 平台入口页访问验证：`GET http://localhost:3000/sources` 返回 HTTP 200
- 偏好设置页访问验证：`GET http://localhost:3000/settings` 返回 HTTP 200
- 新人指南页访问验证：`GET http://localhost:3000/guide` 返回 HTTP 200
- 来源预填新增页访问验证：`GET http://localhost:3000/jobs/new?platform=...&job_link=...` 返回 HTTP 200
- 流程入口访问验证：`GET http://localhost:3000/` 返回 HTTP 200，页面包含“今天的求职工作从这里开始”
- 列表查询入口验证：`GET http://localhost:3000/jobs?status=ready_to_apply&sort_by=match_score` 返回 HTTP 200
- Codex 内置浏览器验收：`/`、`/jobs`、`/jobs?status=ready_to_apply&sort_by=match_score`、`/jobs/new`、`/dashboard`、`/sources`、`/guide` 均完成可见页面检查
- Codex 内置浏览器交互验收：岗位列表搜索框可输入，优先投递快捷筛选可点击；新增岗位页使用测试 JD 点击“一键解析 JD”后，公司、岗位、城市、薪资、方向、匹配等级和技能词均成功回填；本轮未保存岗位数据
- Codex 内置浏览器截图：Dashboard 最终渲染画面已成功捕获，能看到 KPI 卡、状态分布与方向分布进度条
- 开发调试菜单中文化验收：`next.config.ts` 已关闭 Next.js 官方英文 dev indicator；`NextDevtoolsI18n` 仅在 development 环境显示中文菜单；内置浏览器验证 `Open Next.js Dev Tools` 不再出现，菜单内 `Route Info`、`Preferences`、`Bundler`、`Route Static` 英文文案不再出现
- 关键功能链路验证：临时调用 `POST /api/analyze-jd` 得到 `ai_app_dev`、`priority_apply`、92 分，随后 `POST /api/jobs` 创建临时岗位、`PUT /api/jobs/{id}` 更新为 `applied`、`DELETE /api/jobs/{id}` 删除成功
- 本轮关键功能链路验证：临时 `POST /api/analyze-jd` 得到 `ai_app_dev`、`priority_apply`、`analysis_source=rules`；临时岗位创建、状态更新为 `applied`、新增 `applied` 投递事件、事件列表读取、技能搜索 `q=RAG`、岗位删除均成功
- MVP+ 关键功能链路验证：`GET /api/preferences` 返回默认偏好；`GET /api/source-links` 返回 BOSS直聘、拉勾、猎聘、智联招聘、前程无忧、牛客、脉脉；临时调用 `POST /api/jobs/{id}/events` 成功记录 `applied` 事件；`GET /api/jobs?q=RAG` 可匹配技能数组；临时岗位已删除
- JD Analyzer 来源验证：临时 `POST /api/analyze-jd` 返回 `analysis_source=rules`；后端测试已覆盖 LLM 成功和失败回退场景
- 流程补齐证据：首页已按“收集岗位 / 解析修正 / 投递跟进 / 复盘决策”组织；Dashboard 统计卡和流程状态可跳转到列表筛选；列表支持 URL query 初始化筛选并展示下一步提示；JD 解析后可自动从 `pending_analysis` 推进到 `ready_to_apply`
- 前端视觉复查：Codex 内置浏览器已刷新 `http://localhost:3000/jobs`，确认新导航、新标题区、状态条、紧凑筛选区和列表行生效
- 新增页布局重构证据：`frontend/src/components/job-editor.tsx` 已改为左右分栏工作流，JD 原文输入区 `min-h-[500px]`，右侧表单合并基础信息、分析结果与投递流程，并提供底部 sticky 保存操作栏
- 前端 lint 输出：`npm run lint` 通过
- 后端 lint 输出：`ruff check .`、`black --check .` 通过
- pytest 输出：`.\\.venv\\Scripts\\python -m pytest -q` 通过，14 项测试通过
- 前端页面交互测试：`npm run test` 通过，12 项测试通过，包含 JobEditor 点击“解析 JD”自动回填、默认简历版本预填、来源页、设置页验证
- 本轮页面访问验收：`/`、`/jobs`、`/jobs/new`、带来源参数的 `/jobs/new`、`/dashboard`、`/sources`、`/settings`、`/guide` 均返回 HTTP 200
- 本轮页面结构优化验收：`/` 已展示招聘网页来源与 JD 摘要融合入口；`/sources` 已展示浏览器窗口式来源列表和“打开网页 -> 复制 JD -> 录入岗位 -> 解析跟进”流程；`/jobs` 已展示来源网页与 JD 摘要；`/jobs/new` 已展示来源网页上下文、流程条和结构化检查摘要
- 本轮运行验收：已执行 `.\\scripts\\start-local.ps1`，3000 / 8000 / 5432 均在监听；`GET /api/health` 返回 `ok`
- 本轮视觉复查：Chrome headless 已截图复查首页桌面、首页移动端和新增岗位页桌面；移动端首页长 URL 已做截断收口，并增加全局横向溢出保护
- 前端 Codespaces 地址测试：已验证 `http://localhost:8000` 在 Codespaces 浏览器环境下会自动解析为当前工作区的 8000 转发地址
- 前端 build 输出：`npm run build` 通过
- 本轮前端验证：`npm run lint`、`npm run test`、`npm run build` 均通过，Vitest 12 项测试通过
- 前端 build 路由证据：Next build 生成 `/sources`、`/settings`、`/guide`
- Codespaces 请求修复：前端会自动推导 8000 转发后端地址，FastAPI 已放行 `*.app.github.dev` / `*.githubpreview.dev` 来源，Compose 与环境模板已同步补齐对应变量
- 页面截图：Codex 内置浏览器已完成 `/jobs` 当前视图截图复查，并完成 `/dashboard` 最终渲染截图
- Linux 部署说明：已写入 `README.md`

---

## 已知问题

| 编号 | 问题 | 严重程度 | 是否阻塞验收 | 状态 |
|---|---|---|---|---|
| BUG-001 | Docker Desktop 服务未注册，Docker Compose 联调与数据库实连验证被阻塞 | high | 是 | open |
| BUG-004 | 本机未安装 PostgreSQL，放弃 Docker 后也不能立即运行数据层 | high | 是 | closed |
| BUG-002 | 前端 build 类型错误已修复，问题已关闭 | low | 否 | closed |
| BUG-003 | Codespaces 下前端错误请求 `localhost:8000` 且 FastAPI 未显式允许 Codespaces 来源跨域的问题已修复 | low | 否 | closed |

---

## 最终验收结论
- 是否达到 MVP 发布条件：非 Docker MVP+ 可试用；严格按 PRD 的 Docker Compose 验收仍延期
- 本机功能是否可试用：是
- 验收人：Codex / 你本人
- 验收时间：2026-05-02 11:25
- 最终说明：当前已完成前后端 MVP 主链和 MVP+ 合规辅助自动化增强，包括平台入口、搜索链接管理、偏好设置、投递事件时间线、LLM JD 解析与规则回退；本轮已进一步完成页面结构与网页/JD融合优化，首页、平台入口、岗位列表和岗位编辑页均能更清晰串联外部招聘网页、JD 原文、解析字段与投递状态。前端 lint/test/build、后端 ruff/black/pytest、PostgreSQL 本机联通、页面访问、关键 API 闭环验证与浏览器/截图复查均已通过。Compose 文件已完成本机 `.env` 与容器内部地址隔离，并透传 LLM 环境变量，配置层可解析。实际 `docker compose up -d --build` 仍受本机 Docker Desktop / WSL daemon 不可用阻塞；按用户要求，Docker 验证暂时搁置，当前交付口径为非 Docker MVP+ 可试用。
