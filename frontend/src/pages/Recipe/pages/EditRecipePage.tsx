import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { recipeService } from "@/services/recipe.service";
import { useToast } from "@/hooks/use-toast";
import { RecipeForm } from "../components/RecipeForm";
import { Skeleton } from "@/components/ui/skeleton";
import { RecipeFormData } from "../types";
import { useAuth } from "@/contexts/AuthContext";

export const EditRecipePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Récupérer les données de la recette
  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => recipeService.getRecipeById(id as string),
    enabled: !!id,
  });

  // Mutation pour la mise à jour
  const updateRecipeMutation = useMutation({
    mutationFn: (data: RecipeFormData) => 
      recipeService.updateRecipe(id as string, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["recipe", id]);
      toast({
        title: "Succès",
        description: "Recette mise à jour avec succès",
      });
      navigate(`/recipes/${id}`);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour la recette",
      });
    },
  });

  // Mutation pour la suppression
  const deleteRecipeMutation = useMutation({
    mutationFn: () => recipeService.deleteRecipe(id as string),
    onSuccess: () => {
      toast({
        title: "Succès",
        description: "Recette supprimée avec succès",
      });
      navigate("/recipes");
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer la recette",
      });
    },
  });

  const handleSubmit = async (data: RecipeFormData) => {
    updateRecipeMutation.mutate(data);
  };

  const handleDelete = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette recette ?")) {
      deleteRecipeMutation.mutate();
    }
  };

  // Vérification des droits
  if (recipe?.data && user?.id !== recipe.data.author && user?.role !== 'admin') {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">
          Vous n'êtes pas autorisé à modifier cette recette
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-1/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!recipe?.data) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">Recette non trouvée</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Modifier la recette</h1>
        <button
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700"
        >
          Supprimer la recette
        </button>
      </div>
      <RecipeForm
        onSubmit={handleSubmit}
        mode="edit" 
        initialData={{
          title: recipe.data.title,
          description: recipe.data.description,
          ingredients: recipe.data.ingredients,
          steps: recipe.data.steps,
          preparationTime: recipe.data.preparationTime || 0,
          difficulty: recipe.data.difficulty || 'Facile',
          category: recipe.data.category || 'plat'
        }}
      />
    </div>
  );
};

export default EditRecipePage;