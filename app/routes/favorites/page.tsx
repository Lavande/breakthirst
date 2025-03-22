import { Metadata } from 'next';
import CocktailCard from '@/components/cocktails/CocktailCard';
import { Cocktail } from '@/types';
import { supabase } from '@/lib/supabase/client';
import Script from 'next/script';

export const metadata: Metadata = {
  title: '我的收藏 | BreakThirst',
  description: '查看您收藏的所有鸡尾酒配方',
};

async function getAllCocktails(): Promise<Cocktail[]> {
  const { data, error } = await supabase
    .from('cocktails')
    .select('*');
  
  if (error) {
    console.error('获取鸡尾酒列表失败:', error);
    return [];
  }
  
  return data || [];
}

export default async function FavoritesPage() {
  const allCocktails = await getAllCocktails();
  
  return (
    <>
      <Script id="get-favorites">
        {`
          window.getFavoritesList = function() {
            try {
              const favorites = localStorage.getItem('favorites');
              return favorites ? JSON.parse(favorites) : [];
            } catch (e) {
              console.error('读取收藏列表失败:', e);
              return [];
            }
          }
          
          document.addEventListener('DOMContentLoaded', function() {
            const favList = document.getElementById('favorites-list');
            const emptyState = document.getElementById('empty-state');
            const favoriteIds = window.getFavoritesList();
            
            if (favoriteIds.length === 0) {
              if (favList) favList.style.display = 'none';
              if (emptyState) emptyState.style.display = 'block';
            } else {
              if (favList) {
                favList.style.display = 'grid';
                // 过滤元素
                Array.from(favList.children).forEach(item => {
                  const id = item.getAttribute('data-id');
                  if (!favoriteIds.includes(id)) {
                    item.style.display = 'none';
                  } else {
                    item.style.display = 'block';
                  }
                });
                
                // 检查是否有可见的子元素
                const visibleItems = Array.from(favList.children).filter(
                  item => item.style.display !== 'none'
                );
                
                if (visibleItems.length === 0) {
                  if (favList) favList.style.display = 'none';
                  if (emptyState) emptyState.style.display = 'block';
                }
              }
            }
          });
          
          // 监听收藏变化
          window.addEventListener('storage', function(e) {
            if (e.key === 'favorites') {
              const favoriteIds = window.getFavoritesList();
              const favList = document.getElementById('favorites-list');
              const emptyState = document.getElementById('empty-state');
              
              if (favoriteIds.length === 0) {
                if (favList) favList.style.display = 'none';
                if (emptyState) emptyState.style.display = 'block';
              } else {
                if (favList) {
                  favList.style.display = 'grid';
                  // 过滤元素
                  Array.from(favList.children).forEach(item => {
                    const id = item.getAttribute('data-id');
                    if (!favoriteIds.includes(id)) {
                      item.style.display = 'none';
                    } else {
                      item.style.display = 'block';
                    }
                  });
                  
                  // 检查是否有可见的子元素
                  const visibleItems = Array.from(favList.children).filter(
                    item => item.style.display !== 'none'
                  );
                  
                  if (visibleItems.length === 0) {
                    if (favList) favList.style.display = 'none';
                    if (emptyState) emptyState.style.display = 'block';
                  }
                }
              }
            }
          });
        `}
      </Script>
      
      <div className="container-lg py-8">
        <h1 className="heading-lg">我的收藏</h1>
        <p className="text-gray-600 mb-8">
          查看您保存的所有鸡尾酒配方，轻松管理您的收藏。
        </p>
        
        <div id="favorites-list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCocktails.map((cocktail) => (
            <div key={cocktail.id} data-id={cocktail.id}>
              <CocktailCard cocktail={cocktail} />
            </div>
          ))}
        </div>
        
        <div id="empty-state" className="text-center py-10 bg-gray-50 rounded-lg" style={{ display: 'none' }}>
          <h3 className="text-xl font-medium mb-2">您还没有收藏任何鸡尾酒</h3>
          <p className="text-gray-600 mb-4">
            浏览所有配方并点击收藏按钮，将喜欢的鸡尾酒添加到收藏夹。
          </p>
        </div>
      </div>
    </>
  );
} 