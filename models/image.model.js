import mongoose from "mongoose";

const imageschema = new mongoose.Schema(
  {
imagePath:{
    type : String,
    required :true,
},
prompt:{ 
    type:String,
    required :true,
}
  },
  { timestamps: true }
)

const image = mongoose.model("images", imageschema);

export default image;