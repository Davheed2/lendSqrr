import { protect } from '@/middlewares';
import { userController } from '@/controllers';
import express from 'express';

const router = express.Router();
router.use(protect);

router.get('/all', userController.getUsers);

export { router as userRouter };
