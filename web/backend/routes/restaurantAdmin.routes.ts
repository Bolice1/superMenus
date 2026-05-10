import express, { Router } from 'express';
import {
    createRestaurantAdmin,
    loginRestaurantAdmin,
    getAdminProfile,
    updateAdminProfile,
    changeAdminPassword,
    getRestaurantAdmins,
    deleteRestaurantAdmin,
    getAllRestaurantAdmins
} from '../controllers/restaurantAdmin.controller';

const router: Router = express.Router();

// Authentication routes
router.post('/register', createRestaurantAdmin);
router.post('/login', loginRestaurantAdmin);

// Profile management
router.get('/profile/:adminId', getAdminProfile);
router.put('/profile/:adminId', updateAdminProfile);
router.post('/profile/:adminId/change-password', changeAdminPassword);

// Get admins
router.get('/restaurant/:restaurantId', getRestaurantAdmins);
router.get('/list/all', getAllRestaurantAdmins);

// Delete admin
router.delete('/:adminId', deleteRestaurantAdmin);

export default router;
