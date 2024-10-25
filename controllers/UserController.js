import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import CatchAsync from '../middleware/catchAsyncError.js';
import ErrorHandler from '../utils/errorHandler.js';
import UserModel from '../model/UserModel.js';
import Joi from 'joi';
import dotenv from 'dotenv';
import { getUserById } from './../services/UserService.js';
dotenv.config();

// Register User
const Registerschema = Joi.object({
  username: Joi.string().required("username is required"),
  email: Joi.string().email().required("Email is required"),
  password: Joi.string().required("password is required"),
});
export const registrationUser = CatchAsync(async (req, res, next) => {
  try {

    const { error, value } = Registerschema.validate(req.body);
    if (error) {
      return next(new ErrorHandler(error.details[0].message, 422));
    }

    const isEmailExist = await UserModel.findOne({ email: value.email });
    if (isEmailExist) {
      return next(new ErrorHandler("Email Already Exist", 400));
    }

    try {
      // Note : bcrypt funtion you will find inside usermodel.
      const user = await UserModel.create({
        email: value.email,
        username: value.username,
        password: value.password
      });
      res.send({
        status: 200,
        success: true,
        message: "User created successfully"
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 400));
    }
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Login user
const Loginschema = Joi.object({
  email: Joi.string().email().required("Email is required"),
  password: Joi.string().required("password is required"),
});
export const loginUser = CatchAsync(async (req, res, next) => {
  try {

    const { error, value } = Loginschema.validate(req.body);
    if (error) {
      return next(new ErrorHandler(error.details[0].message, 422));
    }


    const user = await UserModel.findOne({ email: value.email }).select("+password");
    if (!user) {
      return next(new ErrorHandler("Invlalid email and password", 400));
    }

    const isPasswordMatch = await user.comparePassword(value.password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invlalid email and password", 400));
    }

    const payload = {
      user: {
        id: user._id,
      },
    };
    const authToken = jwt.sign(payload, process.env.JWTSECRET);
    res.status(200).send({
      success: "true",
      token: authToken,
      userId: user._id,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
})

export const getUserInfo = CatchAsync(async (req, res, next) => {
  try {

    const userId = req.user.id;
    console.log(req.user)
    getUserById(userId, res, next);

  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
})

const updateUserSchema = Joi.object({
  username: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  OldPassword: Joi.string().min(6),
  NewPassword: Joi.string().min(6),
}).or('username', 'email', 'OldPassword', 'NewPassword');

export const updateUserInfo = CatchAsync(async (req, res, next) => {
  try {
    const { error, value } = updateUserSchema.validate(req.body);
    if (error) {
      return next(new ErrorHandler(error.details[0].message, 422));
    }

    const { username, email, OldPassword, NewPassword } = value;
    const user = await UserModel.findById(req.user.id).select("+password");
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;

    if (OldPassword && NewPassword) {
      const isPasswordMatch = await user.comparePassword(OldPassword);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invlalid Old password", 400));
      }
      // Hash the new password before saving
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(NewPassword, salt);
    }
    await UserModel.findByIdAndUpdate(req.user.id, updateFields, { new: true, runValidators: true });
    res.status(200).send({
      success: "true"
    });
  } catch (error) {
    console.log(error)
    return next(new ErrorHandler(error.message, 400));
  }
})