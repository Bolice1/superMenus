import mongoose from "mongoose";

// we are going to define the items schema for the database for the restaurant where a restaurant admin can add new items depending on what they have or what they do not have , admin can update the item status as available or not available
const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['available', 'not available'],
    },
    restaurantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['breakfast', 'lunch', 'dinner', 'dessert', 'drink'],
    },
    image: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
    deletedAt: {
        type: Date,
        required: false,
    },
    isDeleted: {
        type: Boolean,
        required: false,
        default: false,
    },  
    isFeatured: {
        type: Boolean,
        required: false,
        default: false,
    },
    isPopular: {
        type: Boolean,
        required: false,
        default: false,
    },
    isNew: {
        type: Boolean,
        required: false,
        default: false,
    },
    isBestSeller: {
        type: Boolean,
        required: false,
        default: false,
    },  
});

const Item = mongoose.model('Item', itemSchema);
export default Item;