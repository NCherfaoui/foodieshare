import mongoose from 'mongoose';
import { Recipe } from '../models/Recipe';
import { User } from '../models/User';
import bcrypt from 'bcryptjs';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodie-share';

const users = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'user1',
    email: 'user1@example.com',
    password: 'user123',
    role: 'user'
  }
];

const recipes = [
  {
    title: 'Spaghetti Carbonara',
    description: 'Une recette classique italienne',
    category: 'plat',
    difficulty: 'Moyen',
    preparationTime: 30,
    ingredients: [
      '400g de spaghetti',
      '200g de pancetta',
      '4 jaunes d\'œuf',
      '100g de parmesan',
      'Poivre noir'
    ],
    steps: [
      'Faire cuire les pâtes',
      'Faire revenir la pancetta',
      'Mélanger les jaunes d\'œuf et le parmesan',
      'Assembler le tout'
    ],
    imageUrl: 'https://example.com/carbonara.jpg'
  },
  {
    title: 'Salade César',
    description: 'Une salade fraîche et croquante',
    category: 'entree',
    difficulty: 'Facile',
    preparationTime: 15,
    ingredients: [
      'Laitue romaine',
      'Croûtons',
      'Parmesan',
      'Sauce César'
    ],
    steps: [
      'Laver et couper la salade',
      'Préparer la sauce',
      'Assembler tous les ingrédients'
    ],
    imageUrl: 'https://example.com/cesar.jpg'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Nettoyer la base de données
    await User.deleteMany({});
    await Recipe.deleteMany({});

    // Créer les utilisateurs
    const createdUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return User.create({
          ...user,
          password: hashedPassword
        });
      })
    );

    // Créer les recettes
    const recipesWithAuthors = recipes.map((recipe, index) => ({
      ...recipe,
      author: createdUsers[index % createdUsers.length]._id
    }));

    await Recipe.insertMany(recipesWithAuthors);

    console.log('Base de données initialisée avec succès !');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation :', error);
    process.exit(1);
  }
}

seed();
