import { Message } from 'twilio/lib/twiml/MessagingResponse';
import { env } from '../config/env.confing';
import twilio from 'twilio';

const client = twilio(env.TWILIO_ACOUNT_SID, env.TWILIO_OAUTH_TOKEN);

export const sendWelcomeSms = async (to: string, from: string, restaurantName: string) => {
    const message = await client.messages.create({
        body: `Hello, we are pleased to have ${restaurantName} here\n at superMenus!`,
        to,
        from,
    });

    return message;
};


export const sendPaymentReminderNotifications = async (to: string, from: string, amount: string) => {
    const message = await client.messages.create({
        body: `🎗️Payment reminder \nHello we want to inform you that the payment time \n of ${amount}is approaching`,
        to,
        from,
    });

    return message;
}


export const sendNewOrderNotification = async (to: string, from: string, orderInfo: any, restaurantName: string) => {
    const message = await client.messages.create({
        body: `Dear ${restaurantName} \n you have recieved a new order the details are here\n
        ${orderInfo}`,
        to,
        from
    })
    return message;
}

export const sendWeeklyAnalytics = async (to: string, from: string, sendWeeklyAnalytics: any, restaurantName: string, restaurantAdmin: string) => {
    const message = await client.messages.create({
        body: `Dear ${restaurantAdmin} \n here are the weekly analytics of ${restaurantName}\n
    ${sendWeeklyAnalytics}`,
        to,
        from
    })
    return message;
}
export const sendClientFeedBacks = async (to: string, from: string, feedbacks: string, restaurantName: string, restaurantAdmin: string) => {
    const message = await client.messages.create({
        body: `Dear ${restaurantAdmin}, 
    here are the feedbacks from your customers
    ${feedbacks}\n 
    Thanks and remember to resolve all the issues in ${restaurantName} restaurant and improve service quality`,
        to,
        from
    })
}
export default { sendWeeklyAnalytics, sendNewOrderNotification, sendWelcomeSms, sendClientFeedBacks }