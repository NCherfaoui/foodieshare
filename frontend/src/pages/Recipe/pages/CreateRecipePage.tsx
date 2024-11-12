import React from "react";
import { RecipeForm } from "../components/RecipeForm";
import { useNavigate } from "react-router-dom";
import { RecipeFormData } from "../types";
import { recipeService } from "@/services/recipe.service";
import { useToast } from "@/hooks/use-toast";

export const CreateRecipePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (data: RecipeFormData) => {
    try {
      const response = await recipeService.createRecipe(data);
      if (response.success) {
        toast({
          title: "Succès",
          description: "Recette créée avec succès"
        });
        navigate(`/recipes/${response.data._id}`);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Erreur lors de la création de la recette"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Créer une nouvelle recette</h1>
      <RecipeForm onSubmit={handleSubmit} />
    </div>
  );
};