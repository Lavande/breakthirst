import { NextResponse } from 'next/server';
import { extractContent } from '@/lib/utils/readability';
import { extractCocktailData } from '@/lib/openai/client';
import { generateId } from '@/lib/utils/helpers';
import { ExtractResponse } from '@/types';
import { createAPISupabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    // 使用API Route Handler Client进行认证
    const supabase = createAPISupabase();
    
    // 尝试获取用户信息而不仅仅是会话
    const { data: userData, error: userError } = await supabase.auth.getUser();
    
    // 记录调试信息
    console.log('用户认证状态:', userData?.user ? '有效' : '无效');
    if (userError) {
      console.error('获取用户信息错误:', userError);
    }
    
    // 如果没有有效用户，返回401错误
    if (!userData.user) {
      console.error('未找到有效用户，返回401');
      return NextResponse.json<ExtractResponse>({
        success: false,
        error: '用户未登录'
      }, { status: 401 });
    }
    
    // 提取请求正文
    const body = await request.json();
    const { url } = body;
    
    console.log('请求URL:', url);
    
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
      updated_at: now,
      user_id: userData.user.id
    };
    
    // 保存到数据库
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