import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROUTES } from "@/utils/constants";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

// Pages
import {
  HomePage,
  ProfilePage,
  LoginPage,
  RegisterPage,
  RecipeListPage,
  RecipeDetailPage,
  CreateRecipePage,
  EditRecipePage
} from '@/pages';

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Routes publiques */}
      <Route path={ROUTES.HOME} element={<HomePage />} /> {/* / */}
      <Route path={ROUTES.RECIPES} element={<RecipeListPage />} /> {/* /recipes */}
      <Route path={ROUTES.RECIPE_DETAIL} element={<RecipeDetailPage />} /> {/* /recipes/:id */}
      
      {/* Routes authentification - Accessibles uniquement si NON connecté */}
      <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} /> {/* /login */}
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} /> {/* /register */}
      </Route>

      {/* Routes protégées - Accessibles uniquement si connecté */}
      <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
        <Route path={ROUTES.CREATE_RECIPE} element={<CreateRecipePage />} /> {/* /recipes/create */}
        <Route path={ROUTES.PROFILE} element={<ProfilePage />} /> {/* /profile */}
        <Route path={`${ROUTES.RECIPES}/:id/edit`} element={<EditRecipePage />} /> {/* /recipes/:id/edit */}
      </Route>

      {/* Route 404 - Redirection vers l'accueil */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
};