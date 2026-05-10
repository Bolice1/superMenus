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

router.post('/create', takeAnOrder);

router.get('/get/:orderId', getOrderById);
router.post('/get', getOrderById);

router.patch('/status', orderStatus);

router.put('/update', updateOrderById);

router.delete('/delete', deleteAnOrder);

router.delete('/cleanup/auto', deleteOrdersAutomatically);

export default router;
