import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recipeService } from "@/services/recipe.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Star, Pencil } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Comment {
  _id: string;
  username: string;  
  content: string;   
  createdAt: string; 
}
interface Rating {
  user: string;
  score: number;
  date: string;
}
export const RecipeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number>(0);

  const {
    data: recipe,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => recipeService.getRecipeById(id as string),
    enabled: !!id,
  });

  const addCommentMutation = useMutation({
    mutationFn: () => recipeService.addComment(id as string, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(["recipe", id]);
      setComment("");
      toast({
        title: "Commentaire ajouté",
        description: "Votre commentaire a été publié avec succès",
      });
    },
  });
const toggleFavoriteMutation = useMutation({
  mutationFn: () => recipeService.toggleFavorite(id as string),
  onMutate: async () => {
    // Annuler les requêtes en cours
    await queryClient.cancelQueries(['recipe', id]);
    await queryClient.cancelQueries(['userProfile']);

    // Sauvegarder l'état précédent
    const previousRecipe = queryClient.getQueryData(['recipe', id]);

    // Optimistic update
    queryClient.setQueryData(['recipe', id], (old: { data: { isFavorited: boolean } }) => ({
      ...old,
      data: {
        ...old.data,
        isFavorited: !old.data.isFavorited
      }
    }));

    return { previousRecipe };
  },
  onError: (err, _, context) => {
    // Restaurer l'état précédent en cas d'erreur
    queryClient.setQueryData(['recipe', id], context?.previousRecipe);
    
    toast({
      variant: "destructive",
      title: "Erreur",
      description: "Impossible de mettre à jour les favoris"
    });
  },
  onSuccess: (data) => {
    queryClient.invalidateQueries(['recipe', id]);
    queryClient.invalidateQueries(['userProfile']);
    
    toast({
      title: "Favoris mis à jour",
      description: data.isFavorited 
        ? "La recette a été ajoutée à vos favoris"
        : "La recette a été retirée de vos favoris"
    });
  },
  onSettled: () => {
    // Rafraîchir les données
    queryClient.invalidateQueries(['recipe', id]);
    queryClient.invalidateQueries(['userProfile']);
  }
});

  const rateRecipeMutation = useMutation({
    mutationFn: (score: number) =>
      recipeService.rateRecipe(id as string, score),
    onSuccess: () => {
      queryClient.invalidateQueries(["recipe", id]);
      toast({
        title: "Note ajoutée",
        description: "Merci d'avoir noté cette recette",
      });
    },
  });

  const handleRating = (score: number) => {
    setRating(score);
    rateRecipeMutation.mutate(score);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Date non disponible";
    }
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Skeleton className="h-8 w-1/2 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
      </div>
    );
  }

  if (error || !recipe?.data) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">Erreur lors du chargement de la recette</p>
      </div>
    );
  }
  const averageRating = recipe?.data?.ratings?.reduce(
    (acc: number, curr: Rating) => acc + curr.score,
    0
  ) / (recipe?.data?.ratings?.length || 1);
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{recipe.data.title}</h1>
        <div className="flex items-center gap-4">
          {/* Système de notation avec note moyenne */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold mr-2">
                {averageRating.toFixed(1)}
              </span>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 cursor-pointer transition-colors ${
                    star <= (rating || averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => user ? handleRating(star) : null}
                  onMouseEnter={() => user && setRating(star)}
                  onMouseLeave={() => user && setRating(recipe.data.averageRating || 0)}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                ({recipe.data.ratings?.length || 0})
              </span>
            </div>
            {!user && (
              <p className="text-xs text-muted-foreground mt-1">
                Connectez-vous pour noter cette recette
              </p>
            )}
          </div>

          {/* Boutons d'action */}
          <div className="flex gap-2">
            {user?.role === 'admin' && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigate(`/recipes/${id}/edit`)}
                title="Modifier la recette"
              >
                <Pencil className="h-5 w-5" />
              </Button>
            )}
            
            {/* Bouton favoris existant */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => user && toggleFavoriteMutation.mutate()}
              disabled={!user}
              className="relative"
            >
              <Heart 
                className={cn(
                  "h-5 w-5 transition-colors duration-200",
                  recipe.data.isFavorited 
                    ? "fill-red-500 text-red-500" 
                    : "text-gray-500 hover:text-red-500"
                )} 
              />
            </Button>
          </div>
        </div>
      </div>


      <div className="prose max-w-none">
        <p className="text-gray-600 mb-6">{recipe.data.description}</p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Ingrédients</h2>
          <ul className="list-disc pl-5">
            {recipe.data.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <ol className="list-decimal pl-5">
            {recipe.data.steps.map((step, index) => (
              <li key={index} className="mb-2">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Commentaires</h2>
        {user ? (
          <div className="mb-4">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="mb-2"
            />
            <Button
              onClick={() => addCommentMutation.mutate()}
              disabled={!comment.trim()}
            >
              Publier
            </Button>
          </div>
        ) : (
          <p className="text-muted-foreground">
            Connectez-vous pour ajouter un commentaire
          </p>
        )}

        <div className="space-y-4">
          {recipe.data.comments?.map((comment: Comment) => (            
            <div key={comment._id} className="border rounded-lg p-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">{comment.user?.username}</span>
                <span className="text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </span>
              </div>
              <p>{comment.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
