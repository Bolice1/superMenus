import { Request, Response } from 'express';
import { RestaurantAnalytics } from '../models/analytics.schema';
import Restaurant from '../models/restaurant.schema';


export const getRestaurantAnalytics = async (req: Request, res: Response) => {
    try {
        const { restaurantId } = req.params;
        const { startDate, endDate } = req.query;

        if (!restaurantId) {
            return res.status(400).json({ msg: "Restaurant ID is required" });
        }

        const restaurantExists = await Restaurant.findById(restaurantId);
        if (!restaurantExists) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        let query: any = { restaurantId };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                query.date.$gte = new Date(startDate as string);
            }
            if (endDate) {
                query.date.$lte = new Date(endDate as string);
            }
        }

        const analytics = await RestaurantAnalytics.find(query)
            .populate('restaurantId', 'name emailAddress')
            .sort({ date: -1 });

        if (analytics.length === 0) {
            return res.status(200).json({ msg: "No analytics data found", analytics: [] });
        }

        return res.status(200).json({ analytics });
    } catch (error) {
        console.error(`Error in getRestaurantAnalytics: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching analytics" });
    }
};


export const getTodayAnalytics = async (req: Request, res: Response) => {
    try {
        const { restaurantId } = req.params;

        if (!restaurantId) {
            return res.status(400).json({ msg: "Restaurant ID is required" });
        }

        const restaurantExists = await Restaurant.findById(restaurantId);
        if (!restaurantExists) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const analytics = await RestaurantAnalytics.findOne({
            restaurantId,
            date: { $gte: today, $lt: tomorrow },
        }).populate('restaurantId', 'name emailAddress');

        if (!analytics) {
            return res.status(200).json({ msg: "No analytics data found for today", analytics: null });
        }

        return res.status(200).json({ analytics });
    } catch (error) {
        console.error(`Error in getTodayAnalytics: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching today's analytics" });
    }
};


export const getMonthlyAnalytics = async (req: Request, res: Response) => {
    try {
        const { restaurantId, month, year } = req.params;

        if (!restaurantId || !month || !year) {
            return res.status(400).json({ msg: "Restaurant ID, month, and year are required" });
        }

        const restaurantExists = await Restaurant.findById(restaurantId);
        if (!restaurantExists) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        const monthNum = parseInt(month as string) - 1;
        const yearNum = parseInt(year as string);

        const startDate = new Date(yearNum, monthNum, 1);
        const endDate = new Date(yearNum, monthNum + 1, 0);

        const analytics = await RestaurantAnalytics.find({
            restaurantId,
            date: { $gte: startDate, $lte: endDate },
        })
            .populate('restaurantId', 'name emailAddress')
            .sort({ date: 1 });

        if (analytics.length === 0) {
            return res.status(200).json({ msg: "No analytics data found for the specified month", analytics: [] });
        }

        let totalRevenue = 0;
        let totalOrders = 0;
        let completedOrders = 0;
        let cancelledOrders = 0;
        let totalTaxCollected = 0;
        let totalTipsCollected = 0;

        analytics.forEach((day) => {
            totalRevenue += day.totalRevenue || 0;
            totalOrders += day.totalOrders || 0;
            completedOrders += day.completedOrders || 0;
            cancelledOrders += day.cancelledOrders || 0;
            totalTaxCollected += day.taxCollected || 0;
            totalTipsCollected += day.tipsCollected || 0;
        });

        const summary = {
            month: monthNum + 1,
            year: yearNum,
            totalRevenue,
            totalOrders,
            completedOrders,
            cancelledOrders,
            totalTaxCollected,
            totalTipsCollected,
            averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
            dailyDetails: analytics,
        };

        return res.status(200).json({ summary });
    } catch (error) {
        console.error(`Error in getMonthlyAnalytics: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching monthly analytics" });
    }
};


export const getPopularItems = async (req: Request, res: Response) => {
    try {
        const { restaurantId } = req.params;
        const { limit = 10 } = req.query;

        if (!restaurantId) {
            return res.status(400).json({ msg: "Restaurant ID is required" });
        }

        const restaurantExists = await Restaurant.findById(restaurantId);
        if (!restaurantExists) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        const analytics = await RestaurantAnalytics.find({ restaurantId })
            .populate('restaurantId', 'name emailAddress')
            .sort({ date: -1 })
            .limit(30);  
        const itemMap = new Map();

        analytics.forEach((day) => {
            day.popularItems?.forEach((item: any) => {
                const existingItem = itemMap.get(item.menuItemId.toString());
                if (existingItem) {
                    existingItem.quantitySold += item.quantitySold;
                    existingItem.revenueGenerated += item.revenueGenerated;
                } else {
                    itemMap.set(item.menuItemId.toString(), {
                        menuItemId: item.menuItemId,
                        name: item.name,
                        quantitySold: item.quantitySold,
                        revenueGenerated: item.revenueGenerated,
                    });
                }
            });
        });

        const popularItems = Array.from(itemMap.values())
            .sort((a, b) => b.quantitySold - a.quantitySold)
            .slice(0, parseInt(limit as string));

        return res.status(200).json({ popularItems });
    } catch (error) {
        console.error(`Error in getPopularItems: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching popular items" });
    }
};


export const getHourlyPerformance = async (req: Request, res: Response) => {
    try {
        const { restaurantId, date } = req.params;

        if (!restaurantId || !date) {
            return res.status(400).json({ msg: "Restaurant ID and date are required" });
        }

        const restaurantExists = await Restaurant.findById(restaurantId);
        if (!restaurantExists) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        const queryDate = new Date(date as string);
        queryDate.setUTCHours(0, 0, 0, 0);

        const analytics = await RestaurantAnalytics.findOne({
            restaurantId,
            date: queryDate,
        }).populate('restaurantId', 'name emailAddress');

        if (!analytics || !analytics.hourlyPerformance) {
            return res.status(200).json({ msg: "No hourly performance data found", hourlyData: [] });
        }

        return res.status(200).json({ hourlyData: analytics.hourlyPerformance });
    } catch (error) {
        console.error(`Error in getHourlyPerformance: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching hourly performance" });
    }
};


export const getCustomerFeedback = async (req: Request, res: Response) => {
    try {
        const { restaurantId } = req.params;
        const { startDate, endDate } = req.query;

        if (!restaurantId) {
            return res.status(400).json({ msg: "Restaurant ID is required" });
        }

        const restaurantExists = await Restaurant.findById(restaurantId);
        if (!restaurantExists) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        let query: any = { restaurantId };

        if (startDate || endDate) {
            query.date = {};
            if (startDate) {
                query.date.$gte = new Date(startDate as string);
            }
            if (endDate) {
                query.date.$lte = new Date(endDate as string);
            }
        }

        const analytics = await RestaurantAnalytics.find(query, { customerFeedback: 1, date: 1 })
            .sort({ date: -1 });

        if (analytics.length === 0) {
            return res.status(200).json({ msg: "No feedback data found", feedback: [] });
        }

        let totalRating = 0;
        let totalReviews = 0;
        let totalComplaints = 0;
        let count = 0;

        analytics.forEach((record) => {
            if (record.customerFeedback) {
                totalRating += record.customerFeedback.averageRating || 0;
                totalReviews += record.customerFeedback.totalReviews || 0;
                totalComplaints += record.customerFeedback.complaintCount || 0;
                count++;
            }
        });

        const aggregatedFeedback = {
            averageRating: count > 0 ? totalRating / count : 0,
            totalReviews,
            totalComplaints,
            dailyFeedback: analytics,
        };

        return res.status(200).json({ feedback: aggregatedFeedback });
    } catch (error) {
        console.error(`Error in getCustomerFeedback: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching customer feedback" });
    }
};


export const getDashboardAnalytics = async (req: Request, res: Response) => {
    try {
        const { restaurantId } = req.params;

        if (!restaurantId) {
            return res.status(400).json({ msg: "Restaurant ID is required" });
        }

        const restaurantExists = await Restaurant.findById(restaurantId);
        if (!restaurantExists) {
            return res.status(404).json({ msg: "Restaurant not found" });
        }

        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const lastThirtyDays = new Date(today);
        lastThirtyDays.setDate(lastThirtyDays.getDate() - 30);

        const todayAnalytics = await RestaurantAnalytics.findOne({
            restaurantId,
            date: { $gte: today },
        });

        const thirtyDaysAnalytics = await RestaurantAnalytics.find({
            restaurantId,
            date: { $gte: lastThirtyDays },
        }).sort({ date: -1 });

        let totalRevenue = 0;
        let totalOrders = 0;
        let completedOrders = 0;
        let cancelledOrders = 0;

        thirtyDaysAnalytics.forEach((record) => {
            totalRevenue += record.totalRevenue || 0;
            totalOrders += record.totalOrders || 0;
            completedOrders += record.completedOrders || 0;
            cancelledOrders += record.cancelledOrders || 0;
        });

        const dashboard = {
            today: todayAnalytics || null,
            lastThirtyDays: {
                totalRevenue,
                totalOrders,
                completedOrders,
                cancelledOrders,
                averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
                successRate: totalOrders > 0 ? (completedOrders / totalOrders) * 100 : 0,
            },
            restaurantName: restaurantExists.name,
        };

        return res.status(200).json({ dashboard });
    } catch (error) {
        console.error(`Error in getDashboardAnalytics: ${error}`);
        return res.status(500).json({ msg: "Something went wrong while fetching dashboard analytics" });
    }
};
