import Restaurant from '../models/restaurant.schema';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken'
import Customer from '../models/customer.schema';
import bcrypt from 'bcrypt'

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


export const registerRestaurant = async (req: Request, res: Response) => {

    try {

        const {
            name,
            address,
            phoneNumber,
            emailAddress,
            website,
            description,
            logo,
            banner
        } = req.body.restaurant;

        // validations

        if (!name) {
            return res.status(400).json({
                msg: "Restaurant name is required"
            });
        }

        if (!address) {
            return res.status(400).json({
                msg: "Restaurant address is required"
            });
        }

        if (!phoneNumber) {
            return res.status(400).json({
                msg: "Phone number is required"
            });
        }

        if (!emailAddress) {
            return res.status(400).json({
                msg: "Email address is required"
            });
        }

        if (!website) {
            return res.status(400).json({
                msg: "Website is required"
            });
        }

        if (!description) {
            return res.status(400).json({
                msg: "Description is required"
            });
        }

        if (!logo) {
            return res.status(400).json({
                msg: "Restaurant logo is required"
            });
        }

        if (!banner) {
            return res.status(400).json({
                msg: "Restaurant banner is required"
            });
        }

        // check if restaurant already exists

        const existingRestaurant = await Restaurant.findOne({
            emailAddress
        });

        if (existingRestaurant) {
            return res.status(409).json({
                msg: "Restaurant already exists"
            });
        }

        // create restaurant

        const newRestaurant = new Restaurant({
            name,
            address,
            phoneNumber,
            emailAddress,
            website,
            description,
            logo,
            banner
        });

        await newRestaurant.save();

        return res.status(201).json({
            msg: "Restaurant registered successfully",
            restaurant: newRestaurant
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            msg: "Something went wrong"
        });
    }
};

export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        // let us update the restaurant exists and update it
        const { emailAddress } = req.body.restaurant;
        const updatedRestaurant = await Restaurant.findOneAndUpdate(emailAddress);
        if (!updatedRestaurant) return res.status(400).json({ msg: "Restaurant not found!" });


    } catch (error) {
        console.error({ msg: `Error:${error}` })
        return res.status(500).json({ msg: "something went wrong" })
    }
}

export const deleteRestaurant = async (req: Request, res: Response) => {

    try {
        const { emailAddress } = req.body.restaurant;
        const deledRestaurant = await Restaurant.findOneAndDelete(emailAddress);
        if (!deledRestaurant) return res.status(429).json({ msg: "Restaurant not found" })

    } catch (error) {
        console.error(`Error: ${error}`)
        return res.status(500).json({ msg: "something went wrong" })
    }

}

export const getAllRestaurants = async (req: Request, res: Response) => {
    try {
        const allRestaurants = await Restaurant.find({});
        if ((allRestaurants).length == 0) return res.status(200).json({ msg: "No restaurants registered" })
        return res.status(200).json({ msg: `${allRestaurants}` });

    } catch (error) {
        console.error(`Error: ${error}`)
        return res.status(500).json({ msg: "something went wrong" })
    }

}

export const loginCustomer = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ msg: "All fields are required" })
        const account = Customer.findOne({ email });
        if (!account) return res.status(400).json({ error: "user not found!" })

    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" })
    }
}

export const registerCustomer = async (req: Request, res: Response) => {
    try {

        const { email, password, firstName, lastName, phoneNumber } = req.body;
        if (!email || !password || !firstName || !lastName || !phoneNumber) return res.status(400).json({ msg: "All the fields are required" })
        
        const existingUser = Customer.findOne(email);
        if(!existingUser) return res.status(400).json({msg:""})

    } catch (error) {
        console.error("Error occurred while registering customer")
    }
}