import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

export const authController = {
    // backend/src/controllers/auth.controller.ts
  
  /**
   * Inscrit un nouvel utilisateur.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  async register(req: Request, res: Response) {
    try {
      const { username, email, password } = req.body;
      
      // Validation des champs
      if (!username || !email || !password) {
        return res.status(400).json({ 
          success: false,
          message: "Tous les champs sont requis" 
        });
      }
  
      // Vérification utilisateur existant
      const existingUser = await User.findOne({ 
        $or: [{ email: email.toLowerCase() }, { username }] 
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          success: false,
          message: "Email ou nom d'utilisateur déjà utilisé" 
        });
      }
  
      // Création de l'utilisateur
      const user = new User({
        username,
        email: email.toLowerCase(),
        password
      });
  
      await user.save();
  
      // Génération du token
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );
  
      res.status(201).json({
        success: true,
        data: {
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        }
      });
  
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      res.status(500).json({
        success: false,
        message: "Erreur lors de l'inscription",
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  /**
   * Connecte un utilisateur.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis" });
      }

      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Email ou mot de passe incorrect" });
      }

      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la connexion" });
    }
  }
};
