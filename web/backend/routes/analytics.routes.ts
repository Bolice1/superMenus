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

router.get('/restaurant/:restaurantId', getRestaurantAnalytics);

router.get('/restaurant/:restaurantId/today', getTodayAnalytics);

router.get('/restaurant/:restaurantId/month/:month/:year', getMonthlyAnalytics);

router.get('/restaurant/:restaurantId/popular-items', getPopularItems);

router.get('/restaurant/:restaurantId/hourly/:date', getHourlyPerformance);

router.get('/restaurant/:restaurantId/feedback', getCustomerFeedback);

router.get('/restaurant/:restaurantId/dashboard', getDashboardAnalytics);

export default router;
