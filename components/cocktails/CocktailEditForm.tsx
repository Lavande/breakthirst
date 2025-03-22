"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Cocktail, CocktailFormData, AdminResponse, CocktailIngredient } from '@/types';

interface CocktailEditFormProps {
  cocktail: Cocktail;
}

export default function CocktailEditForm({ cocktail }: CocktailEditFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ingredients, setIngredients] = useState<CocktailIngredient[]>(cocktail.ingredients);
  const [steps, setSteps] = useState<string[]>(cocktail.steps);
  const [tags, setTags] = useState<string[]>(cocktail.tags);
  
  const { register, handleSubmit, formState: { errors } } = useForm<{
    name: string;
    image_url: string;
    source_url: string;
  }>({
    defaultValues: {
      name: cocktail.name,
      image_url: cocktail.image_url,
      source_url: cocktail.source_url,
    }
  });
  
  // 配料相关函数
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };
  
  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };
  
  const updateIngredient = (index: number, field: keyof CocktailIngredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = { ...newIngredients[index], [field]: value };
    setIngredients(newIngredients);
  };
  
  // 步骤相关函数
  const addStep = () => {
    setSteps([...steps, '']);
  };
  
  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };
  
  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };
  
  // 标签相关函数
  const addTag = () => {
    setTags([...tags, '']);
  };
  
  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };
  
  const updateTag = (index: number, value: string) => {
    const newTags = [...tags];
    newTags[index] = value;
    setTags(newTags);
  };
  
  const onSubmit = async (data: {name: string; image_url: string; source_url: string}) => {
    setLoading(true);
    setError(null);
    
    try {
      // 合并表单数据
      const formData: CocktailFormData = {
        name: data.name,
        image_url: data.image_url,
        source_url: data.source_url,
        ingredients,
        steps,
        tags
      };
      
      // 验证必填字段
      if (!formData.name || !formData.source_url) {
        setError('名称和来源URL不能为空');
        setLoading(false);
        return;
      }
      
      // 验证配料
      if (formData.ingredients.some(ing => !ing.name)) {
        setError('配料名称不能为空');
        setLoading(false);
        return;
      }
      
      // 验证步骤
      if (formData.steps.some(step => !step)) {
        setError('步骤内容不能为空');
        setLoading(false);
        return;
      }
      
      // 验证标签
      if (formData.tags.some(tag => !tag)) {
        setError('标签不能为空');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`/api/admin/cocktails/${cocktail.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      const result: AdminResponse = await response.json();
      
      if (!result.success) {
        setError(result.error || '保存失败');
        setLoading(false);
        return;
      }
      
      // 成功，返回列表页
      router.push('/admin');
    } catch (err) {
      console.error('保存失败:', err);
      setError('网络错误，请稍后重试');
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-6">
        {/* 基本信息 */}
        <div>
          <h2 className="heading-md">基本信息</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">鸡尾酒名称</span>
              </label>
              <input
                type="text"
                className="form-input"
                {...register("name", { required: "名称不能为空" })}
              />
              {errors.name && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.name.message}</span>
                </label>
              )}
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">图片URL</span>
              </label>
              <input
                type="text"
                className="form-input"
                {...register("image_url")}
              />
            </div>
            
            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text">来源URL</span>
              </label>
              <input
                type="text"
                className="form-input"
                {...register("source_url", { required: "来源URL不能为空" })}
              />
              {errors.source_url && (
                <label className="label">
                  <span className="label-text-alt text-error">{errors.source_url.message}</span>
                </label>
              )}
            </div>
          </div>
        </div>
        
        {/* 配料 */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="heading-md">配料</h2>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={addIngredient}
            >
              添加配料
            </button>
          </div>
          
          <div className="space-y-4 mt-4">
            {ingredients.map((ingredient, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5">
                  <label className="label text-xs">配料名称</label>
                  <input
                    type="text"
                    className="form-input"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-3">
                  <label className="label text-xs">数量</label>
                  <input
                    type="text"
                    className="form-input"
                    value={ingredient.amount || ''}
                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                  />
                </div>
                <div className="col-span-3">
                  <label className="label text-xs">单位</label>
                  <input
                    type="text"
                    className="form-input"
                    value={ingredient.unit || ''}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-error"
                    onClick={() => removeIngredient(index)}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 步骤 */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="heading-md">制作步骤</h2>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={addStep}
            >
              添加步骤
            </button>
          </div>
          
          <div className="space-y-4 mt-4">
            {steps.map((step, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-1 text-center">
                  <span className="badge badge-lg">{index + 1}</span>
                </div>
                <div className="col-span-10">
                  <textarea
                    className="textarea textarea-bordered w-full"
                    rows={2}
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    required
                  />
                </div>
                <div className="col-span-1">
                  <button
                    type="button"
                    className="btn btn-sm btn-error"
                    onClick={() => removeStep(index)}
                  >
                    删除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 标签 */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="heading-md">标签</h2>
            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={addTag}
            >
              添加标签
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {tags.map((tag, index) => (
              <div key={index} className="flex items-center space-x-2 bg-base-200 p-2 rounded-lg">
                <input
                  type="text"
                  className="input input-sm input-bordered"
                  value={tag}
                  onChange={(e) => updateTag(index, e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-sm btn-circle btn-error"
                  onClick={() => removeTag(index)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* 提交按钮 */}
        <div className="mt-8 flex justify-end">
          {error && (
            <div className="alert alert-error mr-4">
              <span>{error}</span>
            </div>
          )}
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                正在保存...
              </>
            ) : '保存修改'}
          </button>
        </div>
      </div>
    </form>
  );
} 