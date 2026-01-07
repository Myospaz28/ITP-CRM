// routes/authRoutes.js
import express from 'express';
import { signIn, checkSession ,logout, getUserRole , getUserName, sendForgetPasswordOtp, resetPasswordWithOtp} from '../controllers/authController.js';

const router = express.Router();


router.get('/check-session', checkSession);

router.post('/signin', signIn);

router.post('/logout', logout);

router.get('/get-role', getUserRole);

router.get('/get-name', getUserName);

router.post('/forget-password/send-otp', sendForgetPasswordOtp);

router.post('/forget-password/reset', resetPasswordWithOtp);



export default router;
