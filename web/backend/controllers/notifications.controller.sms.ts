import Customer from "../models/customer.schema";
import SendmailTransport from "nodemailer/lib/sendmail-transport";
import Notification from "../models/notification.schema";
import  {Request,Response} from 'express';
import { sendWeeklyAnalytics,sendClientFeedBacks,sendNewOrderNotification,sendPaymentReminderNotifications,sendWelcomeSms } from "../services/sms.service";


export const sendWelcomeSms = async(req: Request,res: Response)=>{
try{
 // let us call the sendWelcome 
}catch(error){
    console.log("Error occurred while sending the welcome sms")
}
}