import { Router } from 'express';
import AuthController from '../app/controllers/AuthController';


const authRoutes = new Router();

authRoutes.post('/authenticate', AuthController.authenticate);
authRoutes.post('/recovery-password', AuthController.recoveryPassword);
authRoutes.put('/reset-password/:token', AuthController.resetPassword);

export default authRoutes;
