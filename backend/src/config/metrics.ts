import client from 'prom-client';

const register = new client.Registry();

// Métriques par défaut
client.collectDefaultMetrics({ register });

// Métriques HTTP
export const httpRequestDurationSeconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Durée des requêtes HTTP',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

// Métriques métier
export const recipeCreationCounter = new client.Counter({
  name: 'recipes_created_total',
  help: 'Nombre total de recettes créées'
});

export const activeUsersGauge = new client.Gauge({
  name: 'active_users_total',
  help: 'Nombre d\'utilisateurs actifs'
});

export const recipesRatingCounter = new client.Counter({
  name: 'recipes_ratings_total',
  help: 'Nombre total de notations de recettes',
  labelNames: ['score']
});

// Enregistrement des métriques
register.registerMetric(httpRequestDurationSeconds);
register.registerMetric(recipeCreationCounter);
register.registerMetric(activeUsersGauge);
register.registerMetric(recipesRatingCounter);

export { register };