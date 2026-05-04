import mongoose from 'mongoose';

// we are going to define the restaurant schema for the database
const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    emailAddress: {
        type: String,
        required: true,
    },
    website: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    logo: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
        required: true,
    },
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;