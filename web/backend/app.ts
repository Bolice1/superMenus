import express from 'express';
import routes from './routes';
import corsMiddleware from './middleware/cors.middleware';
import rateLimitMiddleware from './middleware/rate_limit.middleware';

const app = express();

app.use(corsMiddleware);
app.use(rateLimitMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ msg: 'Route not found' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ 
    msg: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

export default app;