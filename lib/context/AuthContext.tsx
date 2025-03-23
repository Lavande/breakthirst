'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { getCurrentUser, signOut } from '../supabase/auth';
import { createBrowserSupabase } from '../supabase/client';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // 加载用户信息并订阅身份验证变化
  useEffect(() => {
    const supabase = createBrowserSupabase();
    
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const { user, error } = await getCurrentUser();
        
        if (error) {
          console.error('获取用户信息时出错:', error);
          throw error;
        }
        
        console.log('AuthContext: 已获取用户信息', user ? '已登录' : '未登录');
        setUser(user);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('未知错误'));
        console.error('身份验证错误:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUser();
    
    // 订阅身份验证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('登出过程中发生错误'));
      console.error('登出错误:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const refreshUser = async () => {
    try {
      setIsLoading(true);
      const { user, error } = await getCurrentUser();
      
      if (error) {
        throw error;
      }
      
      setUser(user);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('刷新用户信息时发生错误'));
      console.error('刷新用户错误:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        signOut: handleSignOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  
  return context;
} 