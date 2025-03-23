import { notFound } from 'next/navigation';
import CocktailDetail from '@/components/cocktails/CocktailDetail';
import { Cocktail } from '@/types';
import { supabase } from '@/lib/supabase/client';

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
    title: `${cocktail.name} | BreakThirst`,
    description: `${cocktail.name}鸡尾酒配方，包含${cocktail.ingredients.length}种配料和详细制作步骤。`,
  };
}

async function getCocktail(id: string): Promise<Cocktail | null> {
  // 先获取鸡尾酒基本信息
  const { data, error } = await supabase
    .from('cocktails')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error || !data) {
    console.error('获取鸡尾酒详情失败:', error);
    return null;
  }
  
  // 如果有user_id，再查询用户名
  let creator_name = '未知用户';
  if (data.user_id) {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', data.user_id)
      .single();
      
    if (profileData?.username) {
      creator_name = profileData.username;
    }
  }
  
  // 返回组合后的数据
  return {
    ...data,
    creator_name
  };
}

export default async function CocktailPage({ params }: PageProps) {
  const cocktail = await getCocktail(params.id);
  
  if (!cocktail) {
    notFound();
  }
  
  return (
    <div className="container-lg py-8">
      <CocktailDetail cocktail={cocktail} />
    </div>
  );
} 