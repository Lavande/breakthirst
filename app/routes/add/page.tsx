"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExtractResponse } from '@/types';
import CocktailForm from '@/components/cocktails/CocktailForm';

export default function AddCocktailPage() {
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