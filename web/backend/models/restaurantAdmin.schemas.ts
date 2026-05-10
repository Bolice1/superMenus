import mongoose, { Document, Schema } from "mongoose";

export interface IRestaurantAdmin extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    restaurantId: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

export const restaurantAdminSchema = new Schema<IRestaurantAdmin>(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: /.+\@.+\..+/,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

const RestaurantAdmin = mongoose.model<IRestaurantAdmin>('RestaurantAdmin', restaurantAdminSchema);

export default RestaurantAdmin;