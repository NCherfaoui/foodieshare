import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button'; // Ajout de l'import
import { Skeleton } from '@/components/ui/skeleton';
import { recipeService } from '@/services/recipe.service';
import { useNavigate } from 'react-router-dom';
import { FeaturedRecipeProps } from '../types';

export const FeaturedRecipes = () => {
  const navigate = useNavigate();
  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['featuredRecipes'],
    queryFn: recipeService.getPopularRecipes
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="h-48" />
            <div className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Une erreur est survenue lors du chargement des recettes
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Recettes populaires</h2>
        <Button 
          variant="outline"
          onClick={() => navigate('/recipes')}
        >
          Voir toutes les recettes
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes?.data?.map((recipe) => (
          <Card 
            key={recipe._id}
            className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/recipes/${recipe._id}`)}
          >
            {recipe.imageUrl && (
              <img 
                src={recipe.imageUrl} 
                alt={recipe.title}
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
              <p className="text-muted-foreground line-clamp-2">{recipe.description}</p>
              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <span>Difficulté: {recipe.difficulty}</span>
                <span className="mx-2">•</span>
                <span>Préparation: {recipe.preparationTime}min</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};