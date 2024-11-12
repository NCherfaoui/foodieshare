import { RecipeFormData } from '../types';

export const validateRecipeForm = (data: RecipeFormData): string[] => {
    const errors: string[] = [];
    
    if (!data.title || data.title.length < 3) {
      errors.push('Le titre doit contenir au moins 3 caractères');
    }
    
    if (!data.ingredients || data.ingredients.length === 0) {
      errors.push('Au moins un ingrédient est requis');
    }
    
    if (!data.steps || data.steps.length === 0) {
      errors.push('Au moins une étape est requise');
    }
    
    return errors;
  };
  