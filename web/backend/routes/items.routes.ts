import express, { Router } from 'express';
import {
    createItem,
    deleteItemById,
    deleteAllItems,
    updateItem,
    listItemsByRestaurant,
} from '../controllers/items.controllet';

const router: Router = express.Router();

router.get('/restaurant/:restaurantId', listItemsByRestaurant);

router.post('/create', createItem);

router.put('/update', updateItem);

router.delete('/delete', deleteItemById);
router.delete('/delete/:itemId', deleteItemById);

router.delete('/delete-all', deleteAllItems);

export default router;
