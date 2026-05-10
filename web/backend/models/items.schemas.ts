import mongoose, { Document, Schema } from "mongoose";

export interface IItem extends Document {
    name: string;
    description: string;
    price: number;
    status: 'available' | 'not available';
    restaurantId: mongoose.Types.ObjectId;
    category: 'breakfast' | 'lunch' | 'dinner' | 'dessert' | 'drink';
    image: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    isDeleted: boolean;
    isFeatured: boolean;
    isPopular: boolean;
    isNewArrival: boolean; 
    isBestSeller: boolean;
}

const itemSchema = new Schema<IItem>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        status: {
            type: String,
            required: true,
            enum: ['available', 'not available'],
            default: 'available',
        },
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
            index: true,
        },
        category: {
            type: String,
            required: true,
            enum: ['breakfast', 'lunch', 'dinner', 'dessert', 'drink'],
        },
        image: {
            type: String,
            required: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isPopular: {
            type: Boolean,
            default: false,
        },
        isNewArrival: { 
            type: Boolean,
            default: false,
        },
        isBestSeller: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

itemSchema.index({ restaurantId: 1, isDeleted: 1 });
itemSchema.index({ restaurantId: 1, category: 1, isDeleted: 1 });

const Item = mongoose.model<IItem>('Item', itemSchema);
export default Item;