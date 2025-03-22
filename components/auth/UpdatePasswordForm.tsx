'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { updatePassword } from '@/lib/supabase/auth';

type FormData = {
  password: string;
  confirmPassword: string;
};

export default function UpdatePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>();
  
  const password = watch('password');
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const { error } = await updatePassword(data.password);
      
      if (error) throw error;
      
      setSuccess(true);
      reset();
    } catch (err) {
      console.error('更新密码错误:', err);
      setError(err instanceof Error ? err.message : '更新密码过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-xl font-bold">更改密码</h2>
        
        {error && (
          <div className="alert alert-error mt-4">
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success mt-4">
            <span>密码已成功更新！</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">新密码</span>
            </label>
            <input
              type="password"
              placeholder="请输入新密码"
              className="form-input"
              {...register('password', {
                required: '请输入新密码',
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
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">确认新密码</span>
            </label>
            <input
              type="password"
              placeholder="请再次输入新密码"
              className="form-input"
              {...register('confirmPassword', {
                required: '请确认您的新密码',
                validate: (value) => value === password || '两次输入的密码不匹配',
              })}
            />
            {errors.confirmPassword && (
              <span className="text-error text-sm mt-1">{errors.confirmPassword.message}</span>
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
                '更新密码'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 