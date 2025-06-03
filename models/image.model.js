import mongoose from "mongoose";
import { type } from "os";

const imageschema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true
    },
    imageData: {
      type: String,
      required: true,
    },
    prompt: {
      type: String,
      required: true,
    },
    signature: {
      type: String,
      required: true,
    },
    isSaved: {
      type: Boolean,
      required: true,
    },
    wieght: {
      type: mongoose.Types.Decimal128,
      required: true,
    },
    price: {
      type: mongoose.Types.Decimal128,
      required: true
    },
    rate: {
      type: mongoose.Types.Decimal128,
      required: true
    },
    description:{
      type: String,
      require:false
    },
    clip_des:{
      type: String,
      require:false
    }
  },
  { timestamps: true }
)

const image = mongoose.model("images", imageschema);

export default image;