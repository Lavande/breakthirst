import { Cocktail } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * 生成唯一ID
 */
export function generateId(): string {
  return uuidv4();
}

/**
 * 格式化日期为本地字符串
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * 解析URL获取主域名
 */
export function getDomain(url: string): string {
  try {
    const { hostname } = new URL(url);
    return hostname.replace(/^www\./, '');
  } catch (e) {
    return url;
  }
}

/**
 * 从本地存储获取收藏的鸡尾酒列表
 */
export function getFavorites(): string[] {
  if (typeof window !== 'undefined') {
    const favorites = localStorage.getItem('favorites');
    return favorites ? JSON.parse(favorites) : [];
  }
  return [];
}

/**
 * 添加鸡尾酒到收藏
 */
export function addToFavorites(cocktailId: string): void {
  if (typeof window !== 'undefined') {
    const favorites = getFavorites();
    if (!favorites.includes(cocktailId)) {
      localStorage.setItem('favorites', JSON.stringify([...favorites, cocktailId]));
    }
  }
}

/**
 * 从收藏中移除鸡尾酒
 */
export function removeFromFavorites(cocktailId: string): void {
  if (typeof window !== 'undefined') {
    const favorites = getFavorites();
    localStorage.setItem(
      'favorites',
      JSON.stringify(favorites.filter((id) => id !== cocktailId))
    );
  }
}

/**
 * 检查鸡尾酒是否已收藏
 */
export function isFavorite(cocktailId: string): boolean {
  return getFavorites().includes(cocktailId);
}

/**
 * 获取鸡尾酒的预览配料文本
 */
export function getIngredientsPreview(cocktail: Cocktail): string {
  return cocktail.ingredients
    .slice(0, 3)
    .map((i) => i.name)
    .join(', ') + (cocktail.ingredients.length > 3 ? '...' : '');
}

/**
 * 获取鸡尾酒的预览步骤文本
 */
export function getStepsPreview(cocktail: Cocktail): string {
  if (cocktail.steps.length === 0) return '';
  const firstStep = cocktail.steps[0];
  if (firstStep.length > 100) {
    return firstStep.substring(0, 100) + '...';
  }
  return firstStep + (cocktail.steps.length > 1 ? '...' : '');
} 