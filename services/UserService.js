import ErrorHandler from '../utils/errorHandler.js';
import UserModel from './../model/UserModel';

// Get user by ID
export const getUserById = async (id, res, next) => {
  try {
    
    const user = await UserModel.findById(id);

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};
