import mongoose from "mongoose";
import { string } from "zod";

export const managerSchema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        unique: true
    },
    lastName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    }

});

const Manager = mongoose.model('Manager',managerSchema);
export default Manager;