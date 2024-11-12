export interface RecipeFormData {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  preparationTime: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  category: string;
}

export interface RecipeFilters {
  category?: string;
  difficulty?: string;
  search?: string;
}