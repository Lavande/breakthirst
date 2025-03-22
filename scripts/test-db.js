// 测试Supabase连接的脚本
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('错误: 环境变量未设置');
  console.error('请确保 .env.local 文件中包含 NEXT_PUBLIC_SUPABASE_URL 和 NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

console.log('环境变量检查通过');
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  console.log('正在测试 Supabase 连接...');
  
  try {
    // 尝试简单查询
    const { data, error } = await supabase
      .from('cocktails')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('查询错误:', error);
      if (error.code === '42P01' && error.message.includes('relation "public.cocktails" does not exist')) {
        console.log('\n需要创建cocktails表。请使用以下SQL在Supabase控制台执行:');
        console.log('--------------------------------------');
        console.log(`
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
        `);
        console.log('--------------------------------------');
      }
      process.exit(1);
    }
    
    console.log('连接成功! cocktails表已创建');
    console.log(`查询到 ${data.length} 条记录`);
    if (data.length > 0) {
      console.log('示例记录:');
      console.log(JSON.stringify(data[0], null, 2));
    }
    
  } catch (err) {
    console.error('连接测试失败:', err);
    process.exit(1);
  }
}

testConnection(); 