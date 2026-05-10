import express, { Router } from 'express';
import {
    createFinanceRecord,
    getAllFinanceRecords,
    getFinanceByRestaurant,
    getFinanceById,
    updateFinanceRecord,
    markPaymentAsCompleted,
    deleteFinanceRecord
} from '../controllers/finance.controller';

const router: Router = express.Router();

// Create finance record
router.post('/create', createFinanceRecord);

// Get finance records
router.get('/list', getAllFinanceRecords);
router.get('/restaurant/:restaurantId', getFinanceByRestaurant);
router.get('/:financeId', getFinanceById);

// Update finance record
router.put('/:financeId', updateFinanceRecord);

// Mark payment as completed
router.post('/:financeId/payment', markPaymentAsCompleted);

// Delete finance record
router.delete('/:financeId', deleteFinanceRecord);

export default router;
