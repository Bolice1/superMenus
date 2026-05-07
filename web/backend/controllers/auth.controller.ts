import restaurantAdmin, { restaurantAdminSchema } from '../models/restaurantAdmin.schemas';
import Customer from "../models/customer.schema";
import Manager from '../models/systemManage.schemar';
import Restaurant from '../models/restaurant.schema';
import RestaurantAdmin from '../models/restaurantAdmin.schemas';
import { sendWeeklyAnalytics, sendWelcomeMail, sendNewOrderNotification } from '../services/email.service';
import { Request, Response } from 'express';
import { email } from 'zod';

// export const register = async (req: Request, res: Response) => {
//     // let us register new restaurant 
//     const { name, address, phoneNumber, emailAddress, website, description, logo, banner } = req.body.restaurant;
//     // validation with zod comes here 
//     if (!name) {

//         return res.status(400).json({ msg: "No restaurant name provided" });

//     }
//     if (!address) {
//         return res.status(400).json({ msg: "No restaurant address provided" });

//     }
//     if (!phoneNumber) {
//         return res.status(400).json({ msg: "No phone number provided" });
//     }
//     if (!emailAddress) {
//         return res.status(400).json({ msg: "No email address provided" })
//     }
//     if (!website) {
//         return res.status(400).json({ msg: "No restaurant url provided" });
//     }
//     if (!description) { return res.status(400).json({ msg: "Restaurant description is required" }) }
//     if (!logo) { return res.status(400).json({ msg: "The logo of the restaurant is required" }) }
//     if (!banner) return res.status(400).json({ msg: "Banner required" })
//     const newRestaurant = new Restaurant({
//         name: name,
//         address: address,
//         phoneNumber: phoneNumber,
//         emailAddress: emailAddress,
//         website: website,
//         description: description,
//         logo: logo,
//         banner: banner
//     })
//     await newRestaurant.save();


//     // let us send the welcome email to the restaurant after registration 

//    await sendWelcomeMail(emailAddress,name,name);

// } catch (error) {
//     return res.status(500).json({ msg: "something went wrong!" })
// }


export const register = async (req: Request, res: Response) => {
    const { name, address, phoneNumber, emailAddress, website, description, logo, banner } = req.body;
    if (!name || !address || !phoneNumber || !emailAddress || !website || !description || !logo || !banner) {
        return res.status(400).json({ msg: "Some fields are missing" });
    }
    try {
        const newRestaurant = new Restaurant({
            name: name,
            address: address,
            phoneNumber: phoneNumber,
            emailAddress: emailAddress,
            website: website,
            description: description,
            logo: logo,
            banner: banner
        })
        await newRestaurant.save();
        // let us send email 
        const restaurantAdmin:any = RestaurantAdmin.findOne(newRestaurant.id)
        await sendWelcomeMail(emailAddress,name,restaurantAdmin)
    } catch (error) {
        console.error(error)
    }

}