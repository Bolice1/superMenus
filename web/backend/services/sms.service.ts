import twilio from 'twilio';
import { env } from '../config/env.confing';
import { any } from 'zod';

const client = twilio(env.TWILIO_ACOUNT_SID,env.TWILIO_OAUTH_TOKEN,env.TWILIO_PHONE_NUMBER)