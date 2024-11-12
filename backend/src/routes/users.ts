import express from 'express';
import { auth } from '../middleware/auth';
import { userController } from '../controllers/user.controller';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *         username:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         recipes:
 *           type: array
 *           items:
 *             type: string
 *         favorites:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Récupère le profil de l'utilisateur connecté
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil utilisateur
 *       401:
 *         description: Non autorisé
 */
router.get('/:id/profile', auth, userController.getProfile);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id', auth, userController.getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Met à jour un profil utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour
 */
router.put('/:id', auth, userController.updateProfile);

/**
 * @swagger
 * /api/users/{id}/favorites/{recipeId}:
 *   post:
 *     summary: Ajoute/Retire une recette des favoris
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: recipeId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Favoris mis à jour
 */
router.post('/:id/favorites/:recipeId', auth, userController.toggleFavorite);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprime un compte utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Compte supprimé
 */
router.delete('/:id', auth, userController.deleteUser);

export default router;