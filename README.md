# 数字资产操作系统（Digital Asset OS）

本项目是一个基于 **React + Vite + TypeScript** 的前端应用，提供完整的数字资产管理与交互功能，包括资产概览、充值提现、兑换、跨链桥、3D 世界地图可视化以及个性化界面设置。

---

## ✨ 功能特性

- **用户认证**
    - 登录、注册、忘记密码
    - Token 鉴权与路由守卫

- **仪表盘**
    - 总资产概览
    - 主要资产行情
    - 市场快照
    - 资产分布 & 活动记录
    - 快捷操作（发送、接收、充值、提现、兑换、跨链桥）

- **资产管理**
    - 资产详情页（余额、地址、历史记录）
    - 发送 / 接收数字资产
    - 充值 / 提现
    - 历史记录（发送、接收、兑换、质押、DeFi）

- **资产交换**
    - 即时汇率查询
    - 滑点/手续费预估
    - 交易状态跟踪

- **跨链桥**
    - 选择源链与目标链
    - 可视化跨链交易
    - 状态追踪

- **3D 世界地图**
    - 基于 `react-globe.gl` 渲染交互式地球
    - 支持拖拽旋转、缩放
    - 中国、巴西、马来西亚、巴基斯坦、缅甸、香港、加拿大、日本等地区点击可跳转
    - 跳转后展示该地区的链上指标（账户数、交易数、转账总量、锁仓价值）

- **系统设置**
    - 账户概览（基本信息修改）
    - 隐私与安全
    - 权限管理
    - 网络管理
    - 界面偏好（暗夜模式/深色模式/明亮模式/亮彩模式）
    - 通知设置
    - 关于页面

---

## 📂 项目结构
├── src
│   ├── components       # 通用组件（Card、Button、Input、Sidebar 等）
│   ├── pages            # 页面模块
│   │   ├── dashboard    # 仪表盘
│   │   ├── asset        # 资产管理（发送、接收、充值、提现等）
│   │   ├── swap         # 资产兑换
│   │   ├── bridge       # 跨链桥
│   │   ├── settings     # 系统设置（Appearance 外观等）
│   │   └── atlas        # 3D地球
│   ├── services         # 模拟 API / 数据请求
│   ├── state            # 全局状态（UIProvider）
│   ├── styles           # 全局样式（tokens.css、global.css）
│   ├── App.tsx          # 路由与布局
│   └── main.tsx         # 入口文件
└── vite.config.ts


---

## 🚀 快速开始

### 环境要求
- Node.js 18+
- pnpm / npm / yarn

### 安装依赖
```bash
npm install
```
# 或 pnpm install

## ⚙️ 技术栈

- **框架**
  - React 18 + TypeScript

- **构建工具**
  - Vite

- **路由**
  - React Router v6

- **状态管理**
  - Context Provider（SessionProvider / UIProvider）

- **可视化**
  -  react-globe.gl / 图表库

- **样式**
  - CSS 变量 + tokens.css（支持主题切换）

- **API** 
  - 封装: Axios / Fetch

Mock 数据: 本地模拟接口，支持切换至真实后端