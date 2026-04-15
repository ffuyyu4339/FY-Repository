# AGENTS.md

## 项目名称
Job Tracker + JD Analyzer

## 强约束技术栈
本项目必须使用以下技术栈开发，不允许擅自替换：

- 前端：React + Next.js + TypeScript
- 后端：Python + FastAPI
- 数据库：PostgreSQL
- 容器化：Docker + Docker Compose
- 运行环境：Linux
- 样式：Tailwind CSS
- 测试：
  - 前端：Vitest / Playwright（至少一种基础可运行方案）
  - 后端：pytest
- 代码规范：
  - 前端：ESLint + Prettier
  - 后端：ruff + black

## 项目治理文档
以下文档为强约束执行依据：

- `docs/job-tracker/PRD.md`
- `docs/job-tracker/TASK_CARD.md`
- `docs/job-tracker/OPERATION_LOG.md`
- `docs/job-tracker/ACCEPTANCE_RECEIPT.md`

开发时必须遵守：
1. 任何开发前，必须先阅读 PRD 和任务卡；
2. 严格只做 MVP 范围，不得擅自扩展；
3. 每完成一项任务，必须同步更新：
   - 任务卡
   - 操作日志
   - 验收回执单
4. 每完成一个清晰子任务后，执行一次小粒度提交；
5. commit message 使用 Conventional Commits；
6. 所有变更必须可运行、可验证、可回滚；
7. 所有本地运行方式必须优先支持 Docker Compose；
8. 默认部署目标为 Linux 服务器；
9. 未经明确要求，不得引入：
   - Supabase
   - Firebase
   - 多用户权限系统
   - 招聘网站爬虫
   - 自动投递
   - AI 对话助手
   - 微服务拆分
10. 任何阻塞必须写入 `docs/job-tracker/OPERATION_LOG.md`。

## 提交规范
使用 Conventional Commits，例如：

- feat(frontend): implement jobs list page
- feat(backend): add jd analyzer endpoint
- feat(db): create jobs schema
- fix(analyzer): correct salary parsing
- docs(project): update governance docs
- test(backend): add score calculation tests

## 工作方式
Codex 执行顺序必须是：

1. 阅读 `docs/job-tracker/PRD.md`
2. 阅读 `docs/job-tracker/TASK_CARD.md`
3. 按任务卡顺序推进
4. 每完成一项任务立即更新治理文档
5. 最终执行 lint / test / build / docker compose 验证
6. 输出最终交付总结
