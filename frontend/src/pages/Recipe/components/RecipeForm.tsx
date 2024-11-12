import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { RecipeFormData } from "../types";

interface RecipeFormProps {
  onSubmit: (data: RecipeFormData) => Promise<void>;
  initialData?: RecipeFormData;
  mode?: 'create' | 'edit'; // Ajout du mode
}

export const RecipeForm = ({ onSubmit, initialData, mode = 'create' }: RecipeFormProps) => {
  const [formData, setFormData] = useState<RecipeFormData>(
    initialData || {
      title: "",
      description: "",
      ingredients: [""],
      steps: [""],
      preparationTime: 0,
      difficulty: "Facile",
      category: "plat",
    }
  );

  const handleAddIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const handleAddStep = () => {
    setFormData((prev) => ({
      ...prev,
      steps: [...prev.steps, ""],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Titre</label>
        <Input
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Catégorie</label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, category: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entree">Entrée</SelectItem>
            <SelectItem value="plat">Plat</SelectItem>
            <SelectItem value="dessert">Dessert</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">
          Temps de préparation (minutes)
        </label>
        <Input
          type="number"
          value={formData.preparationTime}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              preparationTime: parseInt(e.target.value),
            }))
          }
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Difficulté</label>
        <Select
          value={formData.difficulty}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, difficulty: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionnez une difficulté" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Facile">Facile</SelectItem>
            <SelectItem value="Moyen">Moyen</SelectItem>
            <SelectItem value="Difficile">Difficile</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Ingrédients</label>
        {formData.ingredients.map((ingredient, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Input
              value={ingredient}
              onChange={(e) => {
                const newIngredients = [...formData.ingredients];
                newIngredients[index] = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  ingredients: newIngredients,
                }));
              }}
            />
            {index === formData.ingredients.length - 1 && (
              <Button type="button" onClick={handleAddIngredient}>
                +
              </Button>
            )}
          </div>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Étapes</label>
        {formData.steps.map((step, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <Textarea
              value={step}
              onChange={(e) => {
                const newSteps = [...formData.steps];
                newSteps[index] = e.target.value;
                setFormData((prev) => ({ ...prev, steps: newSteps }));
              }}
            />
            {index === formData.steps.length - 1 && (
              <Button type="button" onClick={handleAddStep}>
                +
              </Button>
            )}
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full">
        {mode === 'create' ? 'Créer la recette' : 'Modifier la recette'}
      </Button>
    </form>
  );
};
