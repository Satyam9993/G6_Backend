import express from 'express';
import { loginUser, registrationUser, getUserInfo, updateUserInfo } from '../controllers/UserController.js';
import isAuthentificated from '../middleware/Auth.js';

const userRouter = express.Router();

userRouter.post('/register', registrationUser);
userRouter.post('/login', loginUser);


// Authenticate routes
userRouter.get('/getuserinfo', isAuthentificated, getUserInfo);
userRouter.put('/updateuserinfo', isAuthentificated, updateUserInfo);

export default userRouter;
