import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import NewRecipe from "./pages/NewRecipe";
import RecipeDetail from "./pages/RecipeDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { Header } from "./components/Header";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Profile from "./pages/Profile";
import React from "react";
import Index from "./pages/Home";
import { CreateRecipePage, RecipeDetailPage } from "./pages";
import { AppRoutes } from "./routes/AppRoutes";

const queryClient = new QueryClient();

const ProfileWithAuth = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Chargement...</div>;
  }

  return <Profile userId={user.id} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <div
              role="main"
              className="min-h-screen bg-background text-foreground dark:bg-slate-900"
            >
              <Header />
              <AppRoutes />
            </div>
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
