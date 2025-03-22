import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { AdminResponse, CocktailFormData } from '@/types';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json<AdminResponse>({
        success: false,
        error: '未提供ID'
      }, { status: 400 });
    }
    
    // 从Supabase删除记录
    const { error } = await supabase
      .from('cocktails')
      .delete()
      .eq('id', id);
      
    if (error) {
      console.error('删除鸡尾酒失败:', error);
      return NextResponse.json<AdminResponse>({
        success: false,
        error: '删除鸡尾酒数据失败'
      }, { status: 500 });
    }
    
    return NextResponse.json<AdminResponse>({
      success: true,
      message: '鸡尾酒删除成功'
    });
  } catch (error) {
    console.error('删除失败:', error);
    return NextResponse.json<AdminResponse>({
      success: false,
      error: '删除处理失败'
    }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id) {
      return NextResponse.json<AdminResponse>({
        success: false,
        error: '未提供ID'
      }, { status: 400 });
    }
    
    const data: CocktailFormData = await request.json();
    
    if (!data || !data.name) {
      return NextResponse.json<AdminResponse>({
        success: false,
        error: '数据不完整'
      }, { status: 400 });
    }
    
    // 更新记录
    const { error } = await supabase
      .from('cocktails')
      .update({
        name: data.name,
        ingredients: data.ingredients,
        steps: data.steps,
        image_url: data.image_url,
        tags: data.tags,
        source_url: data.source_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);
      
    if (error) {
      console.error('更新鸡尾酒失败:', error);
      return NextResponse.json<AdminResponse>({
        success: false,
        error: '更新鸡尾酒数据失败'
      }, { status: 500 });
    }
    
    return NextResponse.json<AdminResponse>({
      success: true,
      message: '鸡尾酒更新成功'
    });
  } catch (error) {
    console.error('更新失败:', error);
    return NextResponse.json<AdminResponse>({
      success: false,
      error: '更新处理失败'
    }, { status: 500 });
  }
} 