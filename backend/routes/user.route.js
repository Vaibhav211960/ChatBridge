import express from 'express';
import { signup, logIn, logOut, updateProfilePic } from '../controller/user.auth.js';
import { authUser } from '../middleware/auth.user.js';
import arcMiddleware from '../middleware/arcjet.middleware.js';

const router = express.Router();

// router.use(arcMiddleware)
// router.use(authUser)

router.post('/signup', signup);
router.post('/login', logIn);
router.post('/logout', authUser , logOut);
router.post('/update-profile' , authUser , updateProfilePic);

export default router;