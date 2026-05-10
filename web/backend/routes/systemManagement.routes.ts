import express, { Router } from 'express';
import {
    createSystemManager,
    loginSystemManager,
    getManagerProfile,
    updateManagerProfile,
    changeManagerPassword,
    getAllManagers,
    deleteSystemManager,
    updateManagerRole
} from '../controllers/systemManagement.controller';

const router: Router = express.Router();

// Authentication routes
router.post('/register', createSystemManager);
router.post('/login', loginSystemManager);

// Profile management
router.get('/profile/:managerId', getManagerProfile);
router.put('/profile/:managerId', updateManagerProfile);
router.post('/profile/:managerId/change-password', changeManagerPassword);

// Get all managers
router.get('/list', getAllManagers);

// Update manager role (admin only)
router.patch('/:managerId/role', updateManagerRole);

// Delete manager
router.delete('/:managerId', deleteSystemManager);

export default router;
