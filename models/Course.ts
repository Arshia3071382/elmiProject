import mongoose from "mongoose";


const courseSchema = new mongoose.Schema({
    name: {
        type : String ,
        required : [true , "نام دوره الزامی است"] ,
        trim : true ,

    },
    category:{
        type : mongoose.Schema.Types.ObjectId ,
        ref :'Category' ,
        required : [true , " گروه دوره الزامی است"]

    },
    createdAt: {
    type: Date,
    default: Date.now,
  },
  updateAt:{
    type : Date , 
    default : Date.now
  }
})

export default mongoose.models.Course || mongoose.model('Course' , courseSchema)