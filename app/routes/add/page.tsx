"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExtractResponse } from '@/types';
import CocktailForm from '@/components/cocktails/CocktailForm';
import { useAuth } from '@/lib/context/AuthContext';

export default function AddCocktailPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  // 如果正在加载或未登录，显示加载状态
  if (isLoading || !user) {
    return (
      <div className="container-lg py-8 flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="container-lg py-8">
      <section className="mb-12">
        <h1 className="heading-lg text-center">添加鸡尾酒配方</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          使用BreakThirst轻松提取、保存和分享你喜爱的鸡尾酒配方。
          只需粘贴网页链接，我们就能自动提取配料和制作步骤。
        </p>
        
        <div className="max-w-xl mx-auto">
          <CocktailForm />
        </div>
      </section>
    </div>
  );
} 