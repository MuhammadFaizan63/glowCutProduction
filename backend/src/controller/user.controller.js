import UserModel from "../models/user.model.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import SessionModel from "../models/session.model.js";
import { sendEmail } from "../services/email.service.js";
import {generateOtp,getOtpHtml} from "../utils/utils.js";
import OtpModel from "../models/otp.modle.js";
export const register = async (req, res) => {
  try {
    const { userName, email, password } = req.body;

    // 🔴 Validation (important)
    if (!userName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 🔍 Check existing user
    const isAlreadyRegister = await UserModel.findOne({
      $or: [{ userName }, { email }],
    });

    if (isAlreadyRegister) {
      return res.status(409).json({
        success: false,
        message: "User already registered",
      });
    }

    // 🔐 Hash Password (safe)
    const hashPassword = crypto
      .createHash("sha256")
      .update(password.toString())
      .digest("hex");

    // 👤 Create User
    const user = await UserModel.create({
      userName,
      email,
      password: hashPassword,
    });

    // 🔢 Generate OTP
    const otp = generateOtp();

    // 🎨 Generate HTML Email
    const htmlOtp = getOtpHtml(otp);

    // 🔐 Hash OTP (IMPORTANT FIX)
    const otpHashed = crypto
      .createHash("sha256")
      .update(otp.toString())
      .digest("hex");

    // 💾 Save OTP in DB
    await OtpModel.create({
      email,
      otpHash: otpHashed,
      user: user._id,
    });

    // 📧 Send Email (🔥 MAIN FIX HERE)
    await sendEmail(email, "OTP Verification", htmlOtp);

    // ✅ Response
    res.status(201).json({
      success: true,
      message: "User registered successfully. OTP sent to email.",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export const login =async(req,res)=>{
const {email,password} = req.body
const findUser =await UserModel.findOne({
    email,
})
if(!findUser){
    return res.status(404).json({
        success:false,
        message:"invalid email or password",
    })
}
if(!findUser.Verified){
    return res.status(401).json({
        success:false,
        message:"email is not verified",
    })
}
const hashPassword = crypto.createHash('sha256').update(password).digest('hex');
if(findUser.password !== hashPassword){
    return res.status(404).json({
        success:false,
        message:"invalid email or password",
    })
}
const REFRESHtOKEN = jwt.sign({
    id: findUser._id,

}, config.JWT_SECRET, {
    expiresIn: "7d",
})
const refreshTokenHash = crypto.createHash('sha256').update(REFRESHtOKEN).digest('hex');
const session = await SessionModel.create({
    userId: findUser._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers['user-agent'],
})
const accessToken = jwt.sign({
    id: findUser._id,
    sessionId: session._id,
}, config.JWT_SECRET, {
    expiresIn: "15m",
})


res.cookie("REFRESHtOKEN", REFRESHtOKEN, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
})

res.status(201).json({
    success: true,
    message: "user login successfully",
    user: {
        id: findUser._id,
        userName: findUser.userName,
        email: findUser.email,
    },
    accessToken,
})
}
export const refreshToken =async(req,res)=>{
    const rfToken =req.cookies.REFRESHtOKEN
    console.log(rfToken);

    if(!rfToken){
        res.status(400).json({
            message:"refresh token is required",
            success:false,
        })
    }
    const decoded =jwt.verify(rfToken,config.JWT_SECRET)
        const refreshTokenHash = crypto.createHash('sha256').update(rfToken).digest('hex');
    const session = await SessionModel.findOne({
        refreshTokenHash,
        revoked:false,
    })
    if(!session){
        res.status(404).json({
            message:"invalid refresh token",
            success:false,
        })
    }
const acessToken =jwt.sign({
    id:decoded.id
},config.JWT_SECRET,{
    expiresIn:"15m",
})
    const newRefreshToken = jwt.sign({
        id: decoded.id,

    }, config.JWT_SECRET, {
        expiresIn: "7d",
    })
        const newRefreshTokenHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    session.refreshTokenHash = newRefreshTokenHash
    await session.save()
    res.cookie("REFRESHtOKEN", newRefreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })
res.status(200).json({
    success:true,
    message:"access token generated successfully",
    acessToken,
})
}
export const getMe = async (req, res) => {
    const token = req.headers.authorization.split(" ")[1]
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "token is required",
        })
    }
    const decodedToken = jwt.verify(token, config.JWT_SECRET)
    const user = await UserModel.findById(decodedToken.id)
    console.log(user);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "user not found",
        })
    }
    res.status(200).json({
        success: true,
        message: "user found successfully",
        user: {
            id: user._id,
            userName: user.userName,
            email: user.email,
        },
    })
}
export const logout = async (req, res) => {
    const rfToken =req.cookies.REFRESHtOKEN
    if(!rfToken){
        res.status(400).json({
            message:"refresh token is required",
            success:false,
        })
    }
    const refreshTokenHash = crypto.createHash('sha256').update(rfToken).digest('hex');
    const session = await SessionModel.findOne({
        refreshTokenHash,
        revoked:false,
    })
    if(!session){
        res.status(404).json({
            message:"session not found",
            success:false,
        })
    }
    session.revoked = true
    await session.save()
    res.clearCookie("REFRESHtOKEN")
    res.status(200).json({
        success:true,
        message:"user logged out successfully",
    })
}
export const logoutAll = async (req, res) => {
 const rfToken =req.cookies.REFRESHtOKEN
    if(!rfToken){
        res.status(400).json({
            message:"refresh token is required",
            success:false,
        })
    }
      const decoded =jwt.verify(rfToken,config.JWT_SECRET)
      await SessionModel.updateMany({
        userId:decoded.id,
        revoked:false,
      },{
        revoked:true,
      })
      res.clearCookie("REFRESHtOKEN")
      res.status(200).json({
        success:true,
        message:"user logged out successfully",
      })
}
export const verifyEmail = async (req, res) => {
    const {email,otp} =req.body
    if(!email || !otp){
        return res.status(400).json({
            success:false,
            message:"email and otp are required",
        })
    }
    const otpHashed =crypto.createHash('sha256').update(otp).digest('hex');
    const otpDoc = await OtpModel.findOne({
        email,
        otpHash:otpHashed,
    })
    if(!otpDoc){
        return res.status(404).json({
            success:false,
            message:"otp is not valid",
        })
    }
  const user = await UserModel.findByIdAndUpdate(
  otpDoc.user,
  { Verified: true },
  { new: true } 
);
    if(!user){
        return res.status(404).json({
            success:false,
            message:"user not found",
        })
    }
    await OtpModel.deleteMany({email})
    res.status(200).json({
        success:true,
        message:"email verified successfully",
        user:{
            userName:user.userName,
            email:user.email,
            verified:user.verified,
        },

    })
}
