import { createClient, RedisClientType } from 'redis';

export class RedisService {
    private client: RedisClientType;
    private static instance: RedisService;

    private constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL
        });

        this.client.on('error', (err) => console.error('Redis Client Error:', err));
    }

    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    // Ajouter la méthode initialize
    public async initialize(): Promise<void> {
        try {
            await this.client.connect();
            console.log('Redis client connected');
        } catch (error) {
            console.error('Redis connection error:', error);
            throw error;
        }
    }

    public async set(key: string, value: string, ttl?: number): Promise<void> {
        try {
            if (ttl) {
                await this.client.setEx(key, ttl, value);
            } else {
                await this.client.set(key, value);
            }
        } catch (error) {
            console.error('Redis set error:', error);
            throw error;
        }
    }

    public async get(key: string): Promise<string | null> {
        try {
            return await this.client.get(key);
        } catch (error) {
            console.error('Redis get error:', error);
            throw error;
        }
    }

    public async del(key: string): Promise<void> {
        try {
            await this.client.del(key);
        } catch (error) {
            console.error('Redis del error:', error);
            throw error;
        }
    }

    public async clearPattern(pattern: string): Promise<void> {
        try {
            let cursor = 0;
            do {
                const result = await this.client.scan(cursor, {
                    MATCH: pattern,
                    COUNT: 100
                });
                cursor = result.cursor;

                if (result.keys.length > 0) {
                    await this.client.del(result.keys);
                }
            } while (cursor !== 0);
        } catch (error) {
            console.error('Redis clearPattern error:', error);
            throw error;
        }
    }

    public async quit(): Promise<void> {
        try {
            await this.client.quit();
        } catch (error) {
            console.error('Redis quit error:', error);
            throw error;
        }
    }

    public isConnected(): boolean {
        return this.client?.isOpen || false;
    }
}

export default RedisService.getInstance();