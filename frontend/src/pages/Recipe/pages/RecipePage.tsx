import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { recipeService } from '@/services/recipe.service';
import { RecipeFilters } from '../components/RecipeFilters';
import { RecipeGrid } from '../components/RecipeGrid';
import { Loader2 } from "lucide-react";
import { Pagination } from '@/components/Pagination';

export const RecipePage = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    prepTime: '',
    ingredientsCount: ''
  });
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ['recipes', filters, page],
    queryFn: () => recipeService.getAllRecipes({ ...filters, page }),
    keepPreviousData: true,
    staleTime: 5000,
    refetchOnWindowFocus: false
  });

  const handleFilterChange = (newFilters: typeof filters) => {
    if (JSON.stringify(filters) !== JSON.stringify(newFilters)) {
      setFilters(newFilters);
      setPage(1); // Reset page to 1 when filters change
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">Une erreur est survenue lors du chargement des recettes</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <RecipeFilters onFilterChange={handleFilterChange} isLoading={isFetching} />
      {data?.success && Array.isArray(data.data) ? (
        <div className={`transition-opacity duration-200 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
          <RecipeGrid recipes={data.data} />
          <Pagination
            currentPage={page}
            totalPages={data.pagination.pages}
            onPageChange={setPage}
          />
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-8">
          {isLoading ? 'Chargement des recettes...' : 'Aucune recette trouvée'}
        </p>
      )}
    </div>
  );
};
