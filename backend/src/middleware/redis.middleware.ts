import { Request, Response, NextFunction } from 'express';
import redisService from '../config/redis';

export const cacheMiddleware = (duration: number = 3600) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        if (process.env.NODE_ENV === 'development') {
            return next();
        }

        const key = `cache:${req.method}:${req.originalUrl}`;
        
        try {
            const cachedData = await redisService.get(key);
            if (cachedData) {
                return res.json(JSON.parse(cachedData));
            }

            const originalJson = res.json;
            res.json = function(data) {
                redisService.set(key, JSON.stringify(data), duration)
                    .catch(err => console.error('Cache storage error:', err));
                return originalJson.call(this, data);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            next();
        }
    };
};

export const clearCache = async (pattern: string): Promise<void> => {
    try {
        await redisService.clearPattern(`cache:*${pattern}*`);
    } catch (error) {
        console.error('Clear cache error:', error);
    }
};

export const cachingStrategies = {
    short: 300,    // 5 minutes
    medium: 1800,  // 30 minutes
    long: 3600,    // 1 heure
    day: 86400     // 24 heures
};
