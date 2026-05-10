import express, { Router } from 'express';
import {
    registerRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    toggleRestaurantStatus,
    getActiveRestaurants,
    searchRestaurants,
    getRestaurantStats
} from '../controllers/restaurant.controller';

const router: Router = express.Router();

router.post('/register', registerRestaurant);

router.get('/list', getAllRestaurants);
router.get('/active', getActiveRestaurants);
router.get('/stats', getRestaurantStats);
router.get('/search', searchRestaurants);
router.get('/:restaurantId', getRestaurantById);

router.put('/:restaurantId', updateRestaurant);

router.patch('/:restaurantId/status', toggleRestaurantStatus);

router.delete('/:restaurantId', deleteRestaurant);

export default router;
