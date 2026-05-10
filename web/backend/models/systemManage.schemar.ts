import mongoose, { Document, Schema } from "mongoose";

export interface ISystemManager extends Document {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}

export const managerSchema = new Schema<ISystemManager>(
    {
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: /.+\@.+\..+/,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        role: {
            type: String,
            required: true,
            enum: ['admin', 'manager', 'support'],
            default: 'manager',
        },
    },
    { timestamps: true }
);

const Manager = mongoose.model<ISystemManager>('Manager', managerSchema);
export default Manager;