import * as Sentry from '@sentry/node';
import logger from './logger';

export const initSentry = () => {
  if (!process.env.SENTRY_DSN) {
    logger.warn('SENTRY_DSN non trouvé dans les variables d\'environnement');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
    ],
    environment: process.env.NODE_ENV,
    tracesSampleRate: 1.0,
    profilesSampleRate: 1.0,
  });

  logger.info('Sentry initialisé');
};