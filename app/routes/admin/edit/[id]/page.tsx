import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Cocktail } from '@/types';
import { supabase } from '@/lib/supabase/client';
import CocktailEditForm from '@/components/cocktails/CocktailEditForm';

interface PageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const cocktail = await getCocktail(params.id);
  
  if (!cocktail) {
    return {
      title: '配方未找到 | BreakThirst',
    };
  }
  
  return {
    title: `编辑 ${cocktail.name} | BreakThirst`,
    description: `编辑 ${cocktail.name} 鸡尾酒配方的信息。`,
  };
}

async function getCocktail(id: string): Promise<Cocktail | null> {
  const { data, error } = await supabase
    .from('cocktails')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) {
    console.error('获取鸡尾酒详情失败:', error);
    return null;
  }
  
  return data;
}

export default async function EditCocktailPage({ params }: PageProps) {
  const cocktail = await getCocktail(params.id);
  
  if (!cocktail) {
    notFound();
  }
  
  return (
    <div className="container-lg py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="heading-lg">编辑鸡尾酒配方</h1>
        <Link href="/admin" className="btn btn-outline">
          返回列表
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <CocktailEditForm cocktail={cocktail} />
      </div>
    </div>
  );
} 