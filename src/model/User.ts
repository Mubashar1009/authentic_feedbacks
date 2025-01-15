import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

export interface Message extends Document {
  message: string;
  createdAt: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpire: Date;
  isVerified: boolean;
  isAcceptingMessage: boolean;
  messages: Message[];
}

export const MessageSchema: Schema<Message> = new Schema({
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

export const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Please enter a username"],
    unique: true,
    trime: true,
  },
  email: {
    type: String,
    required: [true, "Please enter a valid email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: { type: String, required: true },
  verifyCode: { type: String, required: true },
  verifyCodeExpire: {
    type: Date,
    required: [true, "Please Enter a Verify Code Expire Date"],
  },
  isVerified: { type: Boolean, default: false },
  isAcceptingMessage: { type: Boolean, default: true },
  messages: [MessageSchema],
});
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);
export default UserModel;
