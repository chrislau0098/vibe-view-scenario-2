# vibe-view-scenario-2 — Project Instructions

## 项目定位

这是 **vibe-view 系列**的第 2 个风格实验，目标是基于同一份产品数据（AutoRadar 汽车雷达部件），探索不同的网页风格与视觉语言。

- **数据来源：** 飞书多维表格 · 产品管理（与 scenario-1 完全相同的数据集）
- **产品图片：** 已预置于 `public/products/`，共 39 张（AR-PJ / AR-LR / IR-LR / AR-MW / IR-MW / INS 系列）
- **产品数据：** `src/data/products.ts`，包含 39 款产品完整信息，7 条产品线

## 技术栈（已安装，勿重复安装）

```
React 18 + Vite + TypeScript
Tailwind CSS 4（@tailwindcss/vite，CSS-first，无 tailwind.config.js）
motion（framer-motion v11+）→ import { motion } from 'motion/react'
shadcn/ui（Tailwind v4 模式，已初始化）
@fontsource-variable/geist（Geist Sans Variable）
路径别名：@/ → ./src/
```

## 关键配置（已完成，不要修改）

- `vite.config.ts`：已配置 `@tailwindcss/vite` + `@/` 路径别名
- `tsconfig.app.json`：已配置 `paths: { "@/*": ["./src/*"] }` + `ignoreDeprecations: "6.0"`
- `src/index.css`：Tailwind + shadcn + Geist 字体已导入，设计 token 待根据风格定制
- `index.html`：`<html lang="en">`，无 `class="dark"`（默认明亮模式，如需暗黑可加）

## 数据模型

```ts
export interface Product {
  id: string           // 'AR-PJ001', 'AR-LR-001', 'INS-001' 等
  name: string         // 中文产品名
  code: string         // 'AR - PJ001' 原始格式
  category: '传感器' | '核心处理部件' | '发射接收部件' | '辅助设备' | '激光雷达' | '毫米波雷达' | '组合导航系统'
  status: '上架' | '下架'
  price: number
  cost: number
  stock: number
  tagline: string      // 产品信息第一句
  industry: string     // 应用行业
  image: string        // '/products/AR-PJ001.jpg'
  specs: { label: string; value: string }[]  // 4 条技术参数（测距范围/视场角/定位精度/姿态精度）
}

// 导出：products（全部39款）、activeProducts（仅上架）、categories、categoryGroups
```

## 开发命令

```bash
npm run dev    # 启动开发服务器
npm run build  # 构建
```

## 与其他 scenario 的关系

| 项目 | 风格 | 路径 |
|------|------|------|
| scenario-1 | 暖米色 · Sigma×DJI 精密工业感 | `../vibe-view-scenario-1` |
| **scenario-2** | **待定义（本项目）** | 当前目录 |

**不要**参考或复制 scenario-1 的组件代码。本项目应从零实现全新风格。

## 动效规范（所有 scenario 通用）

```tsx
// ease 必须用 cubic-bezier 数组，不能用字符串（TypeScript 类型不兼容）
transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}  // ✅
transition={{ duration: 0.5, ease: 'easeOut' }}               // ❌ TS 报错

// Section 入场用 whileInView，Hero 用 animate
```

## 禁止事项

- ❌ 蓝紫渐变 + Inter 字体 + 卡片嵌套（"AI 通用套路"）
- ❌ `ease: 'easeOut'` 等字符串 easing（改用 `[0.25, 0.1, 0.25, 1]`）
- ❌ 直接复制 scenario-1 的组件
- ❌ 修改 `src/data/products.ts` 的数据结构（只能添加字段，不能删改现有字段）
