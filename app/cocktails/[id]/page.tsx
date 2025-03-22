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