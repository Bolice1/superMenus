import Restaurant from '../models/restaurant.schema';
import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import Customer from '../models/customer.schema';
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

export const loginCustomer = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const User = await Customer.findOne({ email });
        if (!User) {
            return res.status(400).json({ error: "User not found!" });
        }

        const passwordMatches = await bcrypt.compare(password, User.password);
        if (!passwordMatches) {
            return res.status(400).json({ msg: "Password or email do not match" });
        }

        const token = jwt.sign(
            { userId: User.id, username: User.userName },
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRES_IN as SignOptions['expiresIn'] }
        );

        return res.status(200).json({ msg: "Login successful", token: token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Something went wrong" });
    }
};

export const registerCustomer = async (req: Request, res: Response) => {
    try {
        const { email, password, firstName, lastName, phoneNumber } = req.body;
        if (!email || !password || !firstName || !lastName || !phoneNumber) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const existingUser = await Customer.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ msg: "User already exists with this email" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newCustomer = new Customer({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phoneNumber
        });

        await newCustomer.save();

        return res.status(201).json({ msg: "Customer registered successfully" });
    } catch (error) {
        console.error("Error occurred while registering customer:", error);
        return res.status(500).json({ msg: "Something went wrong" });
    }
};