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

router.post('/register', createSystemManager);
router.post('/login', loginSystemManager);

router.get('/profile/:managerId', getManagerProfile);
router.put('/profile/:managerId', updateManagerProfile);
router.post('/profile/:managerId/change-password', changeManagerPassword);

router.get('/list', getAllManagers);

router.patch('/:managerId/role', updateManagerRole);

router.delete('/:managerId', deleteSystemManager);

export default router;
