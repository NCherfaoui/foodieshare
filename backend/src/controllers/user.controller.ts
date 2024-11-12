// src/controllers/user.controller.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import mongoose from 'mongoose';
import { Recipe } from '../models/Recipe';


export const userController = {
  // Inscription
  /**
   * Inscrit un nouvel utilisateur.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ 
        $or: [{ email }, { username }] 
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          message: "Email ou nom d'utilisateur déjà utilisé" 
        });
      }

      const user = new User({ username, email, password });
      await user.save();

      const token = jwt.sign(
        { id: user._id }, 
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      res.status(201).json({ token, user: { 
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }});
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de l'inscription", error });
    }
  },

  // Connexion
  /**
   * Connecte un utilisateur.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await user.comparePassword(password))) {
        return res.status(401).json({ 
          message: "Email ou mot de passe incorrect" 
        });
      }

      const token = jwt.sign(
        { id: user._id }, 
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      res.json({ token, user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }});
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la connexion", error });
    }
  },

  // Obtenir le profil
  /**
   * Récupère le profil d'un utilisateur par son ID.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  async getProfile(req: Request, res: Response) {
    try {
      const userId = req.params.id;      
      const user = await User.findById(userId)
        .select('-password')
        .populate('recipes')
        .populate('favorites');
console.log(user);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Utilisateur non trouvé"
        });
      }

      res.json({
        success: true,
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          recipes: user.recipes,
          favorites: user.favorites
        }
      });

    } catch (error) {
      console.error('Erreur profil:', error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de la récupération du profil"
      });
    }
  },
  // Mettre à jour le profil
  /**
   * Met à jour le profil de l'utilisateur.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  async updateProfile(req: Request, res: Response) {
    try {
      const updates = {
        username: req.body.username,
        email: req.body.email
      };

      const user = await User.findByIdAndUpdate(
        req.user.id,
        updates,
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de la mise à jour du profil", error });
    }
  },
 
  /**
   * Récupère un utilisateur par son ID.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
    async getUserById(req: Request, res: Response) {
      try {
        const user = await User.findById(req.params.id)
          .select('-password') // Exclure le mot de passe
          .populate('recipes', 'title description') // Inclure les recettes
          .populate('favorites', 'title description'); // Inclure les favoris
  
        if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
  
        res.json(user);
      } catch (error) {
        res.status(500).json({ 
          message: "Erreur lors de la récupération de l'utilisateur" 
        });
      }
    },
  
    /**
     * Supprime un utilisateur.
     * @param req - La requête HTTP.
     * @param res - La réponse HTTP.
     */
    async deleteUser(req: Request, res: Response) {
      try {
        // Vérifier si l'utilisateur est admin ou supprime son propre compte
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
          return res.status(403).json({ 
            message: "Non autorisé à supprimer cet utilisateur" 
          });
        }
  
        const user = await User.findById(req.params.id);
        if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
  
        // Supprimer les recettes de l'utilisateur
        await Recipe.deleteMany({ author: user._id });
  
        // Supprimer l'utilisateur
        await User.findByIdAndDelete(req.params.id);
  
        res.json({ message: "Compte utilisateur supprimé avec succès" });
      } catch (error) {
        res.status(500).json({ 
          message: "Erreur lors de la suppression du compte" 
        });
      }
    },

  // Ajouter/Retirer des favoris
  /**
   * Ajoute ou retire une recette des favoris.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  async toggleFavorite(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      const recipeId = new mongoose.Types.ObjectId(req.params.recipeId);
      const isFavorite = user.favorites.includes(recipeId);


      if (isFavorite) {
        await User.findByIdAndUpdate(req.user.id, {
          $pull: { favorites: recipeId }
        });
      } else {
        await User.findByIdAndUpdate(req.user.id, {
          $push: { favorites: recipeId }
        });
      }

      res.json({ message: isFavorite ? "Retiré des favoris" : "Ajouté aux favoris" });
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de la modification des favoris", error });
    }
  }
};