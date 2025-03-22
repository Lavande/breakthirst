"use client";

import Image from 'next/image';
import Link from 'next/link';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { Cocktail } from '@/types';
import { getDomain, getIngredientsPreview, addToFavorites, removeFromFavorites, isFavorite } from '@/lib/utils/helpers';

interface CocktailCardProps {
  cocktail: Cocktail;
}

export default function CocktailCard({ cocktail }: CocktailCardProps) {
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
    <div className="card-cocktail">
      <figure className="relative h-48">
        <Image 
          src={cocktail.image_url || '/images/placeholder-cocktail.jpg'} 
          alt={cocktail.name}
          className="object-cover"
          fill
        />
      </figure>
      <div className="card-body">
        <div className="flex items-start justify-between">
          <h2 className="card-title">{cocktail.name}</h2>
          <button 
            onClick={toggleFavorite} 
            className="btn btn-ghost btn-sm"
          >
            {isFav ? <FaHeart className="text-error" /> : <FaRegHeart />}
          </button>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-2">
          {cocktail.tags.slice(0, 3).map((tag, i) => (
            <span key={i} className="badge badge-secondary">{tag}</span>
          ))}
          {cocktail.tags.length > 3 && (
            <span className="badge badge-ghost">+{cocktail.tags.length - 3}</span>
          )}
        </div>
        
        <p className="text-sm mb-2">
          <span className="font-semibold">配料:</span> {getIngredientsPreview(cocktail)}
        </p>
        
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">
            来源: {getDomain(cocktail.source_url)}
          </span>
          <Link href={`/cocktails/${cocktail.id}`} className="btn btn-primary btn-sm">
            查看详情
          </Link>
        </div>
      </div>
    </div>
  );
} 