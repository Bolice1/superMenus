import app from './app';
import { connectDB } from './config/db.config';
import { env } from './config/env.confing';

connectDB();

app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});