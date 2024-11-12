import rateLimit from 'express-rate-limit';
export const userRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: 100, // Limite à 100 requêtes
  message: "Trop de requêtes, veuillez réessayer plus tard.",
});
