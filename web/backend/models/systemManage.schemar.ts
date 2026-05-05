import mongoose from "mongoose";
import { string } from "zod";

export const managerSchema = new mongoose.Schema({

    firstName: {
        type: string,
        required: true,
        unique: true
    },
    lastName: {
        type: string,
        required: true,
        unique: true
    },
    email: {
        type: string,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: string,
        required: true,
        unique: true
    }

});

const Manager = mongoose.model('Manager',managerSchema);
export default Manager;