# BreakThirst - 鸡尾酒配方管理平台

BreakThirst是一个现代化的鸡尾酒配方管理平台，让用户可以轻松地从网页中提取、保存和分享鸡尾酒配方。只需输入包含鸡尾酒配方的网页链接，系统将自动提取配料和制作步骤，为您创建结构化的鸡尾酒数据。

## ✨ 主要功能

- 🍹 **自动提取**: 从任何含有鸡尾酒配方的网页自动提取结构化数据
- 📱 **响应式设计**: 在任何设备上都能获得完美的浏览体验
- ❤️ **收藏功能**: 收藏您喜爱的鸡尾酒配方，方便日后查看
- 🔍 **详细信息**: 展示配料、制作步骤、标签和来源信息
- 🔄 **管理功能**: 管理员可以编辑和删除配方

## 🛠️ 技术栈

- **前端**:
  - Next.js 14 (App Router)
  - React 18
  - TypeScript
  - Tailwind CSS + DaisyUI
  - React Hook Form

- **后端**:
  - Next.js API Routes
  - Supabase (PostgreSQL数据库)
  - OpenAI API (用于结构化数据提取)

- **工具**:
  - ESLint
  - Prettier
  - npm

## 📋 前提条件

在开始之前，确保您已经安装:

- Node.js (v18.0.0 或更高版本)
- npm (v8.0.0 或更高版本)
- Supabase账号 (用于数据存储)
- OpenAI API密钥 (用于内容提取)

## 🚀 快速开始

### 克隆项目

```bash
git clone https://github.com/yourusername/breakthirst.git
cd breakthirst.io
```

### 安装依赖

```bash
npm install
```

### 环境配置

创建`.env.local`文件并添加以下环境变量:

```
# Supabase配置
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥

# OpenAI配置
OPENAI_API_KEY=你的OpenAI API密钥
```

### 数据库设置

在Supabase控制台中执行以下SQL命令来创建必要的表结构:

```sql
CREATE TABLE public.cocktails (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  ingredients JSONB NOT NULL,
  steps JSONB NOT NULL,
  image_url TEXT,
  tags JSONB NOT NULL,
  source_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 添加行级安全策略（RLS）
ALTER TABLE public.cocktails ENABLE ROW LEVEL SECURITY;

-- 创建公开读取的策略
CREATE POLICY "允许公开读取" ON public.cocktails
FOR SELECT USING (true);

-- 创建服务端写入策略
CREATE POLICY "允许服务端写入" ON public.cocktails
FOR INSERT WITH CHECK (true);

CREATE POLICY "允许服务端更新" ON public.cocktails
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "允许服务端删除" ON public.cocktails
FOR DELETE USING (true);
```

### 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🎯 使用指南

### 提取鸡尾酒配方

1. 在首页找到鸡尾酒提取表单
2. 粘贴包含鸡尾酒配方的网页URL
3. 点击"提取配方"按钮
4. 系统将自动分析页面内容并提取结构化数据
5. 成功后将自动跳转到新创建的鸡尾酒详情页

### 收藏管理

1. 在鸡尾酒详情页点击"收藏"按钮将配方添加到收藏夹
2. 访问"我的收藏"页面查看所有收藏的配方
3. 再次点击"收藏"按钮可以取消收藏

### 管理功能

1. 访问"/admin"路径进入管理后台
2. 查看所有鸡尾酒配方列表
3. 点击编辑按钮修改配方信息
4. 点击删除按钮移除配方

## 📱 移动端适配

BreakThirst采用响应式设计，在各种屏幕尺寸上都能提供良好的用户体验:

- 桌面端: 提供完整的功能和布局
- 平板端: 优化的导航和内容布局
- 移动端: 紧凑的界面，便于单手操作

## 🤝 贡献指南

欢迎贡献代码、提交问题或改进建议。请遵循以下步骤:

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交修改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 📄 许可证

本项目基于MIT许可证 - 详情请参阅 [LICENSE](LICENSE) 文件。

## 📧 联系方式

如有任何问题或建议，请联系:

- 项目创建者 - [您的姓名](mailto:您的邮箱)
- 项目仓库 - [https://github.com/yourusername/breakthirst.io](https://github.com/yourusername/breakthirst.io)

---

**BreakThirst** - 发现、收集、分享美味鸡尾酒配方的最佳平台 🍸 