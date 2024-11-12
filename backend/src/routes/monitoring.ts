import express from 'express';
import { register } from '../config/metrics';
import logger from '../config/logger';
import { auth, checkRole } from '../middleware/auth';
import mongoose from 'mongoose';
import redisService from '../config/redis';

const router = express.Router();

// Métriques Prometheus (protégées par auth admin)
router.get('/metrics', auth, checkRole(['admin']), async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    logger.error('Erreur métriques Prometheus:', err);
    res.status(500).end();
  }
});

/**
 * @swagger
 * /monitoring/status:
 *   get:
 *     summary: Obtient le statut détaillé du système
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statut détaillé du système
 *       401:
 *         description: Non autorisé
 *       403:
 *         description: Accès refusé - Rôle admin requis
 */
router.get('/status', auth, checkRole(['admin']), async (req, res) => {
  try {
    const status = {
      uptime: process.uptime(),
      timestamp: Date.now(),
      redis: {
        connected: redisService.isConnected(),
      },
      mongodb: {
        connected: mongoose.connection.readyState === 1,
      },
      memory: {
        usage: process.memoryUsage(),
        free: process.memoryUsage().heapTotal - process.memoryUsage().heapUsed,
      }
    };
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la vérification du statut' });
  }
});

/**
 * @swagger
 * /monitoring/health:
 *   get:
 *     summary: Vérifie l'état de santé de l'API
 *     tags: [Monitoring]
 *     responses:
 *       200:
 *         description: L'API est opérationnelle
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "OK"
 */
router.get('/health', async (req, res) => {
  res.json({ status: 'OK' });
});

export default router;