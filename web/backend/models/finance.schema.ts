import mongoose from "mongoose";
import strict from "node:assert/strict";
import { any, boolean, number } from "zod";

export const financeSchema = new mongoose.Schema({
    restaurantId: {
        type: [mongoose.Schema.Types.ObjectId],

    },
    restaurantAdmin: {
        type: [mongoose.Schema.Types.ObjectId]
    },
    paymentStatus: {
        type: Boolean,
        required: true,
        default: false,
        unique: false

    },
    paid: {
        type: Number,
        required: true,
        default: 0,
        unique: false
    },
    remaining: {
        type: Number,
        required: true,
        unique: false,
        default: 1000,

    },
    deadline: {
        type: Date,
        required: false,
        unique: false,
        default: new Date()

    }




});

const Finance = mongoose.model('Finance', financeSchema);
export default Finance;