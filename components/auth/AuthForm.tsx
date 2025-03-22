'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { signIn, signUp } from '@/lib/supabase/auth';
import Link from 'next/link';

type AuthFormProps = {
  type: 'login' | 'register';
};

type FormData = {
  email: string;
  password: string;
  name?: string;
};

export default function AuthForm({ type }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (type === 'login') {
        const { error } = await signIn({
          email: data.email,
          password: data.password,
        });
        
        if (error) throw error;
        
        router.push('/');
        router.refresh();
      } else {
        const { error } = await signUp({
          email: data.email,
          password: data.password,
          name: data.name,
        });
        
        if (error) throw error;
        
        // 显示成功信息并重定向到登录页面
        alert('注册成功！请查看您的邮箱进行验证。');
        router.push('/login');
      }
    } catch (err) {
      console.error('认证错误:', err);
      setError(err instanceof Error ? err.message : '认证过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center">
          {type === 'login' ? '登录' : '注册'}
        </h2>
        
        {error && (
          <div className="alert alert-error mt-4">
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          {type === 'register' && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">姓名</span>
              </label>
              <input
                type="text"
                placeholder="请输入您的姓名"
                className="form-input"
                {...register('name')}
              />
            </div>
          )}
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">电子邮箱</span>
            </label>
            <input
              type="email"
              placeholder="your@email.com"
              className="form-input"
              {...register('email', {
                required: '请输入电子邮箱',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: '请输入有效的电子邮箱地址',
                },
              })}
            />
            {errors.email && (
              <span className="text-error text-sm mt-1">{errors.email.message}</span>
            )}
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">密码</span>
            </label>
            <input
              type="password"
              placeholder="请输入密码"
              className="form-input"
              {...register('password', {
                required: '请输入密码',
                minLength: {
                  value: 6,
                  message: '密码必须至少包含6个字符',
                },
              })}
            />
            {errors.password && (
              <span className="text-error text-sm mt-1">{errors.password.message}</span>
            )}
          </div>
          
          <div className="form-control mt-6">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : type === 'login' ? (
                '登录'
              ) : (
                '注册'
              )}
            </button>
          </div>
        </form>
        
        <div className="divider">或</div>
        
        <div className="text-center">
          {type === 'login' ? (
            <p>
              还没有账号？{' '}
              <Link href="/register" className="text-primary hover:underline">
                立即注册
              </Link>
            </p>
          ) : (
            <p>
              已有账号？{' '}
              <Link href="/login" className="text-primary hover:underline">
                返回登录
              </Link>
            </p>
          )}
        </div>
        
        {type === 'login' && (
          <div className="text-center mt-2">
            <Link href="/forgot-password" className="text-sm text-secondary hover:underline">
              忘记密码？
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 