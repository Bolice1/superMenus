import express, { Router } from 'express';
import {
    takeAnOrder,
    orderStatus,
    deleteAnOrder,
    getOrderById,
    updateOrderById,
    deleteOrdersAutomatically
} from '../controllers/order.controller';

const router: Router = express.Router();

// Create a new order
router.post('/create', takeAnOrder);

// Get order by ID
router.get('/get/:orderId', getOrderById);
router.post('/get', getOrderById);

// Update order status
router.patch('/status', orderStatus);

// Update order details
router.put('/update', updateOrderById);

// Delete specific order
router.delete('/delete', deleteAnOrder);

// Delete old orders (automatic cleanup)
router.delete('/cleanup/auto', deleteOrdersAutomatically);

export default router;
