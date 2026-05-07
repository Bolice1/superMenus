import Customer from "../models/customer.schema";
import SendmailTransport from "nodemailer/lib/sendmail-transport";
import { sendNewOrderNotification, sendPaymentReminderNotifications, sendPaymentComfirmation, sendWeeklyAnalytics, sendWelcomeMail } from "../services/email.service";
import { Request, Response } from 'express';
import Finance from "../models/finance.schema";


export const sendWelcomeE_Mail = async (req: Request, res: Response) => {
    try {
        const { to, restaurantName, restaurantAdmin } = req.body;
        // let us call the function to send the welcome mail

        sendWelcomeMail(to, restaurantAdmin, restaurantName)

    } catch (error) {
        console.error(`Error: ${error}`);
    }
    // let us call it here 
}

export const paymentReminderEmail= async (req: Request, res: Response) => {
    try {
        const { to,
            name,
            deadline,
            amount,
            bankInfo,
        } = req.body;

        // let us call the function 
        await sendPaymentReminderNotifications(to, name, deadline, amount, bankInfo)

    } catch (error) {
        console.error(`Error: ${error}`)
    }
}

export const sentPaymentComfirmation = async(req: Request,res: Response)=>{
    const {email,restaurantAdmin,restaurantName} = req.body;
    const amount = 
}

export const sendNewOrder = async(req: Request,res: Response)=>{
    try{

    }catch(error){
        return res.status(500).json({msg:"Something went wrong while sending the confirmation email"})
    }
}
