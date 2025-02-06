import mongoose from "mongoose";
import bcrypt from "bcrypt";

const SALT_WORK_FACTOR = 10;

const user = new mongoose.Schema(
  {
    firstname :{
      type:String,
      required:false
    },
    lastname :{
      type:String,
      required:false,
    },
    username: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/^[a-zA-Z0-9]+$/, "is invalid"],
      index: true,
    },
    email: {
      type: String,
      lowercase: true,
      unique: true,
      required: [true, "can't be blank"],
      match: [/\S+@\S+\.\S+/, "is invalid"],
      index: true,
    },
    password: String,
    type: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", user);

export default User;