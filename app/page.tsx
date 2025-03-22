import CocktailForm from '@/components/cocktails/CocktailForm';
import CocktailCard from '@/components/cocktails/CocktailCard';
import { Cocktail } from '@/types';
import { supabase } from '@/lib/supabase/client';

async function getCocktails(): Promise<Cocktail[]> {
  const { data, error } = await supabase
    .from('cocktails')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('获取鸡尾酒列表失败:', error);
    return [];
  }
  
  return data || [];
}

export default async function Home() {
  const cocktails = await getCocktails();
  
  return (
    <div className="container-lg py-8">
      <section className="mb-12">
        <h1 className="heading-lg text-center">发现、收集、分享鸡尾酒配方</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
          使用BreakThirst轻松提取、保存和分享你喜爱的鸡尾酒配方。
          只需粘贴网页链接，我们就能自动提取配料和制作步骤。
        </p>
        
        <div className="max-w-xl mx-auto">
          <CocktailForm />
        </div>
      </section>
      
      <section>
        <h2 className="heading-md mb-6">最新鸡尾酒配方</h2>
        
        {cocktails.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cocktails.map((cocktail) => (
              <CocktailCard key={cocktail.id} cocktail={cocktail} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-medium mb-2">暂无鸡尾酒配方</h3>
            <p className="text-gray-600">
              添加您的第一个鸡尾酒配方，开始构建您的收藏。
            </p>
          </div>
        )}
      </section>
    </div>
  );
} 