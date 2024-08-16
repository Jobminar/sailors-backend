import express from "express";
import adminController from "../admin-controller/admin.controller.js";

const adminRouter = express.Router();

adminRouter.post("/register", adminController.register); //Create User & Generate OTP
adminRouter.post("/new-password", adminController.newPassword); //New  Password
adminRouter.post("/verify-admin",adminController.verifyOtp); //Verify OTP
adminRouter.post("/signin-admin",adminController.signin); //Signin Admin
// adminRouter.get("/profile", adminController.authenticateJWT, adminController.profile); //Protected route

  

export default adminRouter;