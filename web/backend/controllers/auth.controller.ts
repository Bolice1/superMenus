import Restaurant from '../models/restaurant.schema';
import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import env from '../config/env.confing';


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

        if (!name || !address || !phoneNumber || !emailAddress || !website || !description || !logo || !banner) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const existingRestaurant = await Restaurant.findOne({ emailAddress });
        if (existingRestaurant) {
            return res.status(409).json({ msg: "Restaurant already exists" });
        }

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
        return res.status(500).json({ msg: "Something went wrong" });
    }
};


export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const updates = req.body;
        const { emailAddress } = req.body.restaurant;

        const updatedRestaurant = await Restaurant.findOneAndUpdate({ emailAddress }, updates, { new: true });
        if (!updatedRestaurant) {
            return res.status(404).json({ msg: "Restaurant not found!" });
        }

        return res.status(200).json({ msg: "Restaurant updated successfully", restaurant: updatedRestaurant });
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).json({ msg: "Something went wrong" });
    }
};


export const deleteRestaurant = async (req: Request, res: Response) => {
    try {
        const { emailAddress } = req.body.restaurant;

        const deletedRestaurant = await Restaurant.findOneAndDelete({ emailAddress });
        if (!deletedRestaurant) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        return res.status(200).json({ msg: "Restaurant deleted successfully" });
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).json({ msg: "Something went wrong" });
    }
};


export const getAllRestaurants = async (req: Request, res: Response) => {
    try {
        const allRestaurants = await Restaurant.find({});
        if (allRestaurants.length === 0) {
            return res.status(200).json({ msg: "No restaurants registered", restaurants: [] });
        }
        return res.status(200).json({ restaurants: allRestaurants });
    } catch (error) {
        console.error(`Error: ${error}`);
        return res.status(500).json({ msg: "Something went wrong" });
    }
};


