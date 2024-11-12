import { useQuery } from '@tanstack/react-query';
import { recipeService } from '@/services/recipe.service';
import { RecipeCard } from './components/RecipeCard';
import { RecipeFilters } from './components/RecipeFilters';
import { useState } from 'react';

export const RecipePage = () => {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: ''
  });

  const { data: recipes, isLoading } = useQuery({
    queryKey: ['recipes', filters],
    queryFn: () => recipeService.getAllRecipes(filters)
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Recettes</h1>
        <Button 
          onClick={() => navigate('/recipes/create')}
          className="bg-primary text-white"
        >
          Créer une recette
        </Button>
      </div>

      <RecipeFilters onFilterChange={setFilters} />
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-[300px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes?.data?.map(recipe => (
            <RecipeCard key={recipe._id} recipe={recipe} />
          ))}
        </div>
      )}

      {recipes?.data?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Aucune recette ne correspond à vos critères
          </p>
        </div>
      )}
    </div>
  );
};

export default RecipePage;