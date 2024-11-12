import { Recipe } from '../types';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface UserRecipesProps {
  recipes: Recipe[];
}

export const UserRecipes = ({ recipes }: UserRecipesProps) => {
  const navigate = useNavigate();

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Mes recettes</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes?.map((recipe) => (
          <Card 
            key={recipe._id}
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => navigate(`/recipes/${recipe._id}`)}
          >
            <div className="p-4">
              <h3 className="font-bold mb-2">{recipe.title}</h3>
              <p className="text-muted-foreground">{recipe.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};