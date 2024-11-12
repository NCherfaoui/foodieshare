import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface JwtPayload {
  id: string;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Récupérer le token du header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    // Vérifier l'utilisateur
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    // Ajouter l'utilisateur à la requête
    req.user = {
      id: user._id.toString(),
      role: user.role
    };

    next();
  } catch (error) {
    console.error('Erreur auth:', error);
    res.status(401).json({ message: 'Token invalide' });
  }
};

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role;
    if (!userRole || !roles.includes(userRole)) {
      return res.status(403).json({ message: "Accès non autorisé" });
    }
    next();
  };
};