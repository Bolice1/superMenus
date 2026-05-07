import mongoose from "mongoose";
import { email, string } from "zod";
// we are going to define the restaurant admin schema 

export const restaurantAdminSchema = new mongoose.Schema({
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
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    restaurant: {

        name: { type: [mongoose.Schema.Types.ObjectId], ref: 'Restaurant' },
        id: { type: [mongoose.Schema.Types.ObjectId], ref: 'Restaurant' },
        website: { type: [mongoose.Schema.Types.ObjectId], ref: 'Restaurant' },
        required: true,
        unique: true


    }

});

const RestaurantAdmin = mongoose.model('RestaurantAdmin', restaurantAdminSchema);

export default RestaurantAdmin;