# AI Agent Station Frontend (React + TypeScript + Vite)

## 项目介绍

AI Agent Station 的前端界面，基于 React + TypeScript + Vite 构建，提供聊天交互、自动代理（AutoAgent）操作、文件上传与管理后台等能力，支持生产就绪的 Docker/Nginx 部署方案。

- 项目定位：AI Agent Station 的可视化前端，面向用户与运营人员提供便捷的交互界面。
- 主要功能：
  - 认证登录/授权（Auth）
  - 聊天对话（Chat）：支持 Markdown 渲染、代码高亮
  - 自动代理（AutoAgent）：任务编排与执行（页面位于 AutoAgent）
  - 文件上传（Upload）
  - 管理后台（Admin）
  - Git 工具页（Git）
- 技术栈：
  - 框架：React 19、TypeScript
  - 构建：Vite 7
  - 路由：react-router-dom 7
  - 状态：Zustand
  - 数据请求与缓存：@tanstack/react-query
  - UI 组件：MUI、Ant Design；样式：Tailwind CSS
  - 网络：Axios
  - Markdown/高亮：react-markdown、marked、react-syntax-highlighter、rehype-raw
- 架构与部署：
  - 单页应用（SPA），使用 Vite 构建，Nginx 提供静态资源与路由回退
  - 与后端通过 REST API 通信，默认后端地址位于 src/services/api.ts

本项目是使用 React + TypeScript + Vite 构建的前端应用，已经提供生产环境 Docker 部署方案（多阶段构建 + Nginx 运行时）。

## 本地开发

- 环境要求：Node.js 18+（推荐 20）
- 安装依赖：

```bash
npm ci
```

- 启动开发服务器：

```bash
npm run dev
```

默认开发端口：3000（参见 vite.config.ts）。

## 生产构建

```bash
npm run build
```

构建产物输出到 dist/ 目录。

## 使用 Docker 部署（含国内镜像源支持）

仓库包含以下文件：
- Dockerfile：多阶段构建，Node 镜像打包，Nginx 提供静态资源与 SPA 路由；支持指定 npm 国内镜像源
- nginx.conf：Nginx 配置，支持前端路由回退与静态资源缓存
- .dockerignore：减小构建上下文

构建镜像（默认使用 npmmirror 源）：

```bash
docker build --build-arg NPM_REGISTRY=https://registry.npmmirror.com -t ai-agent-station-front:latest .
```

若你在国内环境，这个命令可以显著加速依赖安装；如需自定义源，请替换 NPM_REGISTRY。

运行容器：

```bash
docker run -d --name ai-agent-station-front -p 8080:80 ai-agent-station-front:latest
```

访问：

```
http://localhost:8080
```

注意：Windows 上请先启动 Docker Desktop，否则可能遇到 “open //./pipe/dockerDesktopLinuxEngine…” 的报错。

## 后端 API 地址与部署建议

当前前端的后端地址在 src/services/api.ts 中写死为：
```
BASE_URL: 'http://localhost:8091'
API_PREFIX: '/ai-agent-station/api/v1'
```
生产部署时请确保浏览器能直接访问该地址；若部署为同域，建议：
- 修改 BASE_URL 为你的后端地址；或
- 使用 Nginx 反向代理，将前端与后端置于同域，避免跨域问题。

可选的 Nginx 反向代理示例（仅文档示例，未在默认 nginx.conf 启用）：

```
location /ai-agent-station/api/v1/ {
  proxy_pass http://your-backend-host:8091/ai-agent-station/api/v1/;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

## 常见问题

1) docker build 报错类似于 “open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.”
   - 这是因为 Windows 上 Docker Desktop 未启动。请先启动 Docker Desktop 再执行构建。

2) 接口请求跨域（CORS）
   - 后端允许对应来源，或在 Nginx 层做同域反代（见上方示例）。

## 可用脚本

- 开发：`npm run dev`
- 构建：`npm run build`
- 预览：`npm run preview`
- 代码检查：`npm run lint`
