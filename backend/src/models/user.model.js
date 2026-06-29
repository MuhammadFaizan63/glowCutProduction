import mongoose from "mongoose";



const userSchema =mongoose.Schema({
    userName:{
        type:String,
        required:[true,"user name is required"],
        unique:[true,"user name is already taken"],
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:[true,"email is already taken"],
    },
    password:{
        type:String,
        required:true,
    },
    Verified:{
        type:Boolean,
        default:false,
    },
})


const User = mongoose.model("User",userSchema);

export default User;