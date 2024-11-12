import { Request, Response, NextFunction } from 'express';
import { httpRequestDurationSeconds } from '../config/metrics';
import logger from '../config/logger';

export const requestMonitoring = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Logging initial de la requête
  logger.info('Request started', {
    method: req.method,
    path: req.path,
    query: req.query,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });

  // Capture de la réponse
  res.on('finish', () => {
    const duration = Date.now() - start;
    const route = req.route?.path || req.path;
    const statusCode = res.statusCode.toString();

    // Metrics
    httpRequestDurationSeconds
      .labels(req.method, route, statusCode)
      .observe(duration / 1000);

    // Logging
    logger.info('Request completed', {
      method: req.method,
      path: route,
      statusCode,
      duration,
      userAgent: req.get('user-agent')
    });
  });

  next();
};