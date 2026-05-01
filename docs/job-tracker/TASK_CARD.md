# Job Tracker + JD Analyzer - 单独任务卡

## 使用规则
1. 本文件是本项目唯一任务执行清单；
2. 每完成一项任务，必须：
   - 将 `- [ ]` 改为 `- [x]`
   - 同时将任务标题加删除线，例如：
     `- [x] ~~初始化 Next.js 前端~~`
3. 每完成一项任务后，必须同步更新：
   - `docs/job-tracker/OPERATION_LOG.md`
   - `docs/job-tracker/ACCEPTANCE_RECEIPT.md`
4. 不允许跳过主路径任务先做视觉美化；
5. 如遇阻塞，必须写入操作日志。

---

## A. 治理与初始化
- [x] ~~创建 `AGENTS.md`~~
- [x] ~~创建 `docs/job-tracker/PRD.md`~~
- [x] ~~创建 `docs/job-tracker/TASK_CARD.md`~~
- [x] ~~创建 `docs/job-tracker/OPERATION_LOG.md`~~
- [x] ~~创建 `docs/job-tracker/ACCEPTANCE_RECEIPT.md`~~
- [x] ~~初始化仓库基础目录结构~~
- [x] ~~初始化 `README.md`~~
- [x] ~~初始化 `.env.example`~~

---

## B. 工程脚手架
- [x] ~~初始化 `frontend/` Next.js + React + TypeScript + Tailwind 项目~~
- [x] ~~初始化 `backend/` FastAPI 项目~~
- [x] ~~创建前端 `Dockerfile`~~
- [x] ~~创建后端 `Dockerfile`~~
- [x] ~~创建根目录 `docker-compose.yml`~~
- [x] ~~配置前端 ESLint / Prettier~~
- [x] ~~配置后端 ruff / black / pytest~~
- [ ] 验证 Docker Compose 可启动基础服务
- [x] ~~验证 Linux 环境运行说明完整~~

---

## C. 数据层
- [x] ~~设计 PostgreSQL `jobs` 表 schema~~
- [x] ~~创建 `db/init.sql`~~
- [x] ~~配置 FastAPI 数据库连接~~
- [x] ~~实现数据库会话/连接管理~~
- [x] ~~实现 `jobs` 基础数据访问层~~
- [x] ~~验证数据库联通性~~

---

## D. 后端 API
- [x] ~~实现 `GET /api/jobs`~~
- [x] ~~实现 `POST /api/jobs`~~
- [x] ~~实现 `GET /api/jobs/{id}`~~
- [x] ~~实现 `PUT /api/jobs/{id}`~~
- [x] ~~实现 `DELETE /api/jobs/{id}`~~
- [x] ~~实现 `POST /api/analyze-jd`~~
- [x] ~~实现 `GET /api/dashboard/summary`~~
- [x] ~~补充 API 输入输出模型~~
- [x] ~~补充基础错误处理~~

---

## E. 前端页面
- [x] ~~实现 `/jobs` 岗位列表页~~
- [x] ~~实现 `/jobs/new` 新增岗位页~~
- [x] ~~实现 `/jobs/[id]` 岗位详情页~~
- [x] ~~实现 `/dashboard` 统计页~~
- [x] ~~接入前端 API 请求层~~
- [x] ~~实现基础导航与布局~~

---

## F. 岗位 CRUD 交互
- [x] ~~实现新增岗位表单~~
- [x] ~~实现编辑岗位表单~~
- [x] ~~实现删除岗位操作~~
- [x] ~~实现关键词搜索~~
- [x] ~~实现状态筛选~~
- [x] ~~实现城市筛选~~
- [x] ~~实现方向筛选~~
- [x] ~~实现匹配等级筛选~~
- [x] ~~实现按匹配分排序~~
- [x] ~~实现按更新时间排序~~

---

## G. JD Analyzer
- [x] ~~实现 JD 原文输入区~~
- [x] ~~实现技能关键词提取~~
- [x] ~~实现经验要求识别~~
- [x] ~~实现学历要求识别~~
- [x] ~~实现城市识别~~
- [x] ~~实现薪资文本解析~~
- [x] ~~实现岗位方向分类~~
- [x] ~~实现匹配分计算~~
- [x] ~~实现匹配等级映射~~
- [x] ~~支持人工修正分析结果~~

---

## H. 投递流程管理
- [x] ~~实现状态流转更新~~
- [x] ~~实现简历版本字段管理~~
- [x] ~~实现备注字段管理~~
- [x] ~~确保详情页可维护完整生命周期~~

---

## I. Dashboard
- [x] ~~实现总岗位数统计~~
- [x] ~~实现各状态岗位数量统计~~
- [x] ~~实现各方向岗位数量统计~~
- [x] ~~实现上海岗位数统计~~
- [x] ~~实现高分岗位 Top N~~
- [x] ~~实现高频技能词展示~~

---

## J. 质量保障
- [x] ~~为后端分析逻辑补充 pytest 单元测试~~
- [x] ~~为后端 API 补充基础测试~~
- [x] ~~为前端页面补充基础测试~~
- [x] ~~确保前端 lint 通过~~
- [x] ~~确保后端 lint 通过~~
- [x] ~~确保前端 build 通过~~
- [ ] 确保 Docker Compose 联调通过
- [x] ~~确保关键功能可手工验证~~

---

## K. 文档与交付
- [x] ~~完善 README 安装说明~~
- [x] ~~完善 README 本地开发说明~~
- [x] ~~完善 README Docker 启动说明~~
- [x] ~~完善 README Linux 部署说明~~
- [x] ~~更新操作日志最终记录~~
- [x] ~~更新验收回执单最终状态~~
- [x] ~~输出最终交付总结~~

---

## L. MVP+ 合规自动化与大模型增强
- [x] ~~更新 PRD，明确 MVP+ 合规辅助自动化边界~~
- [x] ~~新增招聘平台入口与搜索链接数据表~~
- [x] ~~新增求职偏好配置数据表~~
- [x] ~~新增投递事件时间线数据表~~
- [x] ~~实现 Preferences API~~
- [x] ~~实现 Source Links API~~
- [x] ~~实现 Job Events API~~
- [x] ~~扩展 JD Analyzer，支持 OpenAI-compatible LLM 解析与规则回退~~
- [x] ~~修复岗位关键词搜索覆盖技能数组和关键词数组~~
- [x] ~~修复面试中快捷筛选覆盖一面、二面、HR 面~~
- [x] ~~修复 Dashboard 高分岗位排除已拒绝、归档、忽略岗位~~
- [x] ~~新增 `/sources` 平台入口页~~
- [x] ~~新增 `/settings` 偏好设置页~~
- [x] ~~新增 `/guide` 新人使用指南页~~
- [x] ~~在岗位详情页展示并新增投递事件~~
- [x] ~~新增岗位页自动使用默认简历版本~~
- [x] ~~补充 MVP+ 后端测试~~
- [x] ~~补充 MVP+ 前端测试~~
- [x] ~~执行 MVP+ 后端 ruff / black / pytest 验证~~
- [x] ~~执行 MVP+ 前端 lint / test / build 验证~~
- [x] ~~执行 MVP+ 本机 API 与页面访问验证~~
- [ ] 执行 MVP+ Docker Compose 联调验证

---

## 当前状态
- 当前阶段：本机 PostgreSQL / FastAPI / Next.js 运行路线已打通；MVP+ 合规辅助自动化已完成代码实现，包含平台入口、偏好设置、投递事件时间线、LLM 解析开关和规则回退；后端 ruff/black/pytest、前端 lint/test/build、本机 API 与页面访问已通过
- 当前阻塞：Docker Compose 配置已修正为容器内部 `db:5432` / `backend:8000` 地址，但实际 `docker compose up -d --build` 仍因本机 Docker daemon / Docker Desktop Linux Engine 不可用而阻塞
- 最新更新时间：2026-05-02 01:40
