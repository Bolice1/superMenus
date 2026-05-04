import { config } from 'dotenv';
import { email } from 'zod';

config();

export const env = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI as string,
    JWT_SECRET: process.env.JWT_SECRET as string,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN as string,
    TRUSTED_DOMAINS: process.env.TRUSTED_DOMAINS as string,
    EMAIL_USER: process.env.EMAIL_USER as string,
    EMAIL_PASS: process.env.EMAIL_PASS as string,
    EMAIL_SCURE: process.env.EMAIL_SECURE as string,
    EMAIL_SERVICE: process.env.EMAIL_SERVICE as string,
    EMAIL_PORT: process.env.EMAIL_PORT

};

// let us check  if all the environment variables are set
if (!env.MONGODB_URI) {
    throw new Error('MONGODB_URI is not set');
}
if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not set');
}
if (!env.JWT_EXPIRES_IN) {
    throw new Error('JWT_EXPIRES_IN is not set');
}
if (!env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not set');
}
if (!env.JWT_REFRESH_EXPIRES_IN) {
    throw new Error('JWT_REFRESH_EXPIRES_IN is not set');
}
if(!env.EMAIL_PASS||!env.EMAIL_USER){
    throw new Error('Some essential email variables are missing ');
}

