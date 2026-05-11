import Item from '../models/items.schemas';
import { Request, Response } from 'express';

export const createItem = async (req: Request, res: Response) => {
    try {
        const itemData = req.body.item || {};
        const { name, description, price, status, restaurantId, category, image } = itemData;
        
        if (!name) return res.status(400).json({ msg: "Name is missing" });
        if (!description) return res.status(400).json({ msg: "Description is missing" });
        if (!price) return res.status(400).json({ msg: "No price provided" });
        if (!status) return res.status(400).json({ msg: "No status added" });
        if (!restaurantId) return res.status(400).json({ msg: "No restaurant chosen" });
        if (!category) return res.status(400).json({ msg: "Item category is missing" });
        if (!image) return res.status(400).json({ msg: "No image added" });

        const newItem = new Item({
            name,
            description,
            price,
            status,
            restaurantId,
            category,
            image,
        });

        await newItem.save();
        return res.status(201).json({ msg: "Item created successfully", item: newItem });

    } catch (error) {
        console.error(`Error in createItem: ${error}`);
        return res.status(500).json({ msg: "something went wrong" });
    }
};

export const deleteItemById = async (req: Request, res: Response) => {
    try {
        const itemId = typeof req.body.item === 'object' ? req.body.item?.id : req.body.item;
        
        if (!itemId) {
            return res.status(400).json({ msg: "No Item ID provided" });
        }

        const deletedItem = await Item.findByIdAndDelete(itemId);
        if (!deletedItem) {
            return res.status(404).json({ msg: "Item not found" }); 
        }

        return res.status(200).json({ msg: "Item deleted successfully", item: deletedItem });

    } catch (error) {
        console.error(`Error occurred in deleteItemById:\n${error}`);
        return res.status(500).json({ msg: "something went wrong" });
    }
};

export const deleteAllItems = async (req: Request, res: Response) => {
    try {
        const deleteResult = await Item.deleteMany({});
        
        return res.status(200).json({ 
            msg: "All items deleted successfully", 
            count: deleteResult.deletedCount 
        });

    } catch (error) {
        console.error(`Error in deleteAllItems:\n${error}`);
        return res.status(500).json({ msg: "something went wrong" });
    }
};

export const listItemsByRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantId } = req.params;
        if (!restaurantId) {
            return res.status(400).json({ msg: "Restaurant ID is required" });
        }

        const items = await Item.find({ restaurantId }).sort({ createdAt: -1 });
        return res.status(200).json({ items });
    } catch (error) {
        console.error(`Error in listItemsByRestaurant: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while listing items" });
    }
};

export const updateItem = async (req: Request, res: Response) => {
    try {
        const itemData = req.body.item || {};
        const itemId = itemData.id;
        const updates = req.body.updates || itemData; 

        if (!itemId) {
            return res.status(400).json({ msg: "Item ID is missing" });
        }

        const updatedItem = await Item.findByIdAndUpdate(itemId, updates, { new: true });
        if (!updatedItem) {
            return res.status(404).json({ msg: "Error: Item not found and not updated" });
        }

        return res.status(200).json({ msg: "Item updated successfully", item: updatedItem });

    } catch (error) {
        console.error(`Error in updateItem: ${error}`);
        return res.status(500).json({ msg: "Something went wrong" });
    }
};