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

// Register new restaurant
router.post('/register', registerRestaurant);

// Get restaurants
router.get('/list', getAllRestaurants);
router.get('/active', getActiveRestaurants);
router.get('/stats', getRestaurantStats);
router.get('/search', searchRestaurants);
router.get('/:restaurantId', getRestaurantById);

// Update restaurant
router.put('/:restaurantId', updateRestaurant);

// Toggle restaurant status
router.patch('/:restaurantId/status', toggleRestaurantStatus);

// Delete restaurant
router.delete('/:restaurantId', deleteRestaurant);

export default router;
