export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  preparationTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeInput {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  preparationTime: number;
  difficulty: 'easy' | 'medium' | 'hard';
}
