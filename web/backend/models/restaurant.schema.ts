import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
    name: string;
    address: string;
    phoneNumber: string;
    emailAddress: string;
    website: string;
    description: string;
    logo: string;
    banner: string;
    isActive: boolean;
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}

// Restaurant schema definition
const restaurantSchema = new Schema<IRestaurant>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        emailAddress: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: /.+\@.+\..+/,
            index: true,
        },
        website: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        logo: {
            type: String,
            required: true,
        },
        banner: {
            type: String,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
    },
    { timestamps: true }
);

const Restaurant = mongoose.model<IRestaurant>('Restaurant', restaurantSchema);

export default Restaurant;