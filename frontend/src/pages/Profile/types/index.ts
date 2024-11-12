export interface Recipe {
  _id: string;
  title: string;
  description: string;
}

export interface UserProfile {
  username: string;
  email: string;
  recipes: Recipe[];
  favorites: Recipe[];
}

export interface ProfilePageProps {
  userId: string;
}