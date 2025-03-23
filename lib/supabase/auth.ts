import { createBrowserSupabase } from './client';

export type SignUpCredentials = {
  email: string;
  password: string;
  name?: string;
};

export type SignInCredentials = {
  email: string;
  password: string;
};

// 用户注册
export const signUp = async ({ email, password, name }: SignUpCredentials) => {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name || '',
      },
    },
  });
  
  return { data, error };
};

// 用户登录
export const signIn = async ({ email, password }: SignInCredentials) => {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

// 用户登出
export const signOut = async () => {
  const supabase = createBrowserSupabase();
  const { error } = await supabase.auth.signOut();
  return { error };
};

// 获取当前用户
export const getCurrentUser = async () => {
  try {
    const supabase = createBrowserSupabase();
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
      return { user: null, error };
    }
    
    const { data: { user } } = await supabase.auth.getUser();
    return { user, error: null };
  } catch (error) {
    console.error('获取当前用户错误:', error);
    return { user: null, error };
  }
};

// 发送重置密码邮件
export const resetPassword = async (email: string) => {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });
  
  return { data, error };
};

// 更新用户密码
export const updatePassword = async (password: string) => {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase.auth.updateUser({
    password,
  });
  
  return { data, error };
};

// 更新用户信息
export const updateProfile = async (profile: { name?: string; avatar_url?: string }) => {
  const supabase = createBrowserSupabase();
  const { data, error } = await supabase.auth.updateUser({
    data: {
      full_name: profile.name,
      avatar_url: profile.avatar_url,
    },
  });
  
  return { data, error };
}; 