import { Schema, model, Document, Types } from 'mongoose';

interface IHourlyMetric {
    hour: number;
    revenue: number;
    orderCount: number;
}

interface IPopularItem {
    menuItemId: Types.ObjectId;
    name: string;
    quantitySold: number;
    revenueGenerated: number;
}

interface ICustomerFeedback {
    averageRating: number;
    totalReviews: number;
    complaintCount: number;
}

export interface IRestaurantAnalytics extends Document {
    restaurantId: Types.ObjectId;
    date: Date;
    totalRevenue: number;
    averageOrderValue: number;
    taxCollected: number;
    tipsCollected: number;
    deliveryFeesCollected: number;

    totalOrders: number;
    completedOrders: number;
    cancelledOrders: number;
    refundedOrders: number;

    avgPreparationTimeMin: number;
    avgDeliveryTimeMin: number;

    hourlyPerformance: IHourlyMetric[];
    popularItems: IPopularItem[];
    customerFeedback: ICustomerFeedback;

    createdAt: Date;
    updatedAt: Date;
}

const RestaurantAnalyticsSchema = new Schema<IRestaurantAnalytics>(
    {
        restaurantId: {
            type: Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        totalRevenue: {
            type: Number,
            default: 0,
        },
        averageOrderValue: {
            type: Number,
            default: 0,
        },
        taxCollected: {
            type: Number,
            default: 0,
        },
        tipsCollected: {
            type: Number,
            default: 0,
        },
        deliveryFeesCollected: {
            type: Number,
            default: 0,
        },
        totalOrders: {
            type: Number,
            default: 0,
        },
        completedOrders: {
            type: Number,
            default: 0,
        },
        cancelledOrders: {
            type: Number,
            default: 0,
        },
        refundedOrders: {
            type: Number,
            default: 0,
        },
        avgPreparationTimeMin: {
            type: Number,
            default: 0,
        },
        avgDeliveryTimeMin: {
            type: Number,
            default: 0,
        },
        hourlyPerformance: [
            {
                hour: { type: Number, required: true, min: 0, max: 23 },
                revenue: { type: Number, default: 0 },
                orderCount: { type: Number, default: 0 },
            },
        ],
        popularItems: [
            {
                menuItemId: { type: Schema.Types.ObjectId, ref: 'MenuItem', required: true },
                name: { type: String, required: true },
                quantitySold: { type: Number, default: 0 },
                revenueGenerated: { type: Number, default: 0 },
            },
        ],
        customerFeedback: {
            averageRating: { type: Number, default: 0, min: 0, max: 5 },
            totalReviews: { type: Number, default: 0 },
            complaintCount: { type: Number, default: 0 },
        },
    },
    {
        timestamps: true,
    }
);

RestaurantAnalyticsSchema.index({ restaurantId: 1, date: -1 }, { unique: true });

export const RestaurantAnalytics = model<IRestaurantAnalytics>(
    'RestaurantAnalytics',
    RestaurantAnalyticsSchema
);