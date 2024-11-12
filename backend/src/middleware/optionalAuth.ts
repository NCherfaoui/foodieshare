// src/middleware/optionalAuth.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

interface JwtPayload {
  id: string;
}

export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next(); // Continuer sans authentification
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    const user = await User.findById(decoded.id);
    
    if (user) {
      req.user = {
        id: user._id.toString(),
        role: user.role
      };
    }

    next();
  } catch (error) {
    // En cas d'erreur de token, on continue sans authentification
    next();
  }
};