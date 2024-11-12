
// Export des pages principales
export { default as HomePage } from './Home';
export { default as ProfilePage } from './Profile';
export { default as LoginPage } from './Auth/pages/Login';
export { default as RegisterPage } from './Auth/pages/Register';
// Export des sous-pages Recipe
export { 
  RecipeListPage,
  RecipeDetailPage, 
  CreateRecipePage,
  EditRecipePage
} from './Recipe/pages';

// Types partagés (optionnel)
export type { 
  HomePageProps,
  ProfilePageProps,
  RecipeFormData 
} from './types';