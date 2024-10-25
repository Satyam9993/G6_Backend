import express from 'express';
// import { isAuthentificated } from '../middleware/auth.js';
import { loginUser, registrationUser, getUserInfo } from '../controllers/UserController.js';
import isAuthentificated from '../middleware/Auth.js';

const userRouter = express.Router();

userRouter.post('/register', registrationUser);
userRouter.post('/login', loginUser);


// Authenticate routes
userRouter.get('/info', isAuthentificated, getUserInfo);

export default userRouter;
