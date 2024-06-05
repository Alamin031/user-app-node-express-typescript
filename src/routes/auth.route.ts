import { Router } from 'express';
import * as authControler from '../controllers/auth.controllers';

const router = Router();

router.post('/register', authControler.signup);
router.post('/login', authControler.login);

router.post('/forgot-password', authControler.forgotPassword);
router.post('/reset-password', authControler.resetPassword);







export default router;
