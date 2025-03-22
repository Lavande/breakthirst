import { NextResponse } from 'next/server';
import { extractContent } from '@/lib/utils/readability';
import { extractCocktailData } from '@/lib/openai/client';
import { generateId } from '@/lib/utils/helpers';
import { supabase } from '@/lib/supabase/client';
import { ExtractResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json<ExtractResponse>({
        success: false,
        error: '未提供URL'
      }, { status: 400 });
    }

    // 提取网页内容
    const content = await extractContent(url);
    
    if (!content) {
      return NextResponse.json<ExtractResponse>({
        success: false,
        error: '无法从URL提取内容'
      }, { status: 400 });
    }
    
    // 使用OpenAI提取结构化数据
    const cocktailData = await extractCocktailData(content, url);
    
    if (!cocktailData || !cocktailData.name) {
      return NextResponse.json<ExtractResponse>({
        success: false,
        error: '无法提取结构化鸡尾酒数据'
      }, { status: 400 });
    }
    
    // 创建新记录
    const now = new Date().toISOString();
    const cocktail = {
      id: generateId(),
      name: cocktailData.name,
      ingredients: cocktailData.ingredients || [],
      steps: cocktailData.steps || [],
      image_url: cocktailData.image_url || '',
      tags: cocktailData.tags || [],
      source_url: url,
      created_at: now,
      updated_at: now
    };
    
    // 保存到Supabase
    const { error } = await supabase
      .from('cocktails')
      .insert(cocktail);
      
    if (error) {
      console.error('保存鸡尾酒失败:', error);
      return NextResponse.json<ExtractResponse>({
        success: false,
        error: '保存鸡尾酒数据失败'
      }, { status: 500 });
    }
    
    return NextResponse.json<ExtractResponse>({
      success: true,
      cocktail
    });
  } catch (error) {
    console.error('提取失败:', error);
    return NextResponse.json<ExtractResponse>({
      success: false,
      error: '提取处理失败'
    }, { status: 500 });
  }
} 