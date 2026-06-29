import { timeStamp } from "console";
import mongoose from "mongoose";


const otpSchema =mongoose.Schema({
    email:{
        type:String,
        required:[true,"email is required"],
    },
    otpHash:{
        type:String,
        required:[true,"otp is required"],
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true,"user is required"],
    }
    
    
},{
    timeStamp:true
})
const Otp = mongoose.model("otp",otpSchema);
export default Otp;