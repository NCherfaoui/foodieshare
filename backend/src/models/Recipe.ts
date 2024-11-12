import mongoose, { Document, Schema } from 'mongoose';

export interface RecipeDocument extends Document {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  author: mongoose.Types.ObjectId;
  category: string; 
  preparationTime: number;
  favorites: mongoose.Types.ObjectId[];
  difficulty: 'Facile' | 'Moyen' | 'Difficile';
  ratings: {
    user: mongoose.Types.ObjectId;
    score: number;
    date: Date;
  }[];
  comments: {
    user: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }[];
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  isFavorited?: boolean;
}

const recipeSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  ingredients: [String],
  steps: [String],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  category: { type: String, required: true },
  preparationTime: { type: Number, required: true },
  difficulty: { 
    type: String, 
    enum: ['Facile', 'Moyen', 'Difficile'], 
    required: true 
  },
  ratings: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    score: { type: Number, min: 1, max: 5 },
    date: { type: Date, default: Date.now }
  }],
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  image: { type: String }
}, {
  timestamps: true
});
export const Recipe = mongoose.model<RecipeDocument>('Recipe', recipeSchema);