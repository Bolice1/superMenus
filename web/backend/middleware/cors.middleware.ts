import cors from 'cors';

const originsRaw =
    process.env.TRUSTED_DOMAINS ||
    'http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173';

const allowedOrigins = originsRaw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const corsMiddleware = cors({
    origin(origin:any, callback:any) {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});

export default corsMiddleware;
