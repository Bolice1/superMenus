import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IOrder extends Document {
    userId: Types.ObjectId;
    restaurantId: Types.ObjectId;
    totalAmount: number;
    orderItems: Types.ObjectId[];
    orderStatus: 'pending' | 'confirmed' | 'delivered' | 'cancelled';
    deliveredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
    timestamps: Date;

}

const orderSchema = new Schema<IOrder>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'Customer',
            required: true,
            index: true,
        },
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
            index: true,
        },
        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },
        orderItems: {
            type: [{ type: Schema.Types.ObjectId, ref: 'Item' }],
            required: true,
        },
        orderStatus: {
            type: String,
            required: true,
            enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
            default: 'pending',
            index: true,
        },
        deliveredAt: {
            type: Date,
            index: true,
        },
    },
    { timestamps: true }
);

orderSchema.index({ orderStatus: 1, deliveredAt: 1 });

const Order = mongoose.model<IOrder>('Order', orderSchema);
export default Order;