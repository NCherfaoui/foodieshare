import "./config/env";
import "./config/instrument";  // Premier import obligatoire
import * as Sentry from "@sentry/node";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import swaggerUi from "swagger-ui-express";
import { specs } from "./config/swagger";
import { connectDB } from "./config/database";
import recipeRoutes from "./routes/recipes";
import userRoutes from "./routes/users";
import authRoutes from "./routes/auth";
import { errorHandler } from "./middleware/error";
import redisService from "./config/redis";

import { requestMonitoring } from "./middleware/monitoring";
import monitoringRoutes from "./routes/monitoring";
import logger from "./config/logger";
import { userRateLimiter } from './middleware/rateLimit';
import compression from 'compression';

// Configuration
const app = express();
const PORT = process.env.PORT || 3000;

// Handler de requêtes de Sentry
app.use(compression());

// Middlewares de sécurité
app.use(helmet());
app.use(mongoSanitize());
app.use(hpp());

// Limitation du taux de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par windowMs
});
app.use('/api/', limiter);

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware pour parser le JSON
app.use(express.json());

// Connexion à MongoDB
connectDB();

// Initialiser la connexion Redis
redisService.initialize()
  .then(() => logger.info('Redis initialisé'))
  .catch(err => logger.error('Erreur initialisation Redis:', err));

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', userRoutes);
app.use('/api', authRoutes);

// Routes de monitoring et test Sentry
app.get('/debug-sentry', (req, res) => {
  throw new Error("Test Sentry Error!");
});

app.use('/monitoring', monitoringRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Route de test
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API FoodieShare' });
});

// Gestionnaire d'erreurs Sentry (après les routes, avant les autres gestionnaires d'erreurs)
Sentry.setupExpressErrorHandler(app);

// Gestionnaire d'erreurs personnalisé
app.use(function onError(err: Error, req: Request, res: Response, next: NextFunction) {
  res.statusCode = 500;
});

// Démarrer le serveur uniquement si non en test
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    logger.info(`Serveur démarré sur le port ${PORT}`);
  });
}

// Gestion des erreurs non capturées
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
  Sentry.captureException(err);
});

process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err);
  Sentry.captureException(err);
  process.exit(1);
});

export default app;