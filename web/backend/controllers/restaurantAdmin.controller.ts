import { Request, Response } from 'express';
import RestaurantAdmin, { IRestaurantAdmin } from '../models/restaurantAdmin.schemas';
import Restaurant from '../models/restaurant.schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/env.confing';


export const createRestaurantAdmin = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, phoneNumber, restaurantId, password } = req.body;

        if (!firstName || !lastName || !email || !phoneNumber || !restaurantId || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const restaurantExists = await Restaurant.findById(restaurantId);
        if (!restaurantExists) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        const existingAdmin = await RestaurantAdmin.findOne({
            $or: [{ email: email.toLowerCase() }, { phoneNumber }],
        });

        if (existingAdmin) {
            return res.status(409).json({ msg: "Restaurant admin with this email or phone already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new RestaurantAdmin({
            firstName,
            lastName,
            email: email.toLowerCase(),
            phoneNumber,
            restaurantId,
            password: hashedPassword,
        });

        await newAdmin.save();

        const populatedAdmin = await newAdmin.populate('restaurantId', 'name emailAddress');

        return res.status(201).json({
            msg: "Restaurant admin created successfully",
            admin: {
                id: newAdmin._id,
                firstName: newAdmin.firstName,
                lastName: newAdmin.lastName,
                email: newAdmin.email,
                phoneNumber: newAdmin.phoneNumber,
                restaurant: populatedAdmin.restaurantId,
            },
        });
    } catch (error) {
        console.error(`Error in createRestaurantAdmin: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while creating restaurant admin" });
    }
};


export const loginRestaurantAdmin = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }

        const admin = await RestaurantAdmin.findOne({ email: email.toLowerCase() }).populate(
            'restaurantId',
            'name emailAddress'
        );

        if (!admin) {
            return res.status(404).json({ msg: "Restaurant admin not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, (admin as any).password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign(
            { adminId: admin._id, email: admin.email, restaurantId: admin.restaurantId },
            env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            msg: "Login successful",
            token,
            admin: {
                id: admin._id,
                firstName: admin.firstName,
                lastName: admin.lastName,
                email: admin.email,
                phoneNumber: admin.phoneNumber,
                restaurant: admin.restaurantId,
            },
        });
    } catch (error) {
        console.error(`Error in loginRestaurantAdmin: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while logging in" });
    }
};


export const getAdminProfile = async (req: Request, res: Response) => {
    try {
        const { adminId } = req.params;

        if (!adminId) {
            return res.status(400).json({ msg: "Admin ID is required" });
        }

        const admin = await RestaurantAdmin.findById(adminId)
            .select('-password')
            .populate('restaurantId', 'name emailAddress phoneNumber');

        if (!admin) {
            return res.status(404).json({ msg: "Admin not found" });
        }

        return res.status(200).json({ admin });
    } catch (error) {
        console.error(`Error in getAdminProfile: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching admin profile" });
    }
};


export const updateAdminProfile = async (req: Request, res: Response) => {
    try {
        const { adminId } = req.params;
        const updateData = req.body;

        if (!adminId) {
            return res.status(400).json({ msg: "Admin ID is required" });
        }

        if (updateData.password) {
            delete updateData.password;
        }
        if (updateData.restaurantId) {
            delete updateData.restaurantId;
        }

        if (updateData.email) {
            const existingAdmin = await RestaurantAdmin.findOne({
                email: updateData.email.toLowerCase(),
                _id: { $ne: adminId },
            });
            if (existingAdmin) {
                return res.status(409).json({ msg: "Email already in use" });
            }
            updateData.email = updateData.email.toLowerCase();
        }

        if (updateData.phoneNumber) {
            const existingAdmin = await RestaurantAdmin.findOne({
                phoneNumber: updateData.phoneNumber,
                _id: { $ne: adminId },
            });
            if (existingAdmin) {
                return res.status(409).json({ msg: "Phone number already in use" });
            }
        }

        const updatedAdmin = await RestaurantAdmin.findByIdAndUpdate(adminId, updateData, {
            new: true,
        })
            .select('-password')
            .populate('restaurantId', 'name emailAddress phoneNumber');

        if (!updatedAdmin) {
            return res.status(404).json({ msg: "Admin not found" });
        }

        return res.status(200).json({
            msg: "Admin profile updated successfully",
            admin: updatedAdmin,
        });
    } catch (error) {
        console.error(`Error in updateAdminProfile: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while updating admin profile" });
    }
};


export const changeAdminPassword = async (req: Request, res: Response) => {
    try {
        const { adminId } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (!adminId || !oldPassword || !newPassword) {
            return res.status(400).json({ msg: "Admin ID, old password, and new password are required" });
        }

        const admin = await RestaurantAdmin.findById(adminId);
        if (!admin) {
            return res.status(404).json({ msg: "Admin not found" });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, (admin as any).password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Old password is incorrect" });
        }

        (admin as any).password = await bcrypt.hash(newPassword, 10);
        await admin.save();

        return res.status(200).json({
            msg: "Password changed successfully",
        });
    } catch (error) {
        console.error(`Error in changeAdminPassword: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while changing password" });
    }
};


export const getRestaurantAdmins = async (req: Request, res: Response) => {
    try {
        const { restaurantId } = req.params;

        if (!restaurantId) {
            return res.status(400).json({ msg: "Restaurant ID is required" });
        }

        const restaurantExists = await Restaurant.findById(restaurantId);
        if (!restaurantExists) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        const admins = await RestaurantAdmin.find({ restaurantId })
            .select('-password')
            .populate('restaurantId', 'name emailAddress')
            .sort({ createdAt: -1 });

        return res.status(200).json({ admins });
    } catch (error) {
        console.error(`Error in getRestaurantAdmins: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching restaurant admins" });
    }
};


export const deleteRestaurantAdmin = async (req: Request, res: Response) => {
    try {
        const { adminId } = req.params;

        if (!adminId) {
            return res.status(400).json({ msg: "Admin ID is required" });
        }

        const deletedAdmin = await RestaurantAdmin.findByIdAndDelete(adminId);

        if (!deletedAdmin) {
            return res.status(404).json({ msg: "Admin not found" });
        }

        return res.status(200).json({
            msg: "Restaurant admin deleted successfully",
        });
    } catch (error) {
        console.error(`Error in deleteRestaurantAdmin: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while deleting restaurant admin" });
    }
};


export const getAllRestaurantAdmins = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, restaurantId } = req.query;

        let query: any = {};
        if (restaurantId) {
            query.restaurantId = restaurantId;
        }

        const pageNum = parseInt(page as string) || 1;
        const limitNum = parseInt(limit as string) || 10;
        const skip = (pageNum - 1) * limitNum;

        const admins = await RestaurantAdmin.find(query)
            .select('-password')
            .skip(skip)
            .limit(limitNum)
            .populate('restaurantId', 'name emailAddress')
            .sort({ createdAt: -1 });

        const total = await RestaurantAdmin.countDocuments(query);

        return res.status(200).json({
            admins,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error(`Error in getAllRestaurantAdmins: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching restaurant admins" });
    }
};
