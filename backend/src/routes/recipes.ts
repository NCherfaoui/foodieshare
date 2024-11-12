import express from 'express';
import { auth } from '../middleware/auth';
import { optionalAuth } from '../middleware/optionalAuth';
import { recipeController } from '../controllers/recipe.controller';
import { cacheMiddleware, clearCache, cachingStrategies } from '../middleware/redis.middleware';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Recipe:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - ingredients
 *         - steps
 *       properties:
 *         _id:
 *           type: string
 *           description: ID auto-généré de la recette
 *         title:
 *           type: string
 *           description: Titre de la recette
 *         description:
 *           type: string
 *           description: Description de la recette
 *         ingredients:
 *           type: array
 *           items:
 *             type: string
 *         steps:
 *           type: array
 *           items:
 *             type: string
 *         author:
 *           type: string
 *           description: ID de l'auteur
 *         difficulty:
 *           type: string
 *           enum: [Facile, Moyen, Difficile]
 */

/**
 * @swagger
 * /api/recipes:
 *   get:
 *     summary: Récupère toutes les recettes
 *     tags: [Recipes]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrer par catégorie
 *     responses:
 *       200:
 *         description: Liste des recettes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 *   post:
 *     summary: Crée une nouvelle recette
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       201:
 *         description: Recette créée avec succès
 *       401:
 *         description: Non autorisé
 */

/**
 * @swagger
 * /api/recipes/{id}:
 *   get:
 *     summary: Récupère une recette par son ID
 *     tags: [Recipes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la recette
 *     responses:
 *       200:
 *         description: Détails de la recette
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Recipe'
 *       404:
 *         description: Recette non trouvée
 *   put:
 *     summary: Modifie une recette
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Recipe'
 *     responses:
 *       200:
 *         description: Recette mise à jour
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Recette non trouvée
 *   delete:
 *     summary: Supprime une recette
 *     tags: [Recipes]
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
 *         description: Recette supprimée
 *       401:
 *         description: Non autorisé
 *       404:
 *         description: Recette non trouvée
 */

/**
 * @swagger
 * /api/recipes/{id}/rate:
 *   post:
 *     summary: Note une recette
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - score
 *             properties:
 *               score:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Note ajoutée avec succès
 *       401:
 *         description: Non autorisé
 */

/**
 * @swagger
 * /api/recipes/{id}/favorite:
 *   post:
 *     summary: Ajoute/retire une recette des favoris
 *     tags: [Recipes]
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
 *         description: Favoris mis à jour
 */


/**
 * @swagger
 * /api/recipes/popular:
 *   get:
 *     summary: Récupère les recettes les plus populaires
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Liste des recettes populaires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
*/

/**
 * @swagger
 * /api/recipes/{id}/comments:
 *   post:
 *     summary: Ajouter un commentaire à une recette
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Ceci est un commentaire"
 *     responses:
 *       200:
 *         description: Commentaire ajouté avec succès
 *       400:
 *         description: Contenu du commentaire manquant
 *       404:
 *         description: Recette non trouvée
 *       500:
 *         description: Erreur serveur
*/

/**
 * @swagger
 * /api/recipes/popular:
 *   get:
 *     summary: Récupère les recettes les plus populaires
 *     tags: [Recipes]
 *     responses:
 *       200:
 *         description: Liste des recettes populaires
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Recipe'
 */
router.get('/popular',
  cacheMiddleware(cachingStrategies.medium),
  recipeController.getPopularRecipes
);

/**
 * @swagger
 * /api/recipes/{id}/favorite:
 *   post:
 *     summary: Ajoute ou retire une recette des favoris
 *     tags: [Recipes]
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
 *         description: Favoris mis à jour
 *       404:
 *         description: Recette non trouvée
 */
router.post('/:id/favorite', auth, recipeController.toggleFavorite);

/**
 * @swagger
 * /api/recipes/{id}/comments:
 *   post:
 *     summary: Ajoute un commentaire à une recette
 *     tags: [Recipes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *                 example: "Ceci est un commentaire"
 *     responses:
 *       200:
 *         description: Commentaire ajouté avec succès
 *       400:
 *         description: Contenu du commentaire manquant
 *       404:
 *         description: Recette non trouvée
 */
router.post('/:id/comments', auth, recipeController.addComment);

// Routes spécifiques d'abord
router.get('/popular', recipeController.getPopularRecipes);

// Routes avec paramètres ensuite
router.post('/:id/favorite', auth, recipeController.toggleFavorite);
router.post('/:id/rate', auth, recipeController.rateRecipe);
router.post('/:id/comments', auth, recipeController.addComment); // Changé de comments à comment

// Routes CRUD standard
router.get('/:id', optionalAuth, recipeController.getRecipeById);
router.put('/:id', auth, recipeController.updateRecipe);
router.delete('/:id', auth, recipeController.deleteRecipe);

// Routes générales en dernier
router.get('/', 
    cacheMiddleware(cachingStrategies.medium), 
    recipeController.getAllRecipes
);

router.post('/', auth, async (req, res) => {
    await recipeController.createRecipe(req, res);
    await clearCache('recipes');
});

export default router;