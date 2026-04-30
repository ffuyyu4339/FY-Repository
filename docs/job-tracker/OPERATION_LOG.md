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
  - `PENDING_COMMIT`

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

---

## 当前问题清单

| 编号 | 问题 | 影响 | 状态 | 备注 |
|---|---|---|---|---|
| ISSUE-001 | Docker Desktop 安装文件已落盘，但管理员授权未完成，Docker 服务未注册，无法执行 Docker Compose 联调 | 高 | open | `docker info` 无法连接 `npipe:////./pipe/dockerDesktopLinuxEngine`；需以管理员权限完成 Docker Desktop 安装 |
| ISSUE-002 | 前端 build 类型错误与本机构建链路问题已修复 | 低 | closed | `npm run build` 已通过 |
| ISSUE-003 | Codespaces 浏览器使用 `localhost:8000` 请求后端且 FastAPI 未显式放行 Codespaces 来源的问题已修复 | 低 | closed | 前端现会自动推导 8000 转发地址，后端已补充 CORS 正则 |

---

## 阶段总结
- 当前阶段：本地代码质量检查通过，Docker daemon / PostgreSQL 运行环境待恢复
- 已完成任务数：59
- 未完成任务数：8
- 当前风险：Docker Compose 联调仍受 Docker Desktop 系统服务未注册影响
- 下一步：以管理员权限完成 Docker Desktop 安装并启动 Linux Engine 后，重新执行 `docker compose down && docker compose up -d --build`，继续完成数据库联通与浏览器手工验收
