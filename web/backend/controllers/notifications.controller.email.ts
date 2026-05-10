import Customer from "../models/customer.schema";
import { Request, Response } from 'express';
import Finance from "../models/finance.schema";
import {
    sendNewOrderNotification,
    sendPaymentReminderNotifications,
    sendPaymentComfirmation,
    sendWeeklyAnalytics,
    sendWelcomeMail
} from "../services/email.service";

export const sendWelcomeE_Mail = async (req: Request, res: Response) => {
    try {
        const { to, restaurantName, restaurantAdmin } = req.body;
        if (!to || !restaurantName || !restaurantAdmin) {
            return res.status(400).json({ msg: "Recipient email, restaurant name, and admin name are required" });
        }

        await sendWelcomeMail(to, restaurantAdmin, restaurantName);

        return res.status(200).json({ msg: "Welcome email sent successfully" });
    } catch (error) {
        console.error(`Error sending welcome email: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while sending the welcome email" });
    }
}

export const paymentReminderEmail = async (req: Request, res: Response) => {
    try {
        const { to, name, deadline, amount, bankInfo } = req.body;
        if (!to || !name || !deadline || !amount || !bankInfo) {
            return res.status(400).json({ msg: "All fields are required for payment reminder" });
        }

        await sendPaymentReminderNotifications(to, name, deadline, amount, bankInfo);

        return res.status(200).json({ msg: "Payment reminder email sent successfully" });
    } catch (error) {
        console.error(`Error sending payment reminder: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while sending the payment reminder" });
    }
}

export const sentPaymentComfirmation = async (req: Request, res: Response) => {
    try {
        const { email, restaurantAdmin, restaurantName } = req.body;
        if (!email || !restaurantAdmin || !restaurantName) {
            return res.status(400).json({ msg: "All fields are required for payment confirmation" });
        }
        const paid = await Finance.findOne({ email })
        const amount = paid?.paid;
        await sendPaymentComfirmation(email, restaurantAdmin, restaurantName, amount);

        return res.status(200).json({ msg: "Payment confirmation email sent successfully" });
    } catch (error) {
        console.error(`Error sending payment confirmation: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while sending payment confirmation" });
    }
}

export const sendNewOrder = async (req: Request, res: Response) => {
    try {
        const restaurant = req.body.restaurant || {};
        const { email, restaurantName, restaurantAdmin } = restaurant;
        const orderInfo = req.body.orderInfo || req.body; // Adjusted to handle structure variations

        if (!email || !restaurantAdmin || !restaurantName) {
            return res.status(400).json({ msg: "All restaurant fields are required" });
        }
        if (!orderInfo || Object.keys(orderInfo).length === 0) {
            return res.status(400).json({ msg: "Order info is a mandatory field" });
        }

        await sendNewOrderNotification(email, restaurantName, orderInfo);

        return res.status(200).json({ msg: "New order notification sent successfully" });
    } catch (error) {
        console.error(`Error sending new order email: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while sending the confirmation email" });
    }
}

export const send_weeklyAnalytics = async (req: Request, res: Response) => {
    try {


    } catch (error) {
        console.log(`Error: \n${error}`)
        return res.status(500).json({ msg: "something went wrong" })
    }
}