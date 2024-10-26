import mongoose from 'mongoose';
import ErrorHandler from '../utils/errorHandler.js';
import UserModel from './../model/UserModel.js';

// Get user by ID
export const getUserById = async(id, res, next) => {
  try {
    
    // const user = await UserModel.findById(id);
    const user = await UserModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "userdescps",        
          localField: "email",       
          foreignField: "email",    
          as: "userdescps",
        },
      },
      {
        $unwind : "$userdescps"
      },
      {
        $project : {
          "_id" : 1,
          "username" : 1,
          "email" : 1,
          "description" : "$userdescps.description"
        }
      }
    ]);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    res.status(200).json({
      success: true,
      user : user[0],
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
};
