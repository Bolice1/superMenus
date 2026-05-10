import express, { Router } from 'express';
import {
    registerRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getAllRestaurants
} from '../controllers/auth.controller';

const router: Router = express.Router();


router.post('/restaurant/register', registerRestaurant);
router.put('/restaurant/update', updateRestaurant);
router.delete('/restaurant/delete', deleteRestaurant);
router.get('/restaurants', getAllRestaurants);

export default router;
