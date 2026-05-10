import { Request, Response } from 'express';
import Customer, { ICustomer } from '../models/customer.schema';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../config/env.confing';


export const registerCustomer = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, userName, email, phoneNumber, password } = req.body;

        if (!firstName || !lastName || !userName || !email || !phoneNumber || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const existingCustomer = await Customer.findOne({
            $or: [{ email: email.toLowerCase() }, { userName }],
        });

        if (existingCustomer) {
            return res.status(409).json({ msg: "Customer with this email or username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newCustomer = new Customer({
            firstName,
            lastName,
            userName,
            email: email.toLowerCase(),
            phoneNumber,
            password: hashedPassword,
        });

        await newCustomer.save();

        return res.status(201).json({
            msg: "Customer registered successfully",
            customer: {
                id: newCustomer._id,
                firstName: newCustomer.firstName,
                lastName: newCustomer.lastName,
                userName: newCustomer.userName,
                email: newCustomer.email,
                phoneNumber: newCustomer.phoneNumber,
            },
        });
    } catch (error) {
        console.error(`Error in registerCustomer: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while registering customer" });
    }
};


export const loginCustomer = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ msg: "Email and password are required" });
        }

        const customer = await Customer.findOne({ email: email.toLowerCase() });
        if (!customer) {
            return res.status(404).json({ msg: "Customer not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, customer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign(
            { customerId: customer._id, email: customer.email },
            env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        return res.status(200).json({
            msg: "Login successful",
            token,
            customer: {
                id: customer._id,
                firstName: customer.firstName,
                lastName: customer.lastName,
                userName: customer.userName,
                email: customer.email,
                phoneNumber: customer.phoneNumber,
            },
        });
    } catch (error) {
        console.error(`Error in loginCustomer: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while logging in" });
    }
};


export const getCustomerProfile = async (req: Request, res: Response) => {
    try {
        const { customerId } = req.params;

        if (!customerId) {
            return res.status(400).json({ msg: "Customer ID is required" });
        }

        const customer = await Customer.findById(customerId).select('-password');
        if (!customer) {
            return res.status(404).json({ msg: "Customer not found" });
        }

        return res.status(200).json({ customer });
    } catch (error) {
        console.error(`Error in getCustomerProfile: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching customer profile" });
    }
};

export const updateCustomerProfile = async (req: Request, res: Response) => {
    try {
        const { customerId } = req.params;
        const updateData = req.body;

        if (!customerId) {
            return res.status(400).json({ msg: "Customer ID is required" });
        }

        if (updateData.password) {
            delete updateData.password;
        }

        if (updateData.email) {
            const existingCustomer = await Customer.findOne({
                email: updateData.email.toLowerCase(),
                _id: { $ne: customerId },
            });
            if (existingCustomer) {
                return res.status(409).json({ msg: "Email already in use" });
            }
            updateData.email = updateData.email.toLowerCase();
        }

        if (updateData.userName) {
            const existingCustomer = await Customer.findOne({
                userName: updateData.userName,
                _id: { $ne: customerId },
            });
            if (existingCustomer) {
                return res.status(409).json({ msg: "Username already in use" });
            }
        }

        const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updateData, {
            new: true,
        }).select('-password');

        if (!updatedCustomer) {
            return res.status(404).json({ msg: "Customer not found" });
        }

        return res.status(200).json({
            msg: "Customer profile updated successfully",
            customer: updatedCustomer,
        });
    } catch (error) {
        console.error(`Error in updateCustomerProfile: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while updating customer profile" });
    }
};


export const changePassword = async (req: Request, res: Response) => {
    try {
        const { customerId } = req.params;
        const { oldPassword, newPassword } = req.body;

        if (!customerId || !oldPassword || !newPassword) {
            return res.status(400).json({ msg: "Customer ID, old password, and new password are required" });
        }

        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ msg: "Customer not found" });
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, customer.password);
        if (!isPasswordValid) {
            return res.status(401).json({ msg: "Old password is incorrect" });
        }

        customer.password = await bcrypt.hash(newPassword, 10);
        await customer.save();

        return res.status(200).json({
            msg: "Password changed successfully",
        });
    } catch (error) {
        console.error(`Error in changePassword: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while changing password" });
    }
};


export const getAllCustomers = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, search } = req.query;

        let query: any = {};

        if (search) {
            query = {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { userName: { $regex: search, $options: 'i' } },
                ],
            };
        }

        const pageNum = parseInt(page as string) || 1;
        const limitNum = parseInt(limit as string) || 10;
        const skip = (pageNum - 1) * limitNum;

        const customers = await Customer.find(query)
            .select('-password')
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await Customer.countDocuments(query);

        return res.status(200).json({
            customers,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error(`Error in getAllCustomers: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching customers" });
    }
};


export const deleteCustomerAccount = async (req: Request, res: Response) => {
    try {
        const { customerId } = req.params;

        if (!customerId) {
            return res.status(400).json({ msg: "Customer ID is required" });
        }

        const deletedCustomer = await Customer.findByIdAndDelete(customerId);

        if (!deletedCustomer) {
            return res.status(404).json({ msg: "Customer not found" });
        }

        return res.status(200).json({
            msg: "Customer account deleted successfully",
        });
    } catch (error) {
        console.error(`Error in deleteCustomerAccount: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while deleting customer account" });
    }
};


export const getCustomerByUsername = async (req: Request, res: Response) => {
    try {
        const { userName } = req.params;

        if (!userName) {
            return res.status(400).json({ msg: "Username is required" });
        }

        const customer = await Customer.findOne({ userName }).select('-password');

        if (!customer) {
            return res.status(404).json({ msg: "Customer not found" });
        }

        return res.status(200).json({ customer });
    } catch (error) {
        console.error(`Error in getCustomerByUsername: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching customer" });
    }
};
