import express, { Router } from 'express';
import {
    registerCustomer,
    loginCustomer,
    getCustomerProfile,
    updateCustomerProfile,
    changePassword,
    getAllCustomers,
    deleteCustomerAccount,
    getCustomerByUsername
} from '../controllers/customer.controller';

const router: Router = express.Router();

router.post('/register', registerCustomer);
router.post('/login', loginCustomer);

router.get('/profile/:customerId', getCustomerProfile);
router.put('/profile/:customerId', updateCustomerProfile);
router.post('/profile/:customerId/change-password', changePassword);

router.get('/list', getAllCustomers);
router.get('/username/:userName', getCustomerByUsername);

router.delete('/account/:customerId', deleteCustomerAccount);

export default router;
