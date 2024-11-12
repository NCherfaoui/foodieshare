import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSearchParams } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { debounce } from 'lodash';
import { timeRanges } from '@/utils/helpers';
interface RecipeFiltersProps {
  onFilterChange: (filters: {
    search: string;
    category: string;
    difficulty: string;
    prepTime: string;
    ingredientsCount: string;
  }) => void;
  isLoading?: boolean;
}

export const RecipeFilters = ({ onFilterChange, isLoading }: RecipeFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [difficulty, setDifficulty] = useState(searchParams.get('difficulty') || '');
  const [prepTime, setPrepTime] = useState(searchParams.get('prepTime') || '');
  const [ingredientsCount, setIngredientsCount] = useState(searchParams.get('ingredients') || '');

  // Mise à jour des filtres et de l'URL
  const updateFilters = (newFilters: Record<string, string>) => {
    const updatedFilters = {
      ...{
        search,
        category,
        difficulty,
        prepTime,
        ingredientsCount,
      },
      ...newFilters
    };

    // Mettre à jour les états locaux
    if ('search' in newFilters) setSearch(newFilters.search);
    if ('category' in newFilters) setCategory(newFilters.category);
    if ('difficulty' in newFilters) setDifficulty(newFilters.difficulty);
    if ('prepTime' in newFilters) setPrepTime(newFilters.prepTime);
    if ('ingredientsCount' in newFilters) setIngredientsCount(newFilters.ingredientsCount);

    // Convertir 'all' en chaîne vide pour les filtres
    const cleanedFilters = Object.fromEntries(
      Object.entries(updatedFilters).map(([key, value]) => [
        key,
        value === 'all' ? '' : value
      ])
    );

    // Mise à jour des paramètres d'URL
    const newSearchParams = new URLSearchParams();
    Object.entries(cleanedFilters).forEach(([key, value]) => {
      if (value && value.trim() !== '') {
        newSearchParams.set(key, value);
      }
    });
    setSearchParams(newSearchParams);

    // Appel du callback parent avec les filtres nettoyés
    onFilterChange(cleanedFilters);
  };

  // Debounce pour la recherche
  useEffect(() => {
    const debouncedSearch = debounce(() => {
      updateFilters({ search });
    }, 500);

    debouncedSearch();
    return () => debouncedSearch.cancel();
  }, [search]);

  const resetFilters = () => {
    setSearch('');
    setCategory('');
    setDifficulty('');
    setPrepTime('');
    setIngredientsCount('');
    setSearchParams({}); // Vider tous les paramètres d'URL
    onFilterChange({
      search: '',
      category: '',
      difficulty: '',
      prepTime: '',
      ingredientsCount: ''
    });
  };

  // Modifier le calcul des filtres actifs
  const activeFiltersCount = [
    search && search.trim() !== '' ? 'search' : null,
    category && category !== 'all' ? 'category' : null,
    difficulty && difficulty !== 'all' ? 'difficulty' : null,
    prepTime && prepTime !== 'all' ? 'prepTime' : null,
    ingredientsCount && ingredientsCount !== 'all' ? 'ingredientsCount' : null
  ].filter(Boolean).length;

  return (
    <div className="mb-6 space-y-4">
      {/* Nouvelle barre de recherche style Leboncoin */}
      <div className="flex-1">
        <div className="relative flex h-11 w-full items-center rounded-lg bg-white dark:bg-gray-700  border shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une recette..."
            className="h-full w-full rounded-lg bg-transparent px-4 text-base outline-none focus:ring-2 focus:ring-primary"
          />
          
          {/* Bouton clear */}
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-14 flex h-full items-center justify-center px-2 text-gray-400 hover:text-gray-600"
              title="Effacer"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
              >
                <path fillRule="evenodd" d="m2,12C2,6.48,6.48,2,12,2s10,4.48,10,10-4.48,10-10,10S2,17.52,2,12Zm7.75-3.67c-.39-.39-1.02-.39-1.41,0-.39.39-.39,1.02,0,1.41l2.23,2.23-2.23,2.23c-.39.39-.39,1.02,0,1.41.39.39,1.02.39,1.41,0l2.23-2.23,2.23,2.23c.39.39,1.02.39,1.41,0s.39-1.02,0-1.41l-2.23-2.23,2.23-2.23c.39-.39.39-1.02,0-1.41-.39-.39-1.02-.39-1.41,0l-2.23,2.23-2.23-2.23Z" />
              </svg>
            </button>
          )}

          {/* Bouton recherche */}
          <button
            className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary dark:bg-gray-900 text-white hover:bg-primary/90 transition-colors"
            title="Rechercher"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Filtres sur une nouvelle ligne */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Select
          value={category}
          onValueChange={(value) => updateFilters({ category: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            <SelectItem value="entree">Entrées</SelectItem>
            <SelectItem value="plat">Plats</SelectItem>
            <SelectItem value="dessert">Desserts</SelectItem>
            <SelectItem value="aperitif">Apéritifs</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={difficulty}
          onValueChange={(value) => updateFilters({ difficulty: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Difficulté" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les difficultés</SelectItem>
            <SelectItem value="Facile">Facile</SelectItem>
            <SelectItem value="Moyen">Moyen</SelectItem>
            <SelectItem value="Difficile">Difficile</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={prepTime}
          onValueChange={(value) => updateFilters({ prepTime: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Temps de préparation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les temps</SelectItem>
            {timeRanges.map((range) => (
              <SelectItem key={range.value} value={range.value}>
                {range.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={ingredientsCount}
          onValueChange={(value) => updateFilters({ ingredientsCount: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Nombre d'ingrédients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="1-5">1-5 ingrédients</SelectItem>
            <SelectItem value="6-10">6-10 ingrédients</SelectItem>
            <SelectItem value="10+">Plus de 10</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Indicateur de filtres actifs */}
      {(activeFiltersCount > 0 || search.trim() !== '') && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
          </Badge>
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Réinitialiser les filtres
          </Button>
        </div>
      )}
    </div>
  );
};