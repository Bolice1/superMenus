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

router.post('/create', createFinanceRecord);

router.get('/list', getAllFinanceRecords);
router.get('/restaurant/:restaurantId', getFinanceByRestaurant);
router.get('/:financeId', getFinanceById);

router.put('/:financeId', updateFinanceRecord);

router.post('/:financeId/payment', markPaymentAsCompleted);

router.delete('/:financeId', deleteFinanceRecord);

export default router;
