import express, { Router } from 'express';
import {
    registerRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getAllRestaurants
} from '../controllers/auth.controller';

const router: Router = express.Router();

/**
 * AUTH ROUTES - Backwards compatibility
 * 
 * NOTE: Specific authentication operations have been moved to their respective controllers:
 * - Customer authentication: /customer/register, /customer/login
 * - Restaurant Admin authentication: /restaurant-admin/register, /restaurant-admin/login
 * - Restaurant CRUD: /restaurants endpoints
 * 
 * These routes are kept for backwards compatibility with existing code.
 */

// Restaurant routes (backwards compatibility)
router.post('/restaurant/register', registerRestaurant);
router.put('/restaurant/update', updateRestaurant);
router.delete('/restaurant/delete', deleteRestaurant);
router.get('/restaurants', getAllRestaurants);

export default router;
