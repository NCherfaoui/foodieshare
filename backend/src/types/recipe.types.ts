import { Document, Types } from 'mongoose';

export interface IComment {
  user: Types.ObjectId;
  content: string;
  date: Date;
}

export interface IRecipe extends Document {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  author: Types.ObjectId;
  category: string;
  preparationTime: number;
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  ratings: {
    user: Types.ObjectId;
    score: number;
  }[];
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

