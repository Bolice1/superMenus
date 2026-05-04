import nodemailer from 'nodemailer'
// we are going to send emails to the users  of the system in case{welcome,request payment...}

import { env } from '../config/env.confing'

const transporter = nodemailer.createTransport({

    host: env.EMAIL_SERVICE,
    port: env.EMAIL_PORT,
    secure: env.EMAIL_SCURE,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS
    }
});


// LET US SEND NOTIFICATIONS  IN CASE PAYMENT IS UP 

export const sendNotifications = await(to,)=>{

};