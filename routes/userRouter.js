import express from 'express';
// import { isAuthentificated } from '../middleware/auth.js';
import { loginUser, registrationUser } from '../controllers/UserController.js';

const userRouter = express.Router();

userRouter.post('/register', registrationUser);
userRouter.post('/login', loginUser);

export default userRouter;
