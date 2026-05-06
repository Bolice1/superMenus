import Customer from "../models/customer.schema";
import SendmailTransport from "nodemailer/lib/sendmail-transport";
import { sendNewOrderNotification,sendPaymentReminderNotifications,sendWeeklyAnalytics,sendWelcomeMail } from "../services/email.service";
import Notification from "../models/notification.schema";
import  {Request,Response} from 'express';


export const newNotification = async(req: Request, res: Response)=>{
}
