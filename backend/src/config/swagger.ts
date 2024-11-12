// src/config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FoodieShare API',
      version: '1.0.0',
      description: 'API complète de partage de recettes',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur de développement',
      },
      {
        url: 'https://api.foodieshare.com',
        description: 'Serveur de production',
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        MonitoringHealth: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'OK' }
          }
        },
        MonitoringStatus: {
          type: 'object',
          properties: {
            uptime: { type: 'number', example: 3600 },
            timestamp: { type: 'number', example: 1677654321000 },
            redis: {
              type: 'object',
              properties: {
                connected: { type: 'boolean', example: true }
              }
            },
            mongodb: {
              type: 'object',
              properties: {
                connected: { type: 'boolean', example: true }
              }
            },
            memory: {
              type: 'object',
              properties: {
                usage: {
                  type: 'object',
                  properties: {
                    heapTotal: { type: 'number', example: 50000000 },
                    heapUsed: { type: 'number', example: 30000000 }
                  }
                },
                free: { type: 'number', example: 20000000 }
              }
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        Recipe: {
          type: 'object',
          required: ['title', 'ingredients', 'instructions'],
          properties: {
            title: {
              type: 'string',
              example: 'Pasta Carbonara'
            },
            description: {
              type: 'string',
              example: 'Délicieuse recette italienne traditionnelle'
            },
            ingredients: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    example: 'Spaghetti'
                  },
                  quantity: {
                    type: 'number',
                    example: 500
                  },
                  unit: {
                    type: 'string',
                    example: 'g'
                  }
                }
              }
            },
            instructions: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['Faire bouillir l\'eau', 'Cuire les pâtes']
            },
            cookingTime: {
              type: 'number',
              example: 30
            }
          }
        },
        User: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'user@example.com'
            },
            password: {
              type: 'string',
              format: 'password',
              example: '********'
            },
            role: {
              type: 'string',
              enum: ['user', 'admin'],
              example: 'user'
            }
          }
        },
        RecipeResponse: {
          type: 'object',
          properties: {
            data: {
              $ref: '#/components/schemas/Recipe'
            },
            message: {
              type: 'string',
              example: 'Recette récupérée avec succès'
            }
          }
        },
        RecipeListResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Recipe'
              }
            },
            pagination: {
              type: 'object',
              properties: {
                total: { type: 'number', example: 100 },
                page: { type: 'number', example: 1 },
                limit: { type: 'number', example: 10 }
              }
            }
          }
        }
      },
      parameters: {
        PageParam: {
          in: 'query',
          name: 'page',
          schema: {
            type: 'integer',
            default: 1
          },
          description: 'Numéro de page pour la pagination'
        },
        LimitParam: {
          in: 'query',
          name: 'limit',
          schema: {
            type: 'integer',
            default: 10
          },
          description: 'Nombre d\'éléments par page'
        }
      }
    },
    security: [{
      bearerAuth: []
    }],
    tags: [
      {
        name: 'Recipes',
        description: 'Opérations sur les recettes'
      },
      {
        name: 'Users',
        description: 'Opérations sur les utilisateurs'
      },
      {
        name: 'Auth',
        description: 'Authentification et autorisation'
      }
    ],
    paths: {
      '/monitoring/health': {
        get: {
          tags: ['Monitoring'],
          summary: 'Vérifie l\'état de santé de l\'API',
          responses: {
            '200': {
              description: 'État de santé de l\'API',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/MonitoringHealth' }
                }
              }
            }
          }
        }
      },
      '/monitoring/status': {
        get: {
          tags: ['Monitoring'],
          summary: 'Obtient le statut détaillé du système',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Statut détaillé du système',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/MonitoringStatus' }
                }
              }
            },
            '401': {
              description: 'Non autorisé',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            },
            '403': {
              description: 'Accès refusé - Rôle admin requis',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Error' }
                }
              }
            }
          }
        }
      },
      '/monitoring/metrics': {
        get: {
          tags: ['Monitoring'],
          summary: 'Récupère les métriques Prometheus',
          security: [{ bearerAuth: [] }],
          responses: {
            '200': {
              description: 'Métriques au format Prometheus',
              content: {
                'text/plain': {
                  schema: {
                    type: 'string'
                  }
                }
              }
            },
            '401': {
              description: 'Non autorisé'
            },
            '403': {
              description: 'Accès refusé - Rôle admin requis'
            }
          }
        }
      },
      "/debug-sentry": {
        get: {
          tags: ["Monitoring"],
          summary: "Déclenche une erreur test pour Sentry",
          description: "Cette route est utilisée pour tester l'intégration Sentry",
          responses: {
            500: {
              description: "Erreur test générée avec succès"
            }
          }
        }
      },
      '/api/recipes': {
        get: {
          tags: ['Recipes'],
          summary: 'Liste des recettes',
          description: 'Récupère la liste paginée des recettes',
          parameters: [
            { $ref: '#/components/parameters/PageParam' },
            { $ref: '#/components/parameters/LimitParam' }
          ],
          responses: {
            '200': {
              description: 'Liste des recettes récupérée avec succès',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/RecipeListResponse'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'],  // Mise à jour du chemin
};

export const specs = swaggerJsdoc(options);