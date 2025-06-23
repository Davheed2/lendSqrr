import { protect } from '@/middlewares';
import { walletController } from '@/controllers';
import express from 'express';

const router = express.Router();
router.use(protect);

router.post('/fund', walletController.fundWallet);
router.post('/transfer', walletController.transferMoneyToUser);
router.post('/withdraw', walletController.withdrawFunds);

export { router as walletRouter };
