// src/seed.ts
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from './models/User';
import { Recipe } from './models/Recipe';
import './config/env';

const initialRecipes = [
  {
    title: 'Ratatouille Provençale',
    description: 'Un plat végétarien traditionnel du sud de la France',
    ingredients: [
      'Aubergines', 'Courgettes', 'Poivrons', 'Tomates',
      'Oignons', "Huile d'olive", 'Ail', 'Herbes de Provence'
    ],
    steps: [
      'Couper tous les légumes en rondelles',
      'Faire revenir les oignons dans l\'huile d\'olive',
      'Ajouter l\'ail et les herbes',
      'Ajouter les légumes un par un',
      'Laisser mijoter à feu doux pendant 45 minutes'
    ],
    category: 'plat',
    difficulty: 'Facile',
    preparationTime: 60
  },
  {
    title: 'Tarte au Citron Meringuée',
    description: 'Un dessert classique français, à la fois acidulé et sucré',
    ingredients: [
      'Pâte sablée', 'Citrons', 'Oeufs', 'Sucre', 'Beurre', 'Maïzena'
    ],
    steps: [
      'Préparer la pâte sablée et la cuire à blanc',
      'Réaliser le lemon curd',
      'Préparer la meringue',
      'Assembler et faire dorer'
    ],
    category: 'dessert',
    difficulty: 'Moyen',
    preparationTime: 90
  },
  {
    title: 'Velouté de Potimarron',
    description: 'Une entrée réconfortante pour l\'automne',
    ingredients: [
      'Potimarron', 'Oignon', 'Crème fraîche', 'Bouillon de légumes', 'Noix de muscade'
    ],
    steps: [
      'Couper le potimarron en dés',
      'Faire revenir l\'oignon',
      'Cuire le potimarron dans le bouillon',
      'Mixer et ajouter la crème'
    ],
    category: 'entree',
    difficulty: 'Facile',
    preparationTime: 45
  },
  {
    title: 'Poulet Basquaise',
    description: 'Un plat traditionnel du Pays Basque, riche en saveurs.',
    ingredients: [
      'Poulet', 'Poivrons', 'Oignons', 'Tomates', 
      "Piment d'Espelette", 'Vin blanc'
    ],
    steps: [
      'Faire mariner le poulet',
      'Le saisir',
      'Ajouter les légumes',
      'Mijoter'
    ],
    category: 'plat',
    difficulty: 'Moyen',
    preparationTime: 90
  },
  {
    title: 'Boeuf Bourguignon',
    description: 'Un classique de la cuisine française, mijoté dans du vin rouge.',
    ingredients: [
      'Boeuf', 'Lardons', 'Carottes', 'Oignons',
      'Vin rouge', 'Bouillon de boeuf'
    ],
    steps: [
      'Faire revenir la viande',
      'Ajouter les légumes',
      'Déglacer au vin',
      'Mijoter'
    ],
    category: 'plat',
    difficulty: 'Difficile',
    preparationTime: 120
  },
  {
    title: 'Lasagnes',
    description: 'Un plat italien en couches, à base de pâtes, de viande et de béchamel.',
    ingredients: [
      'Pates à lasagnes', 'Viande hachée', 'Béchamel',
      'Tomates', 'Mozzarella'
    ],
    steps: [
      'Préparer la sauce à la viande',
      'Préparer la béchamel',
      'Assembler les lasagnes'
    ],
    category: 'plat',
    difficulty: 'Moyen',
    preparationTime: 120
  },
  {
    title: 'Salade César',
    description: 'Une salade fraîche et croquante, avec une sauce crémeuse.',
    ingredients: [
      'Romaine', 'Croûtons', 'Parmesan',
      'Poulet grillé', 'Sauce César'
    ],
    steps: [
      'Préparer la sauce',
      'Assembler la salade'
    ],
    category: 'entree',
    difficulty: 'Facile',
    preparationTime: 30
  },
  {
    title: "Soupe à l'oignon gratinée",
    description: 'Une soupe réconfortante, gratinée au fromage.',
    ingredients: [
      'Oignons', 'Bouillon de boeuf',
      'Pain', 'Fromage râpé'
    ],
    steps: [
      'Faire caraméliser les oignons',
      'Ajouter le bouillon',
      'Gratiner'
    ],
    category: 'entree',
    difficulty: 'Moyen',
    preparationTime: 60
  },
  {
    title: 'Mousse au chocolat',
    description: 'Un dessert léger et onctueux, à base de chocolat.',
    ingredients: [
      'Chocolat noir', 'Oeufs', 'Sucre'
    ],
    steps: [
      'Faire fondre le chocolat',
      'Monter les blancs en neige',
      'Assembler'
    ],
    category: 'dessert',
    difficulty: 'Facile',
    preparationTime: 30
  },
  {
    title: 'Crumble aux pommes',
    description: 'Un dessert fruité et réconfortant, avec une pâte sablée.',
    ingredients: [
      'Pommes', 'Farine', 'Beurre', 'Sucre', 'Épices'
    ],
    steps: [
      'Préparer la pâte',
      'Couper les pommes',
      'Assembler et cuire'
    ],
    category: 'dessert',
    difficulty: 'Facile',
    preparationTime: 45
  },
  {
    title: 'Tiramisu',
    description: 'Un dessert italien, à base de biscuits, de café et de mascarpone.',
    ingredients: [
      'Biscuits cuillère', 'Café', 'Mascarpone',
      'Oeufs', 'Cacao'
    ],
    steps: [
      'Tremper les biscuits',
      'Alterner avec la crème',
      'Saupoudrer de cacao'
    ],
    category: 'dessert',
    difficulty: 'Moyen',
    preparationTime: 60
  },
  {
    title: 'Pain maison',
    description: 'Un pain artisanal, avec la saveur du fait maison.',
    ingredients: [
      'Farine', 'Levure', 'Eau', 'Sel'
    ],
    steps: [
      'Pétrir la pâte',
      'Laisser lever',
      'Cuire'
    ],
    category: 'autre',
    difficulty: 'Moyen',
    preparationTime: 120
  },
  {
    title: 'Smoothie vert',
    description: 'Une boisson saine et rafraîchissante, à base de fruits et de légumes.',
    ingredients: [
      'Épinards', 'Banane', 'Avocat', 'Lait végétal'
    ],
    steps: [
      'Mixer tous les ingrédients'
    ],
    category: 'autre',
    difficulty: 'Facile',
    preparationTime: 5
  }
];

// Valider la présence de MONGODB_URI
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI non définie dans le fichier .env');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connecté à MongoDB');

    // Nettoyer la base de données
    await User.deleteMany({});
    await Recipe.deleteMany({});

    // Créer les utilisateurs
    const adminPassword = await bcrypt.hash('admin1234', 10);
    const userPassword = await bcrypt.hash('user1234', 10);

    const admin = await User.create({
      username: 'admin',
      email: 'admin@foodieshare.com',
      password: adminPassword,
      role: 'admin'
    });

    const regularUser = await User.create({
      username: 'user',
      email: 'user@foodieshare.com',
      password: userPassword,
      role: 'user'
    });

    // Créer les recettes avec commentaires
    const recipesWithData = initialRecipes.map((recipe, index) => ({
      ...recipe,
      author: index % 2 === 0 ? admin._id : regularUser._id,
      comments: [
        {
          user: index % 2 === 0 ? regularUser._id : admin._id,
          content: 'Superbe recette, merci pour le partage !',
          createdAt: new Date()
        }
      ],
      ratings: [
        {
          user: index % 2 === 0 ? regularUser._id : admin._id,
          score: 5,
          date: new Date()
        }
      ]
    }));

    await Recipe.insertMany(recipesWithData);

    console.log('Base de données initialisée avec succès');
    console.log('Credentials de test:');
    console.log('Admin - email: admin@foodieshare.com, password: admin1234');
    console.log('User - email: user@foodieshare.com, password: user1234');
    
    await mongoose.disconnect();

  } catch (error) {
    console.error('Erreur lors de l\'initialisation :', error);
    process.exit(1);
  }
};

// Exécuter le script
seedDatabase();