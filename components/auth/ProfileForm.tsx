'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/lib/context/AuthContext';
import { updateProfile } from '@/lib/supabase/auth';

type FormData = {
  name: string;
};

export default function ProfileForm() {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      name: user?.user_metadata?.full_name || '',
    },
  });
  
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const { error } = await updateProfile({
        name: data.name,
      });
      
      if (error) throw error;
      
      await refreshUser();
      setSuccess(true);
    } catch (err) {
      console.error('更新个人资料错误:', err);
      setError(err instanceof Error ? err.message : '更新个人资料过程中发生错误');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-xl font-bold">个人资料</h2>
        
        {error && (
          <div className="alert alert-error mt-4">
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="alert alert-success mt-4">
            <span>个人资料已成功更新！</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">电子邮箱</span>
            </label>
            <input
              type="email"
              value={user?.email || ''}
              className="form-input"
              disabled
            />
            <p className="text-sm text-gray-500 mt-1">邮箱地址无法更改</p>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">姓名</span>
            </label>
            <input
              type="text"
              placeholder="请输入您的姓名"
              className="form-input"
              {...register('name', {
                required: '请输入您的姓名',
              })}
            />
            {errors.name && (
              <span className="text-error text-sm mt-1">{errors.name.message}</span>
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
                '保存更改'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 