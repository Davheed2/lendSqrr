import { authController } from '@/controllers';
import express from 'express';
import { protect } from '@/middlewares';

const router = express.Router();

router.post('/sign-up', authController.signUp);
router.post('/sign-in', authController.signIn);

router.use(protect);
router.post('/sign-out', authController.signOut);

export { router as authRouter };
