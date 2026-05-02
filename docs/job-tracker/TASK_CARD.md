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
- [x] ~~执行 Codex 内置浏览器页面与交互验收~~
- [x] ~~将开发模式调试菜单替换为中文显示~~
- [ ] 执行 MVP+ Docker Compose 联调验证

---

## M. 页面结构与网页/JD融合优化
- [x] ~~运行本机 FastAPI / Next.js / PostgreSQL 项目~~
- [x] ~~优化首页为招聘网页来源与 JD 解析融合入口~~
- [x] ~~优化平台入口页，强化外部网页 -> 复制 JD -> 录入岗位流程~~
- [x] ~~优化岗位列表页，展示来源网页与 JD 摘要信息~~
- [x] ~~优化新增/详情页，加入来源网页上下文与结构化检查流程~~
- [x] ~~执行前端 lint / test / build 验证~~
- [x] ~~执行本机页面访问与桌面/移动截图复查~~

---

## N. UI/UX 作战台重排
- [x] ~~建立 Job Mission Control AppShell：左侧导航、顶部 Command Bar、主内容容器~~
- [x] ~~整理暖纸色视觉 token、语义化状态色和统一控件状态~~
- [x] ~~新增 PageHero、StatusBadge、MatchBadge、ScoreRing、InsightCard 等通用组件~~
- [x] ~~/jobs 重排为岗位决策队列：FilterDock + Job Stream + 四项紧凑统计~~
- [x] ~~/jobs/new 重排为 JD Intake Studio：JD Studio + Analysis Inspector + StickyActionBar~~
- [x] ~~/sources 重排为招聘入口库：紧凑入口列表 + 右侧配置面板~~
- [x] ~~/dashboard 重排为求职雷达：KPI、状态分布、方向分布、高分岗位、高频技能词~~
- [x] ~~/guide 重排为流程蓝图：流程线 + 边界说明~~
- [x] ~~执行前端 lint / test / build、目标路由访问和桌面/移动截图复查~~

---

## O. UI/UX 二次重排
- [x] ~~使用前端重排技能复查 `/jobs` 实际截图，定位宽深色侧栏、大卡片堆叠和信息密度不足问题~~
- [x] ~~将 AppShell 调整为窄任务轨、薄指挥栏和更宽主工作区~~
- [x] ~~/jobs 从大卡片流二次重排为紧凑指标条、筛选轨道、表格式岗位队列和右侧决策简报~~
- [x] ~~将 PageHero 压缩为轻量工作区面板，并减少首屏纵向占用~~
- [x] ~~统一残留英文结构文案为中文作战台语境~~
- [x] ~~执行前端 lint / test / build、目标路由访问和桌面/移动截图复查~~

---

## 当前状态
- 当前阶段：非 Docker MVP+ 已完成并通过本机验收；本机 PostgreSQL / FastAPI / Next.js 运行路线已打通；平台入口、偏好设置、投递事件时间线、LLM 解析开关和规则回退均已实现；本轮已完成 Job Mission Control 前端 UI/UX 二次重排，`/jobs` 已从大卡片流调整为更紧凑的任务队列工作台
- 当前阻塞：Docker Compose 配置可解析且容器内部地址已修正，但实际 `docker compose up -d --build` 仍因本机 Docker Desktop / WSL 系统级安装未完成而阻塞；按用户要求，Docker 相关验证暂时搁置，不作为当前继续推进项
- 最新更新时间：2026-05-02 16:55
