import { Request, Response } from 'express';
import Restaurant, { IRestaurant } from '../models/restaurant.schema';


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
            banner,
        } = req.body.restaurant || req.body;

        if (!name || !address || !phoneNumber || !emailAddress || !website || !description || !logo || !banner) {
            return res.status(400).json({ msg: "All fields are required" });
        }

        const existingRestaurant = await Restaurant.findOne({
            $or: [{ emailAddress: emailAddress.toLowerCase() }, { phoneNumber }],
        });

        if (existingRestaurant) {
            return res.status(409).json({ msg: "Restaurant with this email or phone already exists" });
        }

        const newRestaurant = new Restaurant({
            name,
            address,
            phoneNumber,
            emailAddress: emailAddress.toLowerCase(),
            website,
            description,
            logo,
            banner,
            isActive: true,
        });

        await newRestaurant.save();

        return res.status(201).json({
            msg: "Restaurant registered successfully",
            restaurant: newRestaurant,
        });
    } catch (error) {
        console.error(`Error in registerRestaurant: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while registering restaurant" });
    }
};


export const getAllRestaurants = async (req: Request, res: Response) => {
    try {
        const { page = 1, limit = 10, search, isActive } = req.query;

        let query: any = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { address: { $regex: search, $options: 'i' } },
                    { emailAddress: { $regex: search, $options: 'i' } },
                ],
            };
        }

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        const pageNum = parseInt(page as string) || 1;
        const limitNum = parseInt(limit as string) || 10;
        const skip = (pageNum - 1) * limitNum;

        const restaurants = await Restaurant.find(query)
            .skip(skip)
            .limit(limitNum)
            .sort({ createdAt: -1 });

        const total = await Restaurant.countDocuments(query);

        return res.status(200).json({
            restaurants,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                pages: Math.ceil(total / limitNum),
            },
        });
    } catch (error) {
        console.error(`Error in getAllRestaurants: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching restaurants" });
    }
};


export const getRestaurantById = async (req: Request, res: Response) => {
    try {
        const { restaurantId } = req.params;

        if (!restaurantId) {
            return res.status(400).json({ msg: "Restaurant ID is required" });
        }

        const restaurant = await Restaurant.findById(restaurantId);

        if (!restaurant) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        return res.status(200).json({ restaurant });
    } catch (error) {
        console.error(`Error in getRestaurantById: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching restaurant" });
    }
};


export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantId } = req.params;
        const updateData = req.body.restaurant || req.body;

        if (!restaurantId) {
            return res.status(400).json({ msg: "Restaurant ID is required" });
        }

        if (updateData.emailAddress) {
            const existingRestaurant = await Restaurant.findOne({
                emailAddress: updateData.emailAddress.toLowerCase(),
                _id: { $ne: restaurantId },
            });
            if (existingRestaurant) {
                return res.status(409).json({ msg: "Email already in use by another restaurant" });
            }
            updateData.emailAddress = updateData.emailAddress.toLowerCase();
        }

        if (updateData.phoneNumber) {
            const existingRestaurant = await Restaurant.findOne({
                phoneNumber: updateData.phoneNumber,
                _id: { $ne: restaurantId },
            });
            if (existingRestaurant) {
                return res.status(409).json({ msg: "Phone number already in use by another restaurant" });
            }
        }

        const updatedRestaurant = await Restaurant.findByIdAndUpdate(restaurantId, updateData, {
            new: true,
        });

        if (!updatedRestaurant) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        return res.status(200).json({
            msg: "Restaurant updated successfully",
            restaurant: updatedRestaurant,
        });
    } catch (error) {
        console.error(`Error in updateRestaurant: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while updating restaurant" });
    }
};


export const deleteRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantId } = req.params;

        if (!restaurantId) {
            return res.status(400).json({ msg: "Restaurant ID is required" });
        }

        const deletedRestaurant = await Restaurant.findByIdAndDelete(restaurantId);

        if (!deletedRestaurant) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        return res.status(200).json({
            msg: "Restaurant deleted successfully",
            restaurant: deletedRestaurant,
        });
    } catch (error) {
        console.error(`Error in deleteRestaurant: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while deleting restaurant" });
    }
};


export const toggleRestaurantStatus = async (req: Request, res: Response) => {
    try {
        const { restaurantId } = req.params;

        if (!restaurantId) {
            return res.status(400).json({ msg: "Restaurant ID is required" });
        }

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        restaurant.isActive = !restaurant.isActive;
        await restaurant.save();

        return res.status(200).json({
            msg: `Restaurant ${restaurant.isActive ? 'activated' : 'deactivated'} successfully`,
            restaurant,
        });
    } catch (error) {
        console.error(`Error in toggleRestaurantStatus: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while toggling restaurant status" });
    }
};


export const getActiveRestaurants = async (req: Request, res: Response) => {
    try {
        const restaurants = await Restaurant.find({ isActive: true })
            .sort({ createdAt: -1 });

        if (restaurants.length === 0) {
            return res.status(200).json({ msg: "No active restaurants found", restaurants: [] });
        }

        return res.status(200).json({ restaurants });
    } catch (error) {
        console.error(`Error in getActiveRestaurants: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching active restaurants" });
    }
};


export const searchRestaurants = async (req: Request, res: Response) => {
    try {
        const { query } = req.query;

        if (!query || typeof query !== 'string') {
            return res.status(400).json({ msg: "Search query is required" });
        }

        const restaurants = await Restaurant.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { address: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
            ],
            isActive: true,
        }).sort({ createdAt: -1 });

        return res.status(200).json({ restaurants });
    } catch (error) {
        console.error(`Error in searchRestaurants: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while searching restaurants" });
    }
};


export const getRestaurantStats = async (req: Request, res: Response) => {
    try {
        const totalRestaurants = await Restaurant.countDocuments();
        const activeRestaurants = await Restaurant.countDocuments({ isActive: true });
        const inactiveRestaurants = totalRestaurants - activeRestaurants;

        return res.status(200).json({
            stats: {
                total: totalRestaurants,
                active: activeRestaurants,
                inactive: inactiveRestaurants,
            },
        });
    } catch (error) {
        console.error(`Error in getRestaurantStats: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching restaurant statistics" });
    }
};
