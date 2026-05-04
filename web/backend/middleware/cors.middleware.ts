import { Request, Response, NextFunction } from 'express';
import { cors } from 'cors';
import { env } from '../config/env.confing';

const corsMiddleware = cors({
    origin: env.TRUSTED_DOMAINS,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});

export default corsMiddleware;
