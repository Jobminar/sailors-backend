import Admin from "../admin-model/admin.model.js";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";
import path from "path";
import nodemailer from "nodemailer";

const adminController = {
  //Create User _______________________________________

  signupAdmin: async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(401).json({ message: "check user credentials" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiry time to 5 minutes from now

    try {
      const existing = await Admin.findOne({ email });
      if (existing) {
        const user = await Admin.findOneAndUpdate(
          { email },
          { otp, otpExpiry },
          { upsert: true, new: true }
        );

        return res
          .status(200)
          .json({ message: "OTP sent successfully", otp: otp });
      }

      const newAdmin = new Admin({
        email,
        otp,
        otpExpiry
      });
      await newAdmin.save();

      res
        .status(201)
        .json({ message: "User created successfully", user: newAdmin });
    } catch (error) {
      console.error("Error generating OTP:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  //New Password _____________________________________

  newPassword: async(req,res) => {
    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(401).json({ message: "password differs" });
    }

    try {
      const existing = await Admin.findOne({ email });
      if (existing) {
        const admin = await Admin.findOneAndUpdate(
          { password },
        );

        return res
          .status(200)
          .json({ message: "OTP sent successfully", otp: otp });
      }

      const newAdmin = new Admin({
        email,
        otp,
        otpExpiry
      });
      await newAdmin.save();

      res
        .status(201)
        .json({ message: "User created successfully", user: newAdmin });
    } catch (error) {
      console.error("Error generating OTP:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },
  //Verify OTP _______________________________________

  verifyOtp: async (req, res) => {
    const { email, otp } = req.body;
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    try {
      const admin = await Admin.findOne({ mobileNumber, otp });
      console.log("admin", admin);
      if (!admin) {
        return res.status(404).json({ message: "Invalid OTP or expired OTP" });
      }

      if (admin.otpExpiry < new Date()) {
        return res.status(400).json({ message: "Invalid OTP or expired OTP" });
      }
      admin.otp = null;
      admin.otpExpiry = null;
      await admin.save();

      console.log("user.mobileNumber", admin);

      // Generate JWT
      const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET_ADMIN, {
        expiresIn: "1h"
      });

      return res.status(200).json({
        message: "OTP verified successfully",
        email: admin.email,
        id: admin._id,
        token: token
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  //Middlewares to authenticate token _________________

  authenticateJWT: async (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer", "");

    if (!token) {
      return res.status(401).send('Access denied');
  }

    try {
      const decoded = jwt.verify(token, JWT_SECRET_ADMIN);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).send({ error: "Unauthorized" });
    }
  },

  //Admin Panel _______________________________________

  adminPanel: async (req, res) => {
    const admin = await Admin.findById(req.admin.adminId);
    if (!admin) {
      return res.status(404).send('User not found');
  }
    res.status(200).send({
      email: admin.email,
      password: admin.password
    });
  }
};

export default adminController;

