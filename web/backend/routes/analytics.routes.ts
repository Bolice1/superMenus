import express, { Router } from 'express';
import {
    getRestaurantAnalytics,
    getTodayAnalytics,
    getMonthlyAnalytics,
    getPopularItems,
    getHourlyPerformance,
    getCustomerFeedback,
    getDashboardAnalytics
} from '../controllers/analyticsController';

const router: Router = express.Router();

// Get analytics for a restaurant
router.get('/restaurant/:restaurantId', getRestaurantAnalytics);

// Get today's analytics
router.get('/restaurant/:restaurantId/today', getTodayAnalytics);

// Get monthly analytics
router.get('/restaurant/:restaurantId/month/:month/:year', getMonthlyAnalytics);

// Get popular items
router.get('/restaurant/:restaurantId/popular-items', getPopularItems);

// Get hourly performance
router.get('/restaurant/:restaurantId/hourly/:date', getHourlyPerformance);

// Get customer feedback
router.get('/restaurant/:restaurantId/feedback', getCustomerFeedback);

// Get dashboard analytics
router.get('/restaurant/:restaurantId/dashboard', getDashboardAnalytics);

export default router;
