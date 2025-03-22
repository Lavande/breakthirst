"use client";

import { Metadata } from 'next';
import Link from 'next/link';
import { FaTrash, FaEdit } from 'react-icons/fa';
import { Cocktail } from '@/types';
import { supabase } from '@/lib/supabase/client';
import { formatDate, getDomain } from '@/lib/utils/helpers';

export const metadata: Metadata = {
  title: '管理后台 | BreakThirst',
  description: '管理和编辑鸡尾酒配方',
};

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

export default async function AdminPage() {
  const cocktails = await getCocktails();
  
  return (
    <div className="container-lg py-8">
      <h1 className="heading-lg">管理后台</h1>
      <p className="text-gray-600 mb-8">
        管理所有鸡尾酒配方，可以编辑或删除现有配方。
      </p>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="table table-zebra">
          <thead>
            <tr>
              <th>名称</th>
              <th>配料数量</th>
              <th>步骤数量</th>
              <th>来源</th>
              <th>添加时间</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {cocktails.length > 0 ? (
              cocktails.map((cocktail) => (
                <tr key={cocktail.id}>
                  <td>
                    <Link href={`/cocktails/${cocktail.id}`} className="font-medium text-primary hover:underline">
                      {cocktail.name}
                    </Link>
                  </td>
                  <td>{cocktail.ingredients.length}</td>
                  <td>{cocktail.steps.length}</td>
                  <td className="text-xs">{getDomain(cocktail.source_url)}</td>
                  <td className="text-xs">{formatDate(cocktail.created_at)}</td>
                  <td>
                    <div className="flex gap-2">
                      <Link 
                        href={`/admin/edit/${cocktail.id}`} 
                        className="btn btn-circle btn-sm btn-ghost"
                      >
                        <FaEdit className="text-secondary" />
                      </Link>
                      <button
                        className="btn btn-circle btn-sm btn-ghost"
                        onClick={async () => {
                          if (confirm('确定要删除这个鸡尾酒配方吗？此操作不可逆。')) {
                            await fetch(`/api/admin/cocktails/${cocktail.id}`, {
                              method: 'DELETE',
                            });
                            window.location.reload();
                          }
                        }}
                      >
                        <FaTrash className="text-error" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8">
                  暂无鸡尾酒配方数据
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 