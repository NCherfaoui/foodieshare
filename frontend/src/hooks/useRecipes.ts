import { useState, useEffect } from 'react';
import { recipeService, PaginatedResponse } from '../services/recipeService';

interface Recipe {
  // ... votre interface Recipe
}

interface UseRecipesReturn {
  recipes: Recipe[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
  refresh: () => Promise<void>;
}

export const useRecipes = (initialPage = 1): UseRecipesReturn => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);

  const fetchRecipes = async (page: number) => {
    try {
      setLoading(true);
      const response = await recipeService.getRecipes(page);
      setRecipes(response.data);
      setTotalPages(response.pagination.totalPages);
    } catch (err) {
      setError('Erreur lors du chargement des recettes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes(currentPage);
  }, [currentPage]);

  const setPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  return {
    recipes,
    loading,
    error,
    currentPage,
    totalPages,
    setPage,
    refresh: () => fetchRecipes(currentPage)
  };
};
