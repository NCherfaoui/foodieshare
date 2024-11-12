import { useQuery } from '@tanstack/react-query';
import { recipeService } from '@/services/recipe.service';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeFilters } from '../components/RecipeFilters';
import { useState } from 'react';
import { RecipeFilters as FilterTypes } from '../types';
import { Skeleton } from '@/components/ui/skeleton';
import  Pagination  from '@/components/Pagination';

export const RecipeListPage = () => {
  const [filters, setFilters] = useState<FilterTypes>({
    search: '',
    category: '',
    difficulty: ''
  });
  const [page, setPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ['recipes', filters, page],
    queryFn: () => recipeService.getAllRecipes({ ...filters, page }),
    keepPreviousData: true
  });

  const handleFilterChange = (newFilters: FilterTypes) => {
    setFilters(newFilters);
    setPage(1); // Réinitialiser la page lors du changement de filtres
  };
  console.log(data?.data?.pagination); // Debug

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Toutes les recettes</h1>
      <RecipeFilters onFilterChange={handleFilterChange} />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[300px]" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {data?.data?.recipes?.map(recipe => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>

          {data?.data?.recipes?.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Aucune recette ne correspond à vos critères
              </p>
            </div>
          )}

          {data?.data.pagination && data?.data.pagination.pages > 1 && (
            <div className="mt-8 flex justify-center ">
              <Pagination 
                currentPage={data?.data.pagination.current}
                totalPages={data?.data.pagination.pages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};