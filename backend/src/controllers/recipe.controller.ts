import { Request, Response, NextFunction } from "express";
import { Recipe } from "../models/Recipe";
import { ObjectId } from "mongodb";
import { User } from "../models/User";
import mongoose from "mongoose";
import { AppError } from "../middleware/errorHandler";

interface QueryParams {
  search?: string;
  category?: string;
  difficulty?: string;
  minPreparationTime?: string;
  maxPreparationTime?: string;
  minIngredients?: string;
  maxIngredients?: string;
  page?: string;
  limit?: string;
  cursor?: string;
}

export const recipeController = {
  /**
   * Récupère toutes les recettes avec des filtres et pagination.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   * @param next - Le middleware suivant.
   */
  async getAllRecipes(
    req: Request<{}, {}, {}, QueryParams>,
    res: Response,
    next: NextFunction
  ) {


    try {
      const {
        search,
        category,
        difficulty,
        minPreparationTime,
        maxPreparationTime,
        minIngredients,
        maxIngredients,
      } = req.query;

      const limit = parseInt(req.query.limit || "12");
      const cursor = req.query.cursor;

      let query: any = {};

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      if (category) query.category = category;
      if (difficulty) query.difficulty = difficulty;

      if (minPreparationTime || maxPreparationTime) {
        query.preparationTime = {};
        if (minPreparationTime)
          query.preparationTime.$gte = parseInt(minPreparationTime);
        if (maxPreparationTime)
          query.preparationTime.$lte = parseInt(maxPreparationTime);
      }

      if (minIngredients || maxIngredients) {
        query.$expr = {
          $and: [],
        };

        if (minIngredients) {
          query.$expr.$and.push({
            $gte: [
              { $size: "$ingredients" },
              parseInt(minIngredients as string),
            ],
          });
        }

        if (maxIngredients) {
          query.$expr.$and.push({
            $lte: [
              { $size: "$ingredients" },
              parseInt(maxIngredients as string),
            ],
          });
        }
      }

      if (cursor) {
        query._id = { $gt: cursor };
      }

      const recipes = await Recipe.find(query)
        .sort({ _id: 1 })
        .limit(limit + 1);

      let nextCursor = null;
      if (recipes.length > limit) {
        nextCursor = recipes[recipes.length - 1]._id;
        recipes.pop();
      }

      res.json({
        recipes,
        nextCursor,
      });
    } catch (error) {
      next(new AppError("Erreur lors de la récupération des recettes", 500));
    }
  },

  /**
   * Crée une nouvelle recette.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  async createRecipe(req: Request, res: Response) {
    try {
      const recipe = new Recipe({
        ...req.body,
        author: new ObjectId(req.user.id),
      });

      await recipe.save();
      // Ajouter la recette à l'utilisateur
      await User.findByIdAndUpdate(req.user.id, {
        $push: { recipes: recipe._id },
      });
      res.status(201).json(recipe);
    } catch (error) {
      res
        .status(400)
        .json({ message: "Erreur lors de la création de la recette" });
    }
  },

  /**
   * Récupère une recette par son ID.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  async getRecipeById(req: Request<{ id: string }>, res: Response) {
    try {
      const recipe = await Recipe.findById(req.params.id)
        .populate("author", "username")
        .populate("comments.user", "username");

      if (!recipe) {
        return res.status(404).json({ message: "Recette non trouvée" });
      }

      // Créer un objet pour la réponse
      const recipeObj = recipe.toObject();

      // Initialiser isFavorited par défaut à false
      recipeObj.isFavorited = false;

      // Vérifier si l'utilisateur est authentifié et si la recette est dans ses favoris
     
      if (req.user) {
        const user = await User.findById(req.user.id);
        if (user) {
          // Convertir en string pour la comparaison
          recipeObj.isFavorited = user.favorites.some(
            (favId) => favId.toString() === recipe.id.toString()
          );
        }
      }

      res.json(recipeObj);
    } catch (error) {
      console.error("Erreur récupération recette:", error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération de la recette" });
    }
  },

  /**
   * Met à jour une recette existante.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  async updateRecipe(req: Request<{ id: string }>, res: Response) {
    try {
      const recipe = await Recipe.findOneAndUpdate(
        {
          _id: req.params.id,
          author: req.user.id,
        },
        req.body,
        { new: true }
      );

      if (!recipe) {
        return res
          .status(404)
          .json({ message: "Recette non trouvée ou non autorisée" });
      }

      res.json(recipe);
    } catch (error) {
      res.status(400).json({ message: "Erreur lors de la mise à jour" });
    }
  },

  /**
   * Supprime une recette.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  async deleteRecipe(req: Request<{ id: string }>, res: Response) {
    try {
      const recipe = await Recipe.findOneAndDelete({
        _id: req.params.id,
        author: req.user.id,
      });

      if (!recipe) {
        return res
          .status(404)
          .json({ message: "Recette non trouvée ou non autorisée" });
      }

      res.json({ message: "Recette supprimée avec succès" });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de la suppression" });
    }
  },

  /**
   * Note une recette.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  async rateRecipe(req: Request<{ id: string }>, res: Response) {
    try {
      const { score } = req.body;
      const userId = new mongoose.Types.ObjectId(req.user.id);

      if (!score || score < 1 || score > 5) {
        return res.status(400).json({
          message: "La note doit être comprise entre 1 et 5",
        });
      }

      // Vérifier si l'utilisateur a déjà noté
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: "Recette non trouvée" });
      }

      const existingRating = recipe.ratings.find(
        (r) => r.user.toString() === userId.toString()
      );

      if (existingRating) {
        // Mettre à jour la note existante
        await Recipe.updateOne(
          {
            _id: req.params.id,
            "ratings.user": userId,
          },
          {
            $set: {
              "ratings.$.score": score,
              "ratings.$.date": new Date(),
            },
          }
        );
      } else {
        // Ajouter une nouvelle note
        await Recipe.findByIdAndUpdate(req.params.id, {
          $push: {
            ratings: {
              user: userId,
              score,
              date: new Date(),
            },
          },
        });
      }

      const updatedRecipe = await Recipe.findById(req.params.id).populate(
        "ratings.user",
        "username"
      );

      res.json(updatedRecipe);
    } catch (error) {
      console.error("Erreur notation:", error);
      res.status(500).json({ message: "Erreur lors de la notation" });
    }
  },

  /**
   * Ajoute ou retire une recette des favoris.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  async toggleFavorite(req: Request, res: Response) {
    try {
      const user = await User.findById(req.user.id);
      const recipeId = new mongoose.Types.ObjectId(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "Utilisateur non trouvé",
        });
      }

      const isFavorited = user.favorites.includes(recipeId);

      if (isFavorited) {
        await User.findByIdAndUpdate(req.user.id, {
          $pull: { favorites: recipeId },
        });
      } else {
        await User.findByIdAndUpdate(req.user.id, {
          $addToSet: { favorites: recipeId },
        });
      }

      const recipe = await Recipe.findById(recipeId);

      res.json({
        success: true,
        isFavorited: !isFavorited,
        recipe,
      });
    } catch (error) {
      res.status(500).json({
        message: "Erreur lors de la modification des favoris",
      });
    }
  },

  /**
   * Récupère les recettes populaires.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  async getPopularRecipes(req: Request, res: Response) {
    try {
      const recipes = await Recipe.aggregate([
        // Ajouter un champ calculé pour le score moyen
        {
          $addFields: {
            averageRating: {
              $avg: "$ratings.score",
            },
            ratingCount: {
              $size: "$ratings",
            },
          },
        },
        // Trier par note moyenne et nombre de notes
        {
          $sort: {
            averageRating: -1,
            ratingCount: -1,
          },
        },
        // Limiter à 6 recettes
        { $limit: 6 },
        // Peupler les données de l'auteur
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
          },
        },
        { $unwind: "$author" },
        // Projeter les champs nécessaires
        {
          $project: {
            title: 1,
            description: 1,
            imageUrl: 1,
            difficulty: 1,
            preparationTime: 1,
            averageRating: 1,
            "author.username": 1,
          },
        },
      ]);

      res.json(recipes);
    } catch (error) {
      console.error("Erreur récupération recettes populaires:", error);
      res.status(500).json({
        message: "Erreur lors de la récupération des recettes populaires",
      });
    }
  },

  /**
   * Ajoute un commentaire à une recette.
   * @param req - La requête HTTP.
   * @param res - La réponse HTTP.
   */
  async addComment(req: Request<{ id: string }>, res: Response) {
    try {
      const { content } = req.body;
      const userId = new mongoose.Types.ObjectId(req.user.id);

      if (!content) {
        return res
          .status(400)
          .json({ message: "Le contenu du commentaire est requis" });
      }

      const recipe = await Recipe.findById(req.params.id);

      if (!recipe) {
        return res.status(404).json({ message: "Recette non trouvée" });
      }

      const comment = {
        user: userId,
        content,
        createdAt: new Date(),
      };

      recipe.comments.push(comment);
      await recipe.save();

      // Peupler les informations de l'utilisateur
      await recipe.populate("comments.user", "username");

      res.json(recipe);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de l'ajout du commentaire" });
    }
  },
};
