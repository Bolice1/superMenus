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



router.use('/auth', authRoutes);

router.use('/customers', customerRoutes);

router.use('/restaurants', restaurantRoutes);

router.use('/restaurant-admins', restaurantAdminRoutes);

router.use('/orders', orderRoutes);

router.use('/items', itemRoutes);

router.use('/finance', financeRoutes);

router.use('/analytics', analyticsRoutes);

router.use('/system-management', systemManagementRoutes);

router.get('/health', (req, res) => {
    res.status(200).json({ msg: 'API is healthy', timestamp: new Date() });
});

export default router;
