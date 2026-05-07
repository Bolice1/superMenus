import mongoose from "mongoose";

// we are going to define the order schema for the database
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },

    orderDate: {
        type: Date,
        required: true,
        default: new Date()
    },
    orderTime: {
        type: Date,
        required: true,
    },
    orderItems: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'OrderItem',
        required: true,
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['pending', 'confirmed', 'delivered', 'cancelled'],
        default: "pending"
    },
});

const Order = mongoose.model('Order', orderSchema); 
export default Order;