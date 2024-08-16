import express from "express";
import adminController from "../admin-controller/admin.controller.js";

const adminRouter = express.Router();

adminRouter.post("/signup", adminController.Signup); //Create User & Generate OTP
adminRouter.post("/verify-otp",adminController.verifyOtp); //Verify OTP
// userRouter.post("/generate-otp",userController.generateOtp);
// adminRouter.get("/profile", adminController.authenticateJWT, adminController.profile); //Protected route

  

export default adminRouter;