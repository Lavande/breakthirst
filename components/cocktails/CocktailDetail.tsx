"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaRegHeart, FaExternalLinkAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { Cocktail } from '@/types';
import { getDomain, formatDate, addToFavorites, removeFromFavorites, isFavorite } from '@/lib/utils/helpers';

interface CocktailDetailProps {
  cocktail: Cocktail;
}

export default function CocktailDetail({ cocktail }: CocktailDetailProps) {
  const [isFav, setIsFav] = useState(false);
  
  useEffect(() => {
    setIsFav(isFavorite(cocktail.id));
  }, [cocktail.id]);

  const toggleFavorite = () => {
    if (isFav) {
      removeFromFavorites(cocktail.id);
      setIsFav(false);
    } else {
      addToFavorites(cocktail.id);
      setIsFav(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-64 md:h-80">
        <Image 
          src={cocktail.image_url || '/images/placeholder-cocktail.jpg'} 
          alt={cocktail.name}
          className="object-cover"
          fill
          priority
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{cocktail.name}</h1>
          <button 
            onClick={toggleFavorite} 
            className="btn btn-outline"
          >
            {isFav ? (
              <>
                <FaHeart className="text-error mr-2" /> 已收藏
              </>
            ) : (
              <>
                <FaRegHeart className="mr-2" /> 收藏
              </>
            )}
          </button>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          {cocktail.tags.map((tag, i) => (
            <span key={i} className="badge badge-secondary">{tag}</span>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="heading-md">配料</h2>
            <ul className="list-disc pl-5 space-y-2">
              {cocktail.ingredients.map((ingredient, i) => (
                <li key={i}>
                  <span className="font-medium">{ingredient.name}</span>
                  {ingredient.amount && (
                    <span> - {ingredient.amount} {ingredient.unit || ''}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h2 className="heading-md">制作步骤</h2>
            <ol className="list-decimal pl-5 space-y-2">
              {cocktail.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-gray-600">
              <p>添加时间: {formatDate(cocktail.created_at)}</p>
              {cocktail.creator_name && (
                <p className="mt-1">创建者: {cocktail.creator_name}</p>
              )}
              <a 
                href={cocktail.source_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center mt-1 text-primary hover:underline"
              >
                <FaExternalLinkAlt className="mr-1" /> 
                查看原始来源 ({getDomain(cocktail.source_url)})
              </a>
            </div>
            
            <Link 
              href="/" 
              className="btn btn-secondary"
            >
              返回所有配方
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 