---
trigger: always_on
---

## 项目概述

本项目是一个基于 Vue 3 + TypeScript + Vite 的 Monorepo 架构项目，使用 pnpm 作为包管理器，包含多个业务组件和工具包，主要用于构建企业级应用。

## 核心技术

- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **构建工具**: Vite
- **包管理器**: pnpm
- **样式**: UnoCSS

## 核心依赖

- @vueuse/core: Vue 组合式 API 工具集
- es-toolkit: 实用工具库

## 目录结构

```
├── packages/             # 子包目录
│   ├── components-antv/  # 基于`Ant Design Vue 4.2.x`的业务组件库
│   ├── hooks/            # vue hooks
│   └── utils/            # 工具函数
├── public/               # 静态资源
├── src/                  # 主应用源码（目前主要用于试用packages内的内容）
│   ├── assets/           # 资源文件
│   ├── components/       # 应用组件
│   ├── App.vue           # 根组件
│   └── main.ts           # 入口文件
├── .eslintrc.js          # ESLint 配置
├── .prettierrc           # Prettier 配置
├── package.json          # 项目配置
├── pnpm-workspace.yaml   # pnpm 工作区配置
└── vite.config.ts        # Vite 配置
```

## 命名规范

- **组件命名**: PascalCase，如 `AMapSelect`
- **文件名**: 组件文件使用 PascalCase，其他文件使用 camelCase，如 `aMapService`
- **变量命名**: camelCase，如 `aMapService`
- **常量命名**: UPPER_SNAKE_CASE，如 `MAX_COUNT`
- **函数命名**: camelCase，如 `initMap`

## 组件目录结构

```
ComponentName/
├── ComponentName.vue    # 组件主文件
├── index.ts             # 导出文件
├── types.ts             # 类型定义
└── utils.ts             # 组件专用工具函数（可选）
```
