import express from 'express';
import { signup, logIn, logOut, updateProfilePic } from '../controller/user.auth.js';
import { authUser } from '../middleware/auth.user.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', logIn);
router.post('/logout', logOut);

router.post('/update-profile', authUser , updateProfilePic);

export default router;