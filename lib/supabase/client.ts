import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 使用单例模式，确保只创建一个客户端实例
let browserClient: ReturnType<typeof createClient> | null = null;

// 创建用于浏览器客户端的实例
export const createBrowserSupabase = () => {
  if (browserClient) return browserClient;
  
  browserClient = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return browserClient;
};

// 创建支持cookie的客户端supabase实例
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true
  }
}); 