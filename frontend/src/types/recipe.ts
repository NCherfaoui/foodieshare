export interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  author: string;
  createdAt: Date;
  comments: Comment[];
  updatedAt?: Date;
  imageUrl?: string;
  categories?: string[];
  difficulty?: string;
  preparationTime?: number;
  isFavorited?: boolean;
  averageRating?: number;
  score?: number;
  ratings?: {
    user: string;
    score: number;
  }[];
}

export interface Comment {
  _id: string;
  user: string;
  message: string;
  date: Date;
}



