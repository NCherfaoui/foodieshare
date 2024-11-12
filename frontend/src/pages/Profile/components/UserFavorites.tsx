import { Recipe } from '../types';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeartIcon } from 'lucide-react';

interface UserFavoritesProps {
  favorites: Recipe[];
}

export const UserFavorites = ({ favorites }: UserFavoritesProps) => {
  const navigate = useNavigate();

  if (!favorites?.length) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Mes favoris</h2>
        <Card className="p-6 text-center text-muted-foreground">
          <HeartIcon className="mx-auto h-12 w-12 mb-2" />
          <p>Vous n'avez pas encore de recettes favorites</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => navigate('/recipes')}
          >
            Découvrir des recettes
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Mes favoris</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((recipe) => (
          <Card 
            key={recipe._id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/recipes/${recipe._id}`)}
          >
            <div className="p-4">
              <h3 className="font-bold mb-2">{recipe.title}</h3>
              <p className="text-muted-foreground line-clamp-2">
                {recipe.description}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserFavorites;