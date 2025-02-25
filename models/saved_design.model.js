import mongoose from "mongoose";

const savedschema = new mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      trim: true,
    },
    imageid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "images",
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
)

const save_design = mongoose.model("saved designs", savedschema);

export default save_design;