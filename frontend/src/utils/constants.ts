// src/utils/constants.ts
export const ROUTES = {
  HOME: '/',
  RECIPES: '/recipes',
  RECIPE_DETAIL: '/recipes/:id',
  CREATE_RECIPE: '/recipes/create',
  EDIT_RECIPE: '/recipes/:id/edit',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register'
};

export const API_ENDPOINTS = {
  RECIPES: '/recipes',
  COMMENTS: '/comments',
  USERS: '/users',
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout'
  }
};