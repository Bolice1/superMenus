import mongoose from "mongoose";
import { email, string } from "zod";

const customerSchema = new mongoose.Schema({
    firstName: {
        type: string,
        required: true,
        unique: false
    },
    lastName: {
        type: string,
        required: true,
        unique: false
    },
    email:{
        type: email,
        required: true,
        unique: true
    },
    phoneNumber:{
        type: string,
        required: true,
        unique: true,
    }
});

const Customer = mongoose.model('Customer',customerSchema);
export default Customer;