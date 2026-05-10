import mongoose from "mongoose";
import { email, string } from "zod";

const customerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        unique: false
    },
    lastName: {
        type: String,
        required: true,
        unique: false
    },
    userName: {
        type: String,
        required: true,
        unique: true
    }
    ,
    email: {
        type: email,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: false,
    }
});

const Customer = mongoose.model('Customer', customerSchema);
export default Customer;