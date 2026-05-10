import { Request, Response } from 'express';
import Finance, { IFinance } from '../models/finance.schema';
import Restaurant from '../models/restaurant.schema';
import RestaurantAdmin from '../models/restaurantAdmin.schemas';


export const createFinanceRecord = async (req: Request, res: Response) => {
    try {
        const { restaurantId, restaurantAdminId, paid, remaining, deadline } = req.body;

        if (!restaurantId) {
            return res.status(400).json({ msg: "Restaurant ID is required" });
        }

        if (!restaurantAdminId) {
            return res.status(400).json({ msg: "Restaurant Admin ID is required" });
        }

        const restaurantExists = await Restaurant.findById(restaurantId);
        if (!restaurantExists) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        const adminExists = await RestaurantAdmin.findById(restaurantAdminId);
        if (!adminExists) {
            return res.status(404).json({ msg: "Restaurant Admin not found" });
        }

        const newFinanceRecord = new Finance({
            restaurantId,
            restaurantAdminId,
            paid: paid || 0,
            remaining: remaining || 1000,
            deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });

        await newFinanceRecord.save();
        
        return res.status(201).json({
            msg: "Finance record created successfully",
            finance: newFinanceRecord,
        });
    } catch (error) {
        console.error(`Error in createFinanceRecord: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while creating finance record" });
    }
};


export const getAllFinanceRecords = async (req: Request, res: Response) => {
    try {
        const financeRecords = await Finance.find({})
            .populate('restaurantId', 'name emailAddress')
            .populate('restaurantAdminId', 'firstName lastName email');

        if (financeRecords.length === 0) {
            return res.status(200).json({ msg: "No finance records found", records: [] });
        }

        return res.status(200).json({ records: financeRecords });
    } catch (error) {
        console.error(`Error in getAllFinanceRecords: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching finance records" });
    }
};


export const getFinanceByRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantId } = req.params;

        if (!restaurantId) {
            return res.status(400).json({ msg: "Restaurant ID is required" });
        }

        const financeRecords = await Finance.find({ restaurantId })
            .populate('restaurantId', 'name emailAddress')
            .populate('restaurantAdminId', 'firstName lastName email')
            .sort({ createdAt: -1 });

        if (financeRecords.length === 0) {
            return res.status(200).json({ msg: "No finance records found for this restaurant", records: [] });
        }

        return res.status(200).json({ records: financeRecords });
    } catch (error) {
        console.error(`Error in getFinanceByRestaurant: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching restaurant finance records" });
    }
};


export const getFinanceById = async (req: Request, res: Response) => {
    try {
        const { financeId } = req.params;

        if (!financeId) {
            return res.status(400).json({ msg: "Finance ID is required" });
        }

        const financeRecord = await Finance.findById(financeId)
            .populate('restaurantId', 'name emailAddress')
            .populate('restaurantAdminId', 'firstName lastName email');

        if (!financeRecord) {
            return res.status(404).json({ msg: "Finance record not found" });
        }

        return res.status(200).json({ finance: financeRecord });
    } catch (error) {
        console.error(`Error in getFinanceById: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching finance record" });
    }
};


export const updateFinanceRecord = async (req: Request, res: Response) => {
    try {
        const { financeId } = req.params;
        const updateData = req.body;

        if (!financeId) {
            return res.status(400).json({ msg: "Finance ID is required" });
        }

        const updatedFinance = await Finance.findByIdAndUpdate(
            financeId,
            updateData,
            { new: true }
        )
            .populate('restaurantId', 'name emailAddress')
            .populate('restaurantAdminId', 'firstName lastName email');

        if (!updatedFinance) {
            return res.status(404).json({ msg: "Finance record not found" });
        }

        return res.status(200).json({
            msg: "Finance record updated successfully",
            finance: updatedFinance,
        });
    } catch (error) {
        console.error(`Error in updateFinanceRecord: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while updating finance record" });
    }
};


export const markPaymentAsCompleted = async (req: Request, res: Response) => {
    try {
        const { financeId } = req.params;
        const { paidAmount } = req.body;

        if (!financeId) {
            return res.status(400).json({ msg: "Finance ID is required" });
        }

        if (!paidAmount || paidAmount <= 0) {
            return res.status(400).json({ msg: "Valid paid amount is required" });
        }

        const financeRecord = await Finance.findById(financeId);
        if (!financeRecord) {
            return res.status(404).json({ msg: "Finance record not found" });
        }

        financeRecord.paid += paidAmount;
        financeRecord.remaining = Math.max(0, financeRecord.remaining - paidAmount);

        if (financeRecord.remaining <= 0) {
            financeRecord.paymentStatus = true;
        }

        await financeRecord.save();

        return res.status(200).json({
            msg: "Payment recorded successfully",
            finance: financeRecord,
        });
    } catch (error) {
        console.error(`Error in markPaymentAsCompleted: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while recording payment" });
    }
};


export const deleteFinanceRecord = async (req: Request, res: Response) => {
    try {
        const { financeId } = req.params;

        if (!financeId) {
            return res.status(400).json({ msg: "Finance ID is required" });
        }

        const deletedFinance = await Finance.findByIdAndDelete(financeId);

        if (!deletedFinance) {
            return res.status(404).json({ msg: "Finance record not found" });
        }

        return res.status(200).json({
            msg: "Finance record deleted successfully",
            finance: deletedFinance,
        });
    } catch (error) {
        console.error(`Error in deleteFinanceRecord: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while deleting finance record" });
    }
};
