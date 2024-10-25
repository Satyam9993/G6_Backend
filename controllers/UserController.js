import jwt from 'jsonwebtoken';
import CatchAsync from '../middleware/catchAsyncError.js';
import ErrorHandler from '../utils/errorHandler.js';
import UserModel from '../model/UserModel.js';
import Joi from 'joi';
// import dotenv from 'dotenv';
// dotenv.config();

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
    const isEmailExist = await UserModel.findOne({ email : value.email });

    if (isEmailExist) {
      return next(new ErrorHandler("Email Already Exist", 400));
    }

    try {
      // Note : bcrypt funtion you will find inside usermodel.
      const user = await UserModel.create({
        email : value.email,
        username : value.username,
        password : value.password
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
    console.log(process.env.JWT_SECRET);
    const authToken = jwt.sign(payload, process.env.JWT_SECRET);
    res.status(200).send({
      success: "true",
      token: authToken,
      userId: user._id,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
})
