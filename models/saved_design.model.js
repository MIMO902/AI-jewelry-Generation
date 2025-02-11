import mongoose from "mongoose";

const savedschema = new mongoose.Schema(
  {
userid:{
    type : String,
    required :true,
    trim:true,
},
imageid:{ 
    type:String,
    required :true,
    trim:true,
}
  },
  { timestamps: true }
)

const save_design = mongoose.model("saved designs", savedschema);

export default save_design;