import { Request, Response } from 'express';
import Manager, { ISystemManager } from '../models/systemManage.schemar';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/env.confing';


export const createSystemManager = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, phoneNumber, role, password } = req.body;

        if (!firstName || !lastName || !email || !phoneNumber || !role || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const existingManager = await Manager.findOne({
            $or: [{ email: email.toLowerCase() }, { phoneNumber }],
        });

        if (existingManager) {
            return res.status(409).json({ msg: "Manager with this email or phone already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newManager = new Manager({
            firstName,
            lastName,
            email: email.toLowerCase(),
            phoneNumber,
            role,
            password: hashedPassword,
        });

        await newManager.save();

        return res.status(201).json({
            msg: "System manager created successfully",
            manager: {
                id: newManager._id,
                firstName: newManager.firstName,
                lastName: newManager.lastName,
                email: newManager.email,
                phoneNumber: newManager.phoneNumber,
                role: newManager.role,
            },
        });
    } catch (error) {
        console.error(`Error in createSystemManager: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while creating system manager" });
    }
};


export const loginSystemManager = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }

        const manager = await Manager.findOne({ email: email.toLowerCase() });
        if (!manager) {
            return res.status(404).json({ msg: "Manager not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, (manager as any).password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign(
            { managerId: manager._id, email: manager.email, role: manager.role },
            env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            msg: "Login successful",
            token,
            manager: {
                id: manager._id,
                firstName: manager.firstName,
                lastName: manager.lastName,
                email: manager.email,
                phoneNumber: manager.phoneNumber,
                role: manager.role,
            },
        });
    } catch (error) {
        console.error(`Error in loginSystemManager: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while logging in" });
    }
};


export const getManagerProfile = async (req: Request, res: Response) => {
    try {
        const { managerId } = req.params;

        if (!managerId) {
            return res.status(400).json({ msg: "Manager ID is required" });
        }

        const manager = await Manager.findById(managerId).select('-password');
        if (!manager) {
            return res.status(404).json({ msg: "Manager not found" });
        }

        return res.status(200).json({ manager });
    } catch (error) {
        console.error(`Error in getManagerProfile: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching manager profile" });
    }
};


export const updateManagerProfile = async (req: Request, res: Response) => {
    try {
        const { managerId } = req.params;
        const updateData = req.body;

        if (!managerId) {
            return res.status(400).json({ msg: "Manager ID is required" });
        }

        if (updateData.password) {
            delete updateData.password;
        }
        if (updateData.role) {
            delete updateData.role;
        }

        if (updateData.email) {
            const existingManager = await Manager.findOne({
                email: updateData.email.toLowerCase(),
                _id: { $ne: managerId },
            });
            if (existingManager) {
                return res.status(409).json({ msg: "Email already in use" });
            }
            updateData.email = updateData.email.toLowerCase();
        }

        if (updateData.phoneNumber) {
            const existingManager = await Manager.findOne({
                phoneNumber: updateData.phoneNumber,
                _id: { $ne: managerId },
            });
            if (existingManager) {
                return res.status(409).json({ msg: "Phone number already in use" });
            }
        }

        const updatedManager = await Manager.findByIdAndUpdate(managerId, updateData, {
            new: true,
        }).select('-password');

        if (!updatedManager) {
            return res.status(404).json({ msg: "Manager not found" });
        }

        return res.status(200).json({
            msg: "Manager profile updated successfully",
            manager: updatedManager,
        });
    } catch (error) {
        console.error(`Error in updateManagerProfile: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while updating manager profile" });
    }
};


export const changeManagerPassword = async (req: Request, res: Response) => {
    try {
        const { managerId } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (!managerId || !oldPassword || !newPassword) {
            return res.status(400).json({ msg: "Manager ID, old password, and new password are required" });
        }

        const manager = await Manager.findById(managerId);
        if (!manager) {
            return res.status(404).json({ msg: "Manager not found" });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, (manager as any).password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Old password is incorrect" });
        }

        (manager as any).password = await bcrypt.hash(newPassword, 10);
        await manager.save();

        return res.status(200).json({
            msg: "Password changed successfully",
        });
    } catch (error) {
        console.error(`Error in changeManagerPassword: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while changing password" });
    }
};


export const getAllManagers = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, role, search } = req.query;

        let query: any = {};

        if (role) {
            query.role = role;
        }

        if (search) {
            query = {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ],
                ...query,
            };
        }

        const pageNum = parseInt(page as string) || 1;
        const limitNum = parseInt(limit as string) || 10;
        const skip = (pageNum - 1) * limitNum;

        const managers = await Manager.find(query)
            .select('-password')
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await Manager.countDocuments(query);

        return res.status(200).json({
            managers,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error(`Error in getAllManagers: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching managers" });
    }
};


export const deleteSystemManager = async (req: Request, res: Response) => {
    try {
        const { managerId } = req.params;

        if (!managerId) {
            return res.status(400).json({ msg: "Manager ID is required" });
        }

        const deletedManager = await Manager.findByIdAndDelete(managerId);

        if (!deletedManager) {
            return res.status(404).json({ msg: "Manager not found" });
        }

        return res.status(200).json({
            msg: "System manager deleted successfully",
        });
    } catch (error) {
        console.error(`Error in deleteSystemManager: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while deleting system manager" });
    }
};


export const updateManagerRole = async (req: Request, res: Response) => {
    try {
        const { managerId } = req.params;
        const { role } = req.body;

        if (!managerId || !role) {
            return res.status(400).json({ msg: "Manager ID and role are required" });
        }

        const validRoles = ['admin', 'manager', 'support'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ msg: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
        }

        const updatedManager = await Manager.findByIdAndUpdate(
            managerId,
            { role },
            { new: true }
        ).select('-password');

        if (!updatedManager) {
            return res.status(404).json({ msg: "Manager not found" });
        }

        return res.status(200).json({
            msg: "Manager role updated successfully",
            manager: updatedManager,
        });
    } catch (error) {
        console.error(`Error in updateManagerRole: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while updating manager role" });
    }
};
