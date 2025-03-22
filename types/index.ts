export interface Cocktail {
  id: string;
  name: string;
  ingredients: CocktailIngredient[];
  steps: string[];
  image_url: string;
  tags: string[];
  source_url: string;
  created_at: string;
  updated_at: string;
}

export interface CocktailIngredient {
  name: string;
  amount?: string;
  unit?: string;
}

export interface ExtractResponse {
  success: boolean;
  cocktail?: Cocktail;
  error?: string;
}

export interface AdminResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export type CocktailFormData = Omit<Cocktail, 'id' | 'created_at' | 'updated_at'>; 