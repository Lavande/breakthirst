"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Cocktail, ExtractResponse } from '@/types';
import { useAuth } from '@/lib/context/AuthContext';
import { createBrowserSupabase } from '@/lib/supabase/client';

export default function CocktailForm() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('请先登录后再使用此功能');
      return;
    }
    
    if (!url) {
      setError('请输入鸡尾酒配方的网页链接');
      return;
    }
    
    // 验证URL格式
    try {
      new URL(url);
    } catch (e) {
      setError('请输入有效的URL');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      console.log('开始提交表单，用户状态:', user ? '已登录' : '未登录');
      
      // 获取最新的访问令牌
      const supabase = createBrowserSupabase();
      const { data: sessionData } = await supabase.auth.getSession();
      
      if (!sessionData.session) {
        setError('会话已过期，请重新登录');
        router.push('/login');
        return;
      }
      
      const response = await fetch('/api/cocktails/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
        credentials: 'include', // 确保发送cookie
      });
      
      console.log('收到响应:', response.status, response.statusText);
      
      const data: ExtractResponse = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          setError('请先登录后再使用此功能');
          router.push('/login');
          return;
        }
        setError(data.error || '无法提取鸡尾酒数据');
        setLoading(false);
        return;
      }
      
      if (!data.success || !data.cocktail) {
        setError(data.error || '无法提取鸡尾酒数据');
        setLoading(false);
        return;
      }
      
      // 成功提取数据，跳转到详情页
      router.push(`/cocktails/${data.cocktail.id}`);
    } catch (err) {
      console.error('提取失败:', err);
      setError('网络错误，请稍后重试');
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">添加鸡尾酒配方</h2>
        <p className="text-sm text-gray-600 mb-4">
          输入包含鸡尾酒配方的网页链接，系统将自动提取配料和制作步骤。
        </p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label className="label">
              <span className="label-text">配方网页链接</span>
            </label>
            <input
              type="text"
              placeholder="https://example.com/mojito-recipe"
              className="form-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading}
            />
            {error && (
              <label className="label">
                <span className="label-text-alt text-error">{error}</span>
              </label>
            )}
          </div>
          
          <div className="form-control mt-6">
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner"></span>
                  正在提取...
                </>
              ) : '提取配方'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 