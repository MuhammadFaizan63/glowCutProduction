import express from "express";
import { register,getMe,refreshToken,logout,login,logoutAll ,verifyEmail} from "../controller/user.controller.js";
const router = express.Router();

router.post("/register",register);
router.get('/getMe',getMe)
router.get('/refreshToken',refreshToken)
router.get('/logout',logout)
router.post('/login',login)
router.get('/logoutAll',logoutAll)
router.get('/verifyEmail',verifyEmail)





export default router;