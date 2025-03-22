'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { resetPassword } from '@/lib/supabase/auth';

type FormData = {
  email: string;
};

export default function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const { error } = await resetPassword(data.email);
      
      if (error) throw error;
      
      setSuccess(true);
    } catch (err) {
      console.error('重置密码错误:', err);
      setError(err instanceof Error ? err.message : '重置密码过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="card bg-base-100 shadow-xl max-w-md mx-auto">
      <div className="card-body">
        <h2 className="card-title text-2xl font-bold text-center">重置密码</h2>
        
        {error && (
          <div className="alert alert-error mt-4">
            <span>{error}</span>
          </div>
        )}
        
        {success ? (
          <div className="mt-4 space-y-4">
            <div className="alert alert-success">
              <span>重置密码链接已发送到您的邮箱。请查看您的邮箱并按照指示进行操作。</span>
            </div>
            <div className="text-center mt-4">
              <Link href="/login" className="btn btn-primary">
                返回登录
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
            
            <div className="form-control mt-6">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  '发送重置链接'
                )}
              </button>
            </div>
            
            <div className="text-center mt-4">
              <Link href="/login" className="text-primary hover:underline">
                返回登录
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 