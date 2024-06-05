import { Router } from 'express';
import * as userController from '../controllers/user.controller';

const router = Router();

router.get('/', userController.getUserProfile);
router.get('/getUserProfile', userController.getUserProfile);
router.put('/updateUserProfile/:id', userController.updateUserProfile);
router.delete('/deleteUser/:id', userController.deleteUser);


export default router;
