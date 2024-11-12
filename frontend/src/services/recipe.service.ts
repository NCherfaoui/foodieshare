import { Recipe, ApiResponse, RecipeFormData, Comment } from '../types';
import api from './api';
import Response from 'express';

interface RecipeFilters {
  search?: string;
  category?: string;
  difficulty?: string;
  prepTime?: string;
  ingredientsCount?: string;
  page?: number;
}

class RecipeService {
  // Créer une recette
  async createRecipe(data: RecipeFormData): Promise<ApiResponse<Recipe>> {
    try {
      const response = await api.post<Recipe>('/recipes', data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la création de la recette' };
    }
  }

  // Récupérer toutes les recettes
  async getAllRecipes(filters?: RecipeFilters): Promise<ApiResponse<{ recipes: Recipe[], pagination: Pagination }>> {
    try {
      const params = new URLSearchParams();
      
      if (filters?.search?.trim()) {
        params.append('search', filters.search.trim());
      }
      if (filters?.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters?.difficulty && filters.difficulty !== 'all') {
        params.append('difficulty', filters.difficulty);
      }
      if (filters?.ingredientsCount && filters.ingredientsCount !== 'all') {
        const [min, max] = filters.ingredientsCount.split('-');
        params.append('minIngredients', min);
        if (max !== '+') {
          params.append('maxIngredients', max);
        }
      }
      if (filters?.page) {
        params.append('page', filters.page.toString());
      }
  
      const response = await api.get<{ recipes: Recipe[], pagination: Pagination }>(`/recipes?${params.toString()}`);
      console.log('Response:', response.data); // Debug
  
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Erreur récupération recettes:', error);
      return { success: false, error: 'Erreur lors de la récupération des recettes' };
    }
  }

  // Récupérer les recettes populaires
  async getPopularRecipes(): Promise<ApiResponse<Recipe[]>> {
    try {
      const response = await api.get<Recipe[]>('/recipes/popular');
      console.log(response.data);
      
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la récupération des recettes populaires' };
    }
  }

  // Récupérer une recette par ID
  async getRecipeById(id: string): Promise<ApiResponse<Recipe>> {
    try {
      const response = await api.get<Recipe>(`/recipes/${id}`);
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      console.error('Erreur récupération recette:', error);
      return { 
        success: false, 
        error: 'Erreur lors de la récupération de la recette' 
      };
    }
  }

  // Mettre à jour une recette
  async updateRecipe(id: string, data: Partial<RecipeFormData>): Promise<ApiResponse<Recipe>> {
    try {
      const response = await api.put<Recipe>(`/recipes/${id}`, data);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }
  }

  // Supprimer une recette
  async deleteRecipe(id: string): Promise<ApiResponse<void>> {
    try {
      await api.delete(`/recipes/${id}`);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la suppression' };
    }
  }

  // Ajouter un commentaire
  async addComment(recipeId: string, comment: string): Promise<ApiResponse<Recipe>> {
    try {
      const response = await api.post<Recipe>(`/recipes/${recipeId}/comments`, { content: comment });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Erreur lors de l\'ajout du commentaire' };
    }
  }
  async toggleFavorite(recipeId: string): Promise<ApiResponse<Recipe>> {
    try {
      const response = await api.post<Recipe>(`/recipes/${recipeId}/favorite`);
      // Invalider le cache de la recette pour forcer un rafraîchissement
      await queryClient.invalidateQueries(['recipe', recipeId]);
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la modification des favoris' };
    }
  }

  // Noter une recette
  async rateRecipe(recipeId: string, score: number): Promise<ApiResponse<Recipe>> {
    try {
      const response = await api.post<Recipe>(`/recipes/${recipeId}/rate`, { score });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la notation' };
    }
  }
}

export const recipeService = new RecipeService();

export default recipeService;