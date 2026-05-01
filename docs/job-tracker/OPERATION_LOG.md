# Job Tracker + JD Analyzer - 单独操作日志

## 文档用途
本文件用于记录本项目所有关键操作、命令执行、文件变更、错误、风险与提交记录。

---

## 记录规则
1. 每完成一个明确子任务，追加一条日志；
2. 每次 commit 后，必须补充提交记录；
3. 每条日志必须包含：
   - 时间
   - 任务名称
   - 操作目标
   - 修改文件
   - 执行命令
   - 执行结果
   - 风险/备注
   - 对应 commit
4. 如未提交 commit，标记为 `PENDING_COMMIT`；
5. 失败步骤不得省略，必须记录。

---

## 提交规范
使用 Conventional Commits：

- feat:
- fix:
- refactor:
- docs:
- test:
- chore:

示例：
- `feat(frontend): implement jobs list page`
- `feat(backend): add jd analyzer endpoint`
- `feat(db): create jobs schema`
- `docs(project): initialize governance docs`
- `test(backend): add analyzer unit tests`

---

## 操作日志

### LOG-000
- 时间：2026-04-15 18:31
- 任务：治理文档初始化
- 目标：建立本项目的治理文档和执行边界
- 修改文件：
  - `AGENTS.md`
  - `docs/job-tracker/PRD.md`
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/OPERATION_LOG.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - 创建治理文件
- 执行结果：
  - 已完成项目治理框架初始化
- 风险/备注：
  - 当前尚未进入功能开发
- 对应提交：
  - `b6dea80`

---

### LOG-001
- 时间：2026-04-15 18:31
- 任务：TASK-A / 治理与目录重构
- 目标：建立目标目录结构并将现有前端代码迁移到 `frontend/`
- 修改文件：
  - `README.md`
  - `.env.example`
  - `.gitignore`
  - `docker-compose.yml`
  - `frontend/*`
  - `backend/*`
  - `db/init.sql`
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - `Move-Item`
  - `New-Item`
  - `apply_patch`
- 执行结果：
  - 已完成前后端目录分层
  - 已创建 FastAPI、PostgreSQL、Docker Compose 基础骨架
  - 已补充根级 README 与环境变量模板
- 风险/备注：
  - 当前尚未执行 `docker compose up`、`lint`、`build`、`pytest`
  - 根目录历史 `node_modules` 将在重构收尾时清理
- 对应提交：
  - `b6dea80`

---

### LOG-002
- 时间：2026-04-15 20:23
- 任务：TASK-D / 后端 API 主链实现
- 目标：完成 Jobs CRUD、JD Analyzer、Dashboard API，并补齐输入输出模型、错误处理和后端测试验证
- 修改文件：
  - `backend/app/api/deps.py`
  - `backend/app/api/router.py`
  - `backend/app/api/routes/jobs.py`
  - `backend/app/api/routes/analyzer.py`
  - `backend/app/api/routes/dashboard.py`
  - `backend/app/core/config.py`
  - `backend/app/core/database.py`
  - `backend/app/main.py`
  - `backend/app/models/job.py`
  - `backend/app/repositories/jobs.py`
  - `backend/app/schemas/job.py`
  - `backend/app/schemas/analyzer.py`
  - `backend/app/schemas/dashboard.py`
  - `backend/app/services/analyzer.py`
  - `backend/pyproject.toml`
  - `backend/tests/conftest.py`
  - `backend/tests/test_api.py`
  - `backend/tests/test_analyzer.py`
  - `backend/tests/test_health.py`
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/OPERATION_LOG.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - `.\\.venv\\Scripts\\ruff check . --fix`
  - `.\\.venv\\Scripts\\ruff check .`
  - `.\\.venv\\Scripts\\black --check .`
  - `.\\.venv\\Scripts\\pytest`
- 执行结果：
  - 已完成 Jobs CRUD API
  - 已完成 `POST /api/analyze-jd`
  - 已完成 `GET /api/dashboard/summary`
  - 已补充 API schema、基础异常处理与后端分析测试
  - 后端 `ruff`、`black --check`、`pytest` 已通过
- 风险/备注：
  - `pytest` 存在 `datetime.utcnow()` 的弃用警告，当前不影响结果，但后续可统一替换为时区感知时间
  - 当前尚未完成真实 PostgreSQL 联通验证与 Docker Compose 联调
- 对应提交：
  - `c24d1df`

---

### LOG-003
- 时间：2026-04-15 20:39
- 任务：TASK-E/F/G/H/I/J / 前端主链联调与基础校验
- 目标：完成前端 API 请求层、岗位 CRUD 交互、JD Analyzer 表单联动、Dashboard 展示，并补齐前端 lint / test 验证
- 修改文件：
  - `frontend/package.json`
  - `frontend/package-lock.json`
  - `frontend/public/favicon.ico`
  - `frontend/src/app/favicon.ico`
  - `frontend/vitest.config.ts`
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/OPERATION_LOG.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - `npm install`
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - `npx next build --webpack`
  - `docker compose build frontend`
  - `Start-Process "$Env:ProgramFiles\\Docker\\Docker\\Docker Desktop.exe"`
  - `Start-Service com.docker.service`
- 执行结果：
  - 已确认前端页面接入真实 API 请求层
  - 已完成新增、编辑、删除、搜索、筛选、排序等岗位交互
  - 已完成 JD 原文输入、规则解析结果回填与人工修正
  - 已完成 Dashboard 统计展示
  - 前端 `eslint` 与 `vitest` 已通过
  - 前端 `build` 尚未完成：Windows 本机存在 Next 原生绑定异常，Docker 构建因本机 Docker Desktop 服务未启动而未能继续
- 风险/备注：
  - `npm run build` 与 `npx next build --webpack` 在 Windows 下均失败，错误集中于 `@next/swc-win32-x64-msvc` 与 webpack `readlink`
  - `docker compose build frontend` 失败原因是 `dockerDesktopLinuxEngine` 未就绪
  - `Start-Service com.docker.service` 需要更高权限，当前会话无法直接拉起 Docker 服务
- 对应提交：
  - `328beed`

---

### LOG-004
- 时间：2026-04-16 00:24
- 任务：TASK-J / 前端 build 类型错误修复与构建复验
- 目标：修复 `frontend/src/components/job-editor.tsx` 中 `jobId` 的类型收窄问题，完成前端 build 复验，并继续尝试执行 `docker compose up --build`
- 修改文件：
  - `frontend/src/components/job-editor.tsx`
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/OPERATION_LOG.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - `npm install`
  - `npm install lightningcss-win32-x64-msvc --save-dev`
  - `npm run build`
  - `docker compose up --build`
- 执行结果：
  - 已在 `fetchJob(jobId)` 前增加显式守卫，并同步修复保存分支中的 `jobId` 收窄
  - 前端 `npm run build` 已通过
  - `docker compose up --build` 未执行成功，当前 PowerShell 会话提示 `docker` 命令不可识别
- 风险/备注：
  - 当前阻塞已从前端类型错误转移为本机 Docker CLI 不可用，需先恢复 `docker` 命令再继续容器联调
  - 本次为恢复本机构建链路，执行了依赖补装
- 对应提交：
  - `b8cb514`

---

### LOG-005
- 时间：2026-04-16 00:48
- 任务：TASK-E/G / Codespaces 前端请求后端链路修复
- 目标：修复 Codespaces 浏览器仍请求 `http://localhost:8000` 导致 `/jobs/new` 出现 `Failed to fetch`、JD 解析结果无法回填的问题
- 修改文件：
  - `frontend/src/lib/api.ts`
  - `frontend/next.config.ts`
  - `frontend/Dockerfile`
  - `docker-compose.yml`
  - `.env.example`
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/OPERATION_LOG.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - `npm run test`
  - `.\\.venv\\Scripts\\python -m pytest tests/test_api.py -k analyzer -q`
  - `npm run build`
  - `npm run build`
  - `docker compose up --build`
- 执行结果：
  - 已将前端请求改为“浏览器同源优先”，当外部访问环境仍注入 `localhost` 基地址时自动退回到前端同源 `/api`
  - 已在 Next.js 中增加 `/api/:path* -> BACKEND_INTERNAL_URL/api/:path*` 代理转发，适配 Codespaces 下 frontend -> backend 容器访问
  - 已将 `BACKEND_INTERNAL_URL` 透传到前端 Docker 构建与运行环境，确保 Codespaces `docker compose up --build` 使用容器内后端地址
  - 前端 `JobEditor` 组件测试已验证点击“解析 JD”后会自动回填字段
  - 后端 `POST /api/analyze-jd` API 测试已通过
  - 前端 `npm run build` 已通过
  - 本次方案不需要额外修改 FastAPI CORS
- 风险/备注：
  - 首次 `npm run build` 受本机 `.next` 缓存目录状态影响出现 `ENOENT: mkdir '\\\\?'`，重试后通过
  - 当前本地 PowerShell 会话无法识别 `docker` 命令，无法在本地继续执行容器联调复验
  - `/jobs/new` 不再出现 `Failed to fetch`、点击“解析 JD”可自动回填字段的最终验证需在实际 Codespaces 浏览器页面完成
- 对应提交：
  - `b8cb514`

---

### LOG-006
- 时间：2026-04-16 02:59
- 任务：TASK-E/G / Codespaces 8000 转发地址与后端 CORS 收口修复
- 目标：确保 Codespaces 浏览器侧请求不再落到 `localhost:8000`，而是自动命中当前 8000 转发地址，并允许对应前端来源跨域访问 FastAPI
- 修改文件：
  - `frontend/src/lib/api.ts`
  - `frontend/src/lib/project.test.ts`
  - `backend/app/core/config.py`
  - `backend/app/main.py`
  - `docker-compose.yml`
  - `.env.example`
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/OPERATION_LOG.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - `npm run lint`
  - `npm run test`
  - `.\\.venv\\Scripts\\ruff check .`
  - `.\\.venv\\Scripts\\black --check .`
  - `.\\.venv\\Scripts\\python -m pytest -q`
  - `npm run build`
  - `docker compose down`
  - `docker compose up --build`
- 执行结果：
  - 已新增 Codespaces 地址推导逻辑，当浏览器运行在 `*.app.github.dev` / `*.githubpreview.dev` 且前端环境变量仍为 `http://localhost:8000` 时，会自动改写为当前工作区的 8000 转发地址
  - 已补充前端单测，验证 `localhost:8000` 会被解析为 Codespaces 的 `-8000` 域名
  - 已在 FastAPI 中补充 `allow_origin_regex`，允许当前 Codespaces 前端来源跨域访问
  - 已将 `FRONTEND_ORIGINS` 与 `FRONTEND_ORIGIN_REGEX` 写入 Compose 与环境变量模板
  - 前端 `npm run lint`、后端 `ruff check .`、`black --check .` 已通过
  - 前端 `npm run test`、后端 `pytest -q`、前端 `npm run build` 已通过
  - `docker compose down` 与 `docker compose up --build` 已按要求执行，但当前 PowerShell 会话无法识别 `docker` 命令，未能完成容器联调复验
- 风险/备注：
  - 当前环境缺少可用 `docker` CLI，导致无法在本机会话中直接完成 Compose 启停与浏览器手工验收
  - `/jobs/new` 页面真实浏览器验证仍需在实际 Codespaces 访问环境中完成，但前端自动回填链路已由组件测试覆盖，后端 `POST /api/analyze-jd` 已由 API 测试覆盖
- 对应提交：
  - `b4e3a01`

---

### LOG-007
- 时间：2026-04-30 18:25
- 任务：TASK-J / 项目状态复查与运行阻塞定位
- 目标：确认当前项目“完全用不了”的真实阻塞点，复核 lint / test / build / Docker Compose / 浏览器访问状态
- 修改文件：
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/OPERATION_LOG.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - `docker --version`
  - `docker info`
  - `docker context ls`
  - `docker compose config`
  - `docker compose down; docker compose up -d --build`
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - `.\\.venv\\Scripts\\ruff.exe check .`
  - `.\\.venv\\Scripts\\black.exe --check .`
  - `.\\.venv\\Scripts\\python.exe -m pytest -q`
  - Browser 打开 `http://localhost:3000/jobs`
- 执行结果：
  - 前端 `lint`、`test`、`build` 均通过
  - 后端 `ruff`、`black --check`、`pytest` 均通过
  - `docker compose config` 可解析
  - `docker compose up -d --build` 失败，原因是无法连接 Docker API：`npipe:////./pipe/dockerDesktopLinuxEngine` 不存在
  - Browser 打开 `http://localhost:3000/jobs` 返回 `ERR_CONNECTION_REFUSED`，当前无前端服务监听
  - 本机未发现 `psql` / `postgres` 命令，非 Docker 路径也没有现成 PostgreSQL 可用
- 风险/备注：
  - 当前首要阻塞为运行环境缺少可用 Docker daemon / PostgreSQL，而不是前后端 lint/test/build 失败
  - `rg --files` 在当前 Codex Windows 包路径下被拒绝访问，已改用 PowerShell 文件枚举
- 对应提交：
  - `c12fc0f`

---

### LOG-008
- 时间：2026-04-30 19:06
- 任务：TASK-J / Docker Desktop 环境安装尝试
- 目标：补齐 Docker Desktop / Docker daemon，使 Docker Compose 可用于 PostgreSQL、后端、前端联调
- 修改文件：
  - `.env`
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/OPERATION_LOG.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - `Copy-Item -Path .env.example -Destination .env -Force`
  - `winget install --id Docker.DockerDesktop --source winget --accept-package-agreements --accept-source-agreements`
  - `Docker Desktop Installer.exe install --quiet --accept-license`
  - `Start-Process Docker Desktop Installer.exe -Verb RunAs`
  - `docker info`
  - `winget list --id Docker.DockerDesktop`
  - `Get-Service *docker*`
- 执行结果：
  - 已从 `.env.example` 生成本地 `.env`，且 `.env` 被 Git 忽略
  - `winget install` 下载并释放 Docker Desktop 安装文件，但安装流程长时间卡住
  - 已确认 `Docker Desktop.exe` 已落盘到 `C:\Program Files\Docker\Docker`
  - 静默安装命令返回，但 Docker 服务未注册，winget 仍未登记 Docker Desktop
  - 管理员方式启动安装器触发 UAC，但授权未完成，未能继续注册系统服务
  - `docker info` 仍无法连接 `npipe:////./pipe/dockerDesktopLinuxEngine`
- 风险/备注：
  - 当前阻塞为 Windows 管理员授权 / 系统级 Docker Desktop 安装未完成
  - 需要用户在 UAC 中确认管理员权限，或手动以管理员身份运行 `C:\Program Files\Docker\Docker\Docker Desktop Installer.exe install --quiet --accept-license`
- 对应提交：
  - `c086cb0`

---

### LOG-009
- 时间：2026-05-01 22:51
- 任务：TASK-J / Docker 环境复查与非 Docker 路线评估
- 目标：确认当前 Docker 环境是否可运行，并评估放弃 Docker 后的本地运行前提
- 修改文件：
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/OPERATION_LOG.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - `docker --version`
  - `docker compose version`
  - `docker info`
  - `docker compose config`
  - `docker compose up -d --build`
  - `Get-Service *docker*`
  - `wsl -l -v`
  - `Get-Command psql/postgres/pg_ctl`
  - `Get-Service *postgres*`
  - `Get-NetTCPConnection -LocalPort 3000,8000,5432`
- 执行结果：
  - Docker CLI 与 Compose 插件存在
  - `docker compose config` 可正常解析项目编排文件
  - `docker info` 与 `docker compose up -d --build` 均失败，无法连接 `npipe:////./pipe/dockerDesktopLinuxEngine`
  - 未发现 Docker Desktop 系统服务
  - WSL 当前无可用 Linux 发行版
  - 未发现本机 PostgreSQL 命令、PostgreSQL 服务或 5432 端口监听
  - 当前 3000 / 8000 / 5432 均无项目服务监听
- 风险/备注：
  - Docker 路线当前不可运行，问题在宿主机 Docker Desktop / WSL 安装状态，不在项目 Compose 文件
  - 若放弃 Docker，必须先安装并初始化本地 PostgreSQL，再调整后端本地 `.env` 使用 `localhost:5432`
  - 按 PRD，Docker Compose 仍是正式验收要求；非 Docker 只能作为本机临时开发路线
- 对应提交：
  - `2f33c2a`

---

### LOG-010
- 时间：2026-05-01 23:06
- 任务：TASK-J/K / 非 Docker 本机运行路线重构
- 目标：按用户要求放弃当前机器上的 Docker 路线，改为本机 PostgreSQL + 本机 FastAPI + 本机 Next.js 的开发运行方式
- 修改文件：
  - `.env.example`
  - `.env.docker.example`
  - `README.md`
  - `backend/app/cli.py`
  - `scripts/check-local-env.ps1`
  - `scripts/init-local-postgres.ps1`
  - `scripts/start-backend.ps1`
  - `scripts/start-frontend.ps1`
  - `scripts/start-local.ps1`
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/OPERATION_LOG.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - `.\\.venv\\Scripts\\ruff.exe check .`
  - `.\\.venv\\Scripts\\black.exe --check .`
  - `.\\.venv\\Scripts\\python.exe -m pytest -q`
  - `.\\.venv\\Scripts\\python.exe -m app.cli --help`
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - `.\\scripts\\check-local-env.ps1`
- 执行结果：
  - 已将 `.env.example` 默认数据库地址切换为 `localhost:5432`
  - 已新增 `.env.docker.example` 保留历史 Docker Compose 环境模板
  - 已新增 `python -m app.cli init-db`，可在本机 PostgreSQL 上执行 `db/init.sql`
  - 已新增本机环境检查、PostgreSQL 初始化、前端启动、后端启动和一键启动脚本
  - README 已改为非 Docker 本机运行说明
  - 后端 `ruff`、`black --check`、`pytest` 通过
  - 前端 `lint`、`test`、`build` 通过
  - 环境检查脚本按预期提示当前缺少 `psql` / PostgreSQL Windows 服务
- 风险/备注：
  - 按 PRD 原始约束，Docker Compose 仍是正式验收项；本次变更来自用户明确要求，当前本机主路线调整为非 Docker
  - 项目仍使用 PostgreSQL，未替换为 SQLite / Supabase / Firebase
  - 下一步需要安装本机 PostgreSQL 后才能执行数据库实连和浏览器手工验收
- 对应提交：
  - `8423bab`

---

### LOG-011
- 时间：2026-05-01 23:32
- 任务：TASK-C/J / 本机 PostgreSQL 安装与非 Docker 联通验证
- 目标：安装 PostgreSQL，初始化项目数据库，并验证本机前后端可访问
- 修改文件：
  - `README.md`
  - `scripts/check-local-env.ps1`
  - `scripts/init-local-postgres.ps1`
  - `scripts/start-frontend.ps1`
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/OPERATION_LOG.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - `winget install --id PostgreSQL.PostgreSQL.16 --source winget --accept-package-agreements --accept-source-agreements`
  - `.\\scripts\\check-local-env.ps1`
  - `.\\scripts\\init-local-postgres.ps1`
  - `.\\scripts\\start-local.ps1`
  - `Invoke-RestMethod http://localhost:8000/api/health`
  - `Invoke-RestMethod http://localhost:8000/api/jobs`
  - `Invoke-WebRequest http://localhost:3000/jobs`
- 执行结果：
  - PostgreSQL 16.13-3 已安装
  - PostgreSQL Windows 服务 `postgresql-x64-16` 已启动并设置为自动启动
  - 5432 端口已监听
  - 已创建 / 更新 `jobtracker` 数据库用户
  - 已创建 `jobtracker` 数据库并执行 `db/init.sql`
  - 已验证 `jobs` 表存在
  - 后端 8000 已启动，`/api/health` 返回 `{"status":"ok"}`，`/api/jobs` 返回空列表
  - 前端 3000 已启动，`/jobs` 返回 HTTP 200
  - 已将前端启动脚本改为 `next dev --webpack`，规避当前 Windows 环境下 Turbopack dev 首次页面请求长时间挂起
- 风险/备注：
  - PostgreSQL 管理员连接已验证；项目应用库使用 `jobtracker` / `jobtracker`
  - 完整 CRUD / JD Analyzer / Dashboard 仍需浏览器手工验收
  - Docker Compose 联调仍不作为当前本机路线继续推进
- 对应提交：
  - `b7eb6ac`

---

### LOG-012
- 时间：2026-05-01 23:53
- 任务：TASK-E / `/jobs` 列表页视觉优化
- 目标：按浏览器备注优化列表页整体审美，收窄导航与内容视觉宽度，弱化粗色块，补充更现代的状态与工作区信息
- 修改文件：
  - `frontend/src/app/globals.css`
  - `frontend/src/app/layout.tsx`
  - `frontend/src/components/site-header.tsx`
  - `frontend/src/components/jobs-list-client.tsx`
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/OPERATION_LOG.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - `npx prettier --write src/app/globals.css src/app/layout.tsx src/components/site-header.tsx src/components/jobs-list-client.tsx`
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - Codex 内置浏览器刷新 `http://localhost:3000/jobs`
- 执行结果：
  - 已将顶部导航改为更紧凑的胶囊式导航，并移除 `MVP 初始化骨架` 占位文案
  - 已将列表页头部改为更轻的工作台标题区，主 CTA 与统计入口更清晰
  - 已将筛选区改为紧凑表单面板，并增加当前结果、优先投递、待分析状态条
  - 已将空状态改为有下一步行动的工作区，引导新增岗位、解析 JD 与按匹配分投递
  - 已修复全局 `a { color: inherit }` 覆盖 Tailwind 链接文字颜色，导致深色链接按钮文字不可见的问题
  - 前端 `lint`、`test`、`build` 均通过
  - Codex 内置浏览器已刷新 `/jobs` 并确认新布局生效
- 风险/备注：
  - 本次仅优化 `/jobs` 列表页与全局导航视觉，不改变 API、数据库或业务逻辑
  - 当前数据库存在 1 条空白岗位记录，因此浏览器复查时展示的是列表行而非空状态
- 对应提交：
  - `2aa90b5`

---

### LOG-013
- 时间：2026-05-02 00:25
- 任务：TASK-E / `/jobs/new` 新增岗位页分栏布局重构
- 目标：按现代 SaaS 效率工具风格重构新增岗位页，将 JD 原文区与结构化表单拆为左右分栏工作流，并统一浅色工作台视觉规范
- 修改文件：
  - `frontend/src/app/globals.css`
  - `frontend/src/app/layout.tsx`
  - `frontend/src/components/job-editor.tsx`
  - `frontend/src/components/job-editor.test.tsx`
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/OPERATION_LOG.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - `npx prettier --write src/components/job-editor.tsx src/components/job-editor.test.tsx src/app/globals.css src/app/layout.tsx`
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - `Invoke-WebRequest http://localhost:3000/jobs/new`
- 执行结果：
  - 已将 `JobEditor` 改为左侧 JD 原文与解析、右侧岗位表单的 split-pane 布局
  - JD 输入区已设置 `min-h-[500px]`，并将解析按钮调整为右上角主操作
  - 右侧表单已合并岗位基础信息、分析结果与投递流程，短字段使用两列网格，长字段独占一行
  - 已增加底部 sticky 保存操作栏，编辑模式保留删除岗位操作
  - 已统一输入框、下拉框、文本域的细边框、浅阴影、`focus:ring-2 focus:ring-orange-500/20` 风格
  - 已将全局背景从偏暖渐变收敛为 `#f8fafc` 浅灰工作台
  - 前端 `lint`、`test`、`build` 均通过
  - `GET http://localhost:3000/jobs/new` 返回 HTTP 200
- 风险/备注：
  - 本次仅改前端布局与样式，不改变 API、数据库或 JD Analyzer 业务逻辑
  - 当前工作区存在非本轮产生的 `dashboard-client.tsx`、`jobs-list-client.tsx`、`types.ts`、`project.test.ts` 改动，未纳入本次提交范围
  - Docker Compose 联调仍受本机 Docker 环境阻塞，未在本轮复验
- 对应提交：
  - `b97a17d`

---

### LOG-014
- 时间：2026-05-02 00:34
- 任务：TASK-E/J / 求职操作流程补齐与关键功能验证
- 目标：审查现有求职链路，将入口页、列表页、Dashboard 与新增/详情页串成“收集 JD -> 解析修正 -> 投递跟进 -> 统计复盘”的完整 MVP 内流程，并完成关键功能验证
- 修改文件：
  - `frontend/src/app/page.tsx`
  - `frontend/src/components/dashboard-client.tsx`
  - `frontend/src/components/jobs-list-client.tsx`
  - `frontend/src/components/job-editor.tsx`
  - `frontend/src/lib/types.ts`
  - `frontend/src/lib/project.test.ts`
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/OPERATION_LOG.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - `npx prettier --write src/app/page.tsx src/components/dashboard-client.tsx src/components/jobs-list-client.tsx src/components/job-editor.tsx src/components/job-editor.test.tsx src/lib/project.test.ts src/lib/types.ts`
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - `.\\.venv\\Scripts\\ruff.exe check .`
  - `.\\.venv\\Scripts\\black.exe --check .`
  - `.\\.venv\\Scripts\\python.exe -m pytest -q`
  - `Invoke-RestMethod http://localhost:8000/api/health`
  - `Invoke-RestMethod http://localhost:8000/api/dashboard/summary`
  - `Invoke-WebRequest http://localhost:3000/`
  - `Invoke-WebRequest http://localhost:3000/jobs?status=ready_to_apply&sort_by=match_score`
  - `Invoke-WebRequest http://localhost:3000/jobs/new`
  - 临时调用 `POST /api/analyze-jd`、`POST /api/jobs`、`PUT /api/jobs/{id}`、`DELETE /api/jobs/{id}`
- 执行结果：
  - 首页已从说明型入口改为按收集、解析、投递、复盘组织的工作入口
  - Dashboard 已改为可行动的投递复盘页，统计卡和流程状态可直接跳转到对应岗位队列
  - 岗位列表已支持从 URL query 初始化筛选，并新增待解析、优先投递、待投递、面试跟进快捷队列
  - 列表行已补充下一步提示，帮助从当前状态进入下一动作
  - JD 解析后如岗位仍为 `pending_analysis` 且匹配等级不是 `ignore`，会自动推进到 `ready_to_apply`
  - 已补充 query 筛选解析测试，前端 `lint`、`test`、`build` 均通过
  - 后端 `ruff`、`black --check`、`pytest` 均通过；pytest 仍存在既有 `datetime.utcnow()` 弃用警告
  - 本机 3000 / 8000 / 5432 均已监听，`/api/health` 返回 ok，Dashboard summary 可访问
  - 临时 JD 解析、创建岗位、更新状态、删除岗位链路验证通过
- 风险/备注：
  - 本次仍严格限定在 PRD MVP 内，没有引入爬虫、自动投递、多用户、外部通知或 AI 对话助手
  - Docker Compose 联调仍受本机 Docker Desktop / WSL 环境阻塞，未在本轮改动中解决
- 对应提交：
  - `37591be`
  - `c2fd970`

---

### LOG-015
- 时间：2026-05-02 00:44
- 任务：TASK-J/K / 文件整合、流程复查与自主验收
- 目标：整合本机运行与 Docker Compose 文件边界，复查质量命令、关键业务流程和最终验收状态
- 修改文件：
  - `docker-compose.yml`
  - `.env.docker.example`
  - `README.md`
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/OPERATION_LOG.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - `docker info`
  - `docker compose config`
  - `docker compose up -d --build`
  - `.\\.venv\\Scripts\\ruff.exe check .`
  - `.\\.venv\\Scripts\\black.exe --check .`
  - `.\\.venv\\Scripts\\python.exe -m pytest -q`
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - `.\\scripts\\check-local-env.ps1`
  - `Invoke-RestMethod http://localhost:8000/api/health`
  - `Invoke-RestMethod http://localhost:8000/api/dashboard/summary`
  - `Invoke-WebRequest http://localhost:3000/`
  - `Invoke-WebRequest http://localhost:3000/jobs`
  - `Invoke-WebRequest http://localhost:3000/jobs/new`
  - `Invoke-WebRequest http://localhost:3000/jobs?status=ready_to_apply&sort_by=match_score`
  - 临时调用 `POST /api/analyze-jd`、`POST /api/jobs`、`PUT /api/jobs/{id}`、`DELETE /api/jobs/{id}`
- 执行结果：
  - 已将 Compose 容器内部数据库地址改为 `DOCKER_DATABASE_URL`，默认指向 `db:5432`
  - 已将 Next.js 容器内部后端代理地址改为 `DOCKER_BACKEND_INTERNAL_URL`，默认指向 `backend:8000`
  - `docker compose config` 已确认本机 `.env` 不再污染容器内部 `DATABASE_URL` / `BACKEND_INTERNAL_URL`
  - 后端 `ruff`、`black --check`、`pytest` 通过；pytest 仍存在既有 `datetime.utcnow()` 弃用警告
  - 前端 `lint`、`test`、`build` 通过
  - 本机环境检查通过，Node.js、npm、Python、psql、PostgreSQL 服务、3000 / 8000 / 5432 端口均满足当前本机路线
  - `/api/health` 返回 ok，Dashboard summary 可访问
  - 首页、岗位列表、新增岗位页、带 query 的岗位列表入口均返回 HTTP 200
  - 临时 JD 解析得到 `ai_app_dev`、`priority_apply`、92 分；临时岗位创建、状态更新为 `applied`、删除均成功
  - `docker compose up -d --build` 仍失败，错误为无法连接 `npipe:////./pipe/dockerDesktopLinuxEngine`
- 风险/备注：
  - 严格按 PRD，Docker Compose 启动仍是阻塞项，不能宣称最终 MVP 全量验收通过
  - 本机非 Docker 路线已达到可运行、可验证、可回滚状态
- 对应提交：
  - `PENDING_COMMIT`

---

### LOG-016
- 时间：2026-05-02 01:48
- 任务：TASK-L / MVP+ 合规自动化与国内大模型增强
- 目标：实现平台入口、偏好设置、投递事件时间线、OpenAI-compatible LLM JD 解析与规则回退，并同步治理文档
- 修改文件：
  - `db/init.sql`
  - `.env.example`
  - `.env.docker.example`
  - `docker-compose.yml`
  - `README.md`
  - `backend/app/models/job.py`
  - `backend/app/repositories/jobs.py`
  - `backend/app/api/routes/*`
  - `backend/app/schemas/*`
  - `backend/app/services/*`
  - `backend/tests/*`
  - `frontend/src/app/*`
  - `frontend/src/components/*`
  - `frontend/src/lib/*`
  - `docs/job-tracker/PRD.md`
  - `docs/job-tracker/TASK_CARD.md`
  - `docs/job-tracker/OPERATION_LOG.md`
  - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
- 执行命令：
  - `.\\.venv\\Scripts\\python.exe -m pytest -q`
  - `.\\.venv\\Scripts\\ruff.exe check .`
  - `.\\.venv\\Scripts\\black.exe --check .`
  - `npx prettier --write src`
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - `.\\.venv\\Scripts\\python.exe -m app.cli init-db`
  - `Invoke-RestMethod http://localhost:8000/api/preferences`
  - `Invoke-RestMethod http://localhost:8000/api/source-links`
  - `Invoke-RestMethod POST http://localhost:8000/api/analyze-jd`
  - 临时调用 `POST /api/jobs`、`POST /api/jobs/{id}/events`、`GET /api/jobs/{id}/events`、`GET /api/jobs?q=RAG`、`DELETE /api/jobs/{id}`
  - `Invoke-WebRequest http://localhost:3000/sources`
  - `Invoke-WebRequest http://localhost:3000/settings`
  - `Invoke-WebRequest http://localhost:3000/guide`
  - `Invoke-WebRequest http://localhost:3000/jobs/new?platform=...`
  - `docker info`
  - `docker compose config`
  - `docker compose up -d --build`
- 执行结果：
  - 已新增 `app_preferences`、`source_links`、`job_events` 三张表，并通过 `python -m app.cli init-db` 应用到本机 PostgreSQL
  - 已预置 BOSS直聘、拉勾、猎聘、智联招聘、前程无忧、牛客、脉脉平台入口
  - 已实现 `GET/PUT /api/preferences`
  - 已实现 `GET/POST/PUT/DELETE /api/source-links`
  - 已实现 `GET/POST /api/jobs/{id}/events`
  - 已扩展 `POST /api/analyze-jd`，返回 `analysis_source`，支持 OpenAI-compatible LLM 解析并在失败或未配置时回退规则引擎
  - 已修复 `GET /api/jobs?q=...` 搜索覆盖 `skills_extracted` 与 `keywords`
  - 已新增 `status_group=interviewing` 覆盖一面、二面、HR 面
  - 已修复 Dashboard 高分岗位排除 `ignore`、`rejected`、`archived`
  - 已新增 `/sources`、`/settings`、`/guide` 页面，并在岗位详情页新增投递事件时间线
  - 后端 `ruff`、`black --check`、`pytest -q` 均通过，pytest 为 14 项通过
  - 前端 `lint`、`test`、`build` 均通过，Vitest 为 11 项通过，Next build 生成 `/sources`、`/settings`、`/guide`
  - 本机 API 验证通过：偏好、来源、JD 解析、临时岗位创建、投递事件记录、技能搜索、临时岗位删除均成功
  - 本机页面访问通过：`/sources`、`/settings`、`/guide`、`/jobs/new?...`、`/dashboard` 均返回 HTTP 200
  - `docker compose config` 通过，并确认 LLM 环境变量已透传到后端容器
  - `docker compose up -d --build` 仍失败，错误为无法连接 `npipe:////./pipe/dockerDesktopLinuxEngine`
- 风险/备注：
  - MVP+ 仍不保存招聘平台账号、密码、Cookie、验证码或登录令牌，不执行爬虫或自动投递
  - LLM 仅解析用户主动粘贴的 JD，未配置 API 或 API 失败时自动回退规则引擎
  - Docker Compose 实际联调仍受本机 Docker Desktop / WSL daemon 不可用阻塞
- 对应提交：
  - `PENDING_COMMIT`

---

### LOG-TEMPLATE
- 时间：YYYY-MM-DD HH:mm
- 任务：TASK-XXX / 任务名称
- 目标：
- 修改文件：
  - 
- 执行命令：
  - 
- 执行结果：
  - 
- 风险/备注：
  - 
- 对应提交：
  - 

---

## 提交记录

| 序号 | 时间 | Commit Hash | Commit Message | 关联任务 | 说明 |
|---|---|---|---|---|---|
| 001 | 2026-04-15 18:31 | b6dea80 | chore: initialize repository | A-01 ~ A-08, B-01 ~ B-07, B-09, C-01 ~ C-05 | 初始化治理文档并完成基础目录与脚手架重组 |
| 002 | 2026-04-15 20:23 | c24d1df | feat(backend): implement jobs analyzer and dashboard api | D-01 ~ D-09, J-01, J-05 | 完成后端 API 主链与测试验证 |
| 003 | 2026-04-15 20:39 | 328beed | feat(frontend): wire jobs workflow and dashboard | E-05, F-01 ~ F-10, G-01 ~ G-10, H-01 ~ H-04, I-01 ~ I-06, J-04 | 完成前端主链联调与 lint/test 验证 |
| 004 | 2026-04-16 00:36 | a1d5f1d | docs(project): sync governance records with git history | K-05, K-06 | 回填历史 commit 记录并同步治理文档 |
| 005 | 2026-04-16 00:48 | b8cb514 | fix(frontend): repair codespaces jd analyzer request flow | J-06, E-05, G-01 ~ G-10 | 修复前端类型收窄与 Codespaces JD 解析请求链路 |
| 006 | 2026-04-16 02:59 | b4e3a01 | fix(frontend): support codespaces backend forwarding | E-02, F-10 | 修复 Codespaces 8000 转发地址识别与后端 CORS 配置 |
| 007 | 2026-04-30 18:25 | c12fc0f | docs(project): record local runtime blockers | J-07, J-08, J-09 | 记录 Docker daemon 不可用、服务未启动和本机 PostgreSQL 缺失状态 |
| 008 | 2026-04-30 19:06 | c086cb0 | docs(project): record docker install blocker | J-07, J-08 | 记录 Docker Desktop 安装残留与系统服务未注册阻塞 |
| 009 | 2026-05-01 22:51 | 2f33c2a | docs(project): record docker environment recheck | J-07, J-08 | 复查 Docker CLI / Compose 与 WSL 状态，确认 Docker 路线不可运行 |
| 010 | 2026-05-01 23:06 | 8423bab | refactor(project): support local postgres workflow | C-06, J-07, K-01 ~ K-04 | 按用户要求支持非 Docker 本机 PostgreSQL 运行路线 |
| 011 | 2026-05-01 23:32 | b7eb6ac | chore(dev): verify local postgres runtime | C-06, J-09 | 安装并验证本机 PostgreSQL、后端和前端联通 |
| 012 | 2026-05-01 23:53 | 2aa90b5 | style(frontend): polish jobs page layout | E-01, E-05 | 按浏览器备注优化 `/jobs` 列表页、全局导航和状态信息展示 |
| 013 | 2026-05-02 00:25 | b97a17d | style(frontend): refactor job editor layout | E-02, F-01, F-10 | 重构 `/jobs/new` 为左右分栏工作流布局，并统一浅色表单控件风格 |
| 014 | 2026-05-02 00:34 | 37591be | feat(frontend): improve job workflow | E-01 ~ E-05, F-10, G-01 ~ G-03, H-01 ~ H-06, J-08 | 补齐入口、列表、Dashboard 与详情编辑的求职操作链路，并完成关键功能验证 |
| 015 | 2026-05-02 00:34 | c2fd970 | style(frontend): format workflow components | E-01, E-04 | 收敛流程组件内 SVG 与列表文字格式化差异 |
| 016 | 2026-05-02 00:44 | PENDING_COMMIT | chore(project): reconcile runtime validation docs | B-08, J-07, K-05 ~ K-07 | 隔离 Compose 容器内部变量，复验本机流程并同步最终验收结论 |
| 017 | 2026-05-02 01:48 | PENDING_COMMIT | feat(project): add compliant automation workflow | L-01 ~ L-21 | 新增平台入口、偏好设置、投递事件时间线、LLM JD 解析与规则回退 |

---

## 当前问题清单

| 编号 | 问题 | 影响 | 状态 | 备注 |
|---|---|---|---|---|
| ISSUE-001 | Docker Desktop 安装仍处于不可用状态，Docker 服务未注册，无法执行 Docker Compose 联调 | 高 | open | Compose 配置已恢复容器内部 `db:5432` / `backend:8000`，但 `docker info` 仍无法连接 `npipe:////./pipe/dockerDesktopLinuxEngine`；WSL 无可用发行版 |
| ISSUE-004 | 本机未安装 PostgreSQL，非 Docker 路线无法直接运行数据层 | 高 | closed | PostgreSQL 16 已安装，`jobtracker` 数据库已初始化，后端数据库联通已验证 |
| ISSUE-002 | 前端 build 类型错误与本机构建链路问题已修复 | 低 | closed | `npm run build` 已通过 |
| ISSUE-003 | Codespaces 浏览器使用 `localhost:8000` 请求后端且 FastAPI 未显式放行 Codespaces 来源的问题已修复 | 低 | closed | 前端现会自动推导 8000 转发地址，后端已补充 CORS 正则 |

---

## 阶段总结
- 当前阶段：本机 PostgreSQL / FastAPI / Next.js 路线已通过质量检查、页面访问和 MVP+ 关键 API 闭环验证；Compose 配置已完成本机 `.env` 与容器内部地址隔离，并新增 LLM 环境变量透传
- 已关闭任务：除 Docker Compose 实际启动 / 联调外，其余 MVP 主路径与 MVP+ 合规辅助自动化任务均已完成
- 未关闭验收项：2 项，分别为“验证 Docker Compose 可启动基础服务”和“确保 Docker Compose 联调通过”
- 当前风险：Docker daemon / Docker Desktop Linux Engine 不可用，阻塞原 PRD 的容器化验收项
- 下一步：修复本机 Docker Desktop / WSL 后，执行 `docker compose up -d --build` 并进行一次容器内 CRUD / JD Analyzer / Dashboard / Sources / Settings 联调复验
