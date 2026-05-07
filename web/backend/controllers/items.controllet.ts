import Item from '../models/items.schemas';
import { Request, Response } from 'express';


export const createItem = async (req: Request, res: Response) => {
    try {
        const { name, description, price, status, restaurantId, category, image, createdAt, updatedAt, deletedAt, isDeleted, isFeatured, isPopular, isNew } = req.body.item;
        // validation 
        if (!name) {
            return res.status(400).json({ msg: "Name is missing" })
        }
        if (!description) {
            return res.status(400).json({ msg: "Description is missing" })
        }
        if (!price) {
            return res.status(400).json({ msg: "No price provided" })
        }
        if (!status) {
            return res.status(400).json({ msg: "No status added" })
        }
        if (!restaurantId) {
            return res.status(400).json({ msg: "No restaurant chosen" })
        }
        if (!category) {
            return res.status(400).json({ msg: "Item category is missing" })
        }
        if (!image) {
            return res.status(400).json({ msg: "No image added" })
        }
        // let us create new item 
        const newItem = new Item({
            name,
            description,
            price,
            status,
            restaurantId,
            category,
            image,
        });
        // let us save it 

        await newItem.save()

    } catch (error) {
        return res.status(500).json({ msg: "something went wrong" })
    }


}
export const deleteItemById = async (req: Request, res: Response) => {
    try {
        const itemId = req.body.item;
        const deletedItem = Item.findByIdAndDelete(itemId)
        if (!deletedItem) return res.status(400).json({ msg: "Item not found" })

    } catch (error) {
        console.error(`Error occurred\n${error}`)
    }
}

export const deleteAllItems = async (req: Request, res: Response) => {
    try {
        const deleteAll = await Item.findOneAndDelete({});
        if (!deleteAll) return res.status(405).json({ msg: "Not deleted" })

        return res.status(200).json(deleteAll)

    } catch (error) {
        console.error(`Error:\n${error}}`)
    }
}

export const updateItem = async (req: Request, res: Response) => {
    try {

        const itemId = req.body.item.id
        const updatedItem = Item.findByIdAndUpdate(itemId)
        if (!updatedItem) return res.status(400).json({ msg: "Error item not updated " })

        return res.status(200).json(updatedItem)

    } catch (error) {
        return res.status(500).json({ msg: "Something went wrong" })
    }
}