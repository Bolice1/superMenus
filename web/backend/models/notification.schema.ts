import mongoose, { mongo } from "mongoose";
import { boolean } from "zod";

export const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true
    },
    sentTo: {
        name: [mongoose.Schema.Types.ObjectId],
        id: [mongoose.Schema.Types.ObjectId]
    },
    dateSent: {
        type: Date,
        default: new Date(),
        required: true
    },
    sent:{
        type: boolean,
        required: true,
        default: true
    },
    keyMessage: {
        type: String,
        required: true,
        unique: false
    }
})

const Notification = mongoose.model('Notification',notificationSchema);
export default Notification;