import express, { Router } from 'express';
import {
    createItem,
    deleteItemById,
    deleteAllItems,
    updateItem
} from '../controllers/items.controllet';

const router: Router = express.Router();

// Create item
router.post('/create', createItem);

// Update item
router.put('/update', updateItem);

// Delete specific item
router.delete('/delete', deleteItemById);
router.delete('/delete/:itemId', deleteItemById);

// Delete all items (admin only)
router.delete('/delete-all', deleteAllItems);

export default router;
