import { Recipe } from '@/types';

export interface FeaturedRecipeProps {
  recipe: Recipe;
}

export interface HomePageProps {
  featuredRecipes: Recipe[];
}