import mongoose from "mongoose";
import { email, string } from "zod";
// we are going to define the restaurant admin schema 

export const restaurantAdminSchema = new mongoose.Schema({
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
    email: {
        type: email,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: string,
        required: true,
        unique: true
    },
    restaurant: {

        name: [mongoose.Schema.Types.ObjectId],
        id: [mongoose.Schema.Types.ObjectId],
        website: [mongoose.Schema.Types.ObjectId],
        required: true,
        unique: true


    }

});

const RestaurantAdmin = mongoose.model('RestaurantAdmin',restaurantAdminSchema);

export default RestaurantAdmin;