import { useEffect, useState } from "react";
import { Recipe } from "../types";
import { recipeService } from "../services/recipe.service";

export const useRecipe = (id?: string) => {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchRecipe = async () => {
      try {
        const response = await recipeService.getRecipeById(id);
        if (response.success && response.data) {
          setRecipe(response.data);
        }
      } catch (err) {
        setError("Erreur lors du chargement de la recette");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  return { recipe, loading, error };
};
