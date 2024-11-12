import { Recipe } from '@/types';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const navigate = useNavigate();

  return (
    <Card 
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
  );
};