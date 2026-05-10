import express, { Router } from 'express';
import authRoutes from './auth.routes';
import customerRoutes from './customer.routes';
import restaurantRoutes from './restaurants.routes';
import restaurantAdminRoutes from './restaurantAdmin.routes';
import orderRoutes from './order.routes';
import itemRoutes from './items.routes';
import financeRoutes from './finance.routes';
import analyticsRoutes from './analytics.routes';
import systemManagementRoutes from './systemManagement.routes';

const router: Router = express.Router();

/**
 * API Routes Index
 * All application routes are mounted here
 */

// Authentication routes (backwards compatibility)
router.use('/auth', authRoutes);

// Customer routes
router.use('/customers', customerRoutes);

// Restaurant routes
router.use('/restaurants', restaurantRoutes);

// Restaurant Admin routes
router.use('/restaurant-admins', restaurantAdminRoutes);

// Order routes
router.use('/orders', orderRoutes);

// Item/Menu routes
router.use('/items', itemRoutes);

// Finance routes
router.use('/finance', financeRoutes);

// Analytics routes
router.use('/analytics', analyticsRoutes);

// System Management routes
router.use('/system-management', systemManagementRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ msg: 'API is healthy', timestamp: new Date() });
});

export default router;
