import { Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit';

const rateLimitMiddleware = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'Too many requests, please try again in a few minutes.',
        status: 429,
        timestamp: new Date().toISOString(),
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req: Request, res: Response) => {
        return req.method === 'OPTIONS';
    }
});

export default rateLimitMiddleware;