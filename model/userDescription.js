import mongoose from 'mongoose';

const { Schema } = mongoose;

const userDescriptionSchema = new Schema({
  description: {
    type: String,
    default : "Write your description here."
  },
  email: {
    type: String,
    index: true,
    unique: true,
    required: [true, "email is required"],
    validate: {
      validator(value) {
        const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return regex.test(value);
      },
      message: "Please write correct email",
    },
  },
}, { timestamps: true });

const UserDescModel = mongoose.model('UserDescp', userDescriptionSchema);
export default UserDescModel;