import { useState } from 'react';
import { RecipeFormData } from '../types';
import { recipeService } from '@/services/recipe.service';
import { useToast } from '@/hooks/use-toast';

export const useRecipeForm = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (data: RecipeFormData) => {
    try {
      setLoading(true);
      const response = await recipeService.createRecipe(data);
      
      if (response.success) {
        toast({
          title: "Succès",
          description: "Recette créée avec succès"
        });
        return true;
      }
      throw new Error(response.error);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la création de la recette"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading };
};