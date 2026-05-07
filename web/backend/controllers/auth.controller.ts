import Restaurant from '../models/restaurant.schema';
import { Request, Response } from 'express';

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
        return res.status(500).json({ msg: "something went wrong" })
    }
}