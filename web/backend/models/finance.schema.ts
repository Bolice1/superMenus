import mongoose, { Document, Schema } from "mongoose";

export interface IFinance extends Document {
    restaurantId: mongoose.Types.ObjectId;
    restaurantAdminId: mongoose.Types.ObjectId;
    paymentStatus: boolean;
    paid: number;
    remaining: number;
    deadline: Date;
    createdAt: Date;
    updatedAt: Date;
}

const financeSchema = new Schema<IFinance>(
    {
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
            index: true,
        },
        restaurantAdminId: {
            type: Schema.Types.ObjectId,
            ref: 'RestaurantAdmin',
            required: true,
        },
        paymentStatus: {
            type: Boolean,
            required: true,
            default: false,
        },
        paid: {
            type: Number,
            required: true,
            default: 0,
            min: 0,
        },
        remaining: {
            type: Number,
            required: true,
            default: 1000,
            min: 0,
        },
        deadline: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        },
    },
    { timestamps: true }
);

const Finance = mongoose.model<IFinance>('Finance', financeSchema);
export default Finance;