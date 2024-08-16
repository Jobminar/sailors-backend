import User from "../user-model/user.model.js";
import jwt from "jsonwebtoken";

const userController = {
  //Create User _______________________________________

  createUser: async (req, res) => {
    console.log(req.body);
    const { candidateName, mobileNumber } = req.body;
    if (!candidateName || !mobileNumber) {
      return res.status(401).json({ message: "check user credentials" });
    }

    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiry time to 5 minutes from now

    try {
      const existingUser = await User.findOne({ candidateName, mobileNumber });
      if (existingUser) {
        const user = await User.findOneAndUpdate(
          { mobileNumber },
          { otp, otpExpiry },
          { upsert: true, new: true }
        );

        return res
          .status(200)
          .json({ message: "OTP sent successfully", otp: otp });
        // return res.status(409).json({ message: "User already exists" });
      }

      const newUser = new User({
        candidateName,
        mobileNumber,
        otp,
        otpExpiry
      });
      await newUser.save();

      res
        .status(201)
        .json({ message: "User created successfully", user: newUser });
    } catch (error) {
      console.error("Error generating OTP:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  //Verify OTP _______________________________________

  verifyOtp: async (req, res) => {
    const { mobileNumber, otp } = req.body;
    console.log(req.body);
    if (!otp) {
      return res.status(400).json({ message: "OTP is required" });
    }

    try {
      const user = await User.findOne({ mobileNumber, otp });
      console.log("user", user);
      if (!user) {
        return res.status(404).json({ message: "Invalid OTP or expired OTP" });
      }

      if (user.otpExpiry < new Date()) {
        return res.status(400).json({ message: "Invalid OTP or expired OTP" });
      }
      user.otp = null;
      user.otpExpiry = null;
      await user.save();

      console.log("user.mobileNumber", user);

      // Generate JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_USER, {
        expiresIn: "1h"
      });

      return res.status(200).json({
        message: "OTP verified successfully",
        mobileNumber: user.mobileNumber,
        id: user._id,
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
      const decoded = jwt.verify(token, JWT_SECRET_USER);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).send({ error: "Unauthorized" });
    }
  },

  //User Profile _______________________________________

  profile: async (req, res) => {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).send('User not found');
  }
    res.status(200).send({
      candidateName: user.candidateName,
      mobileNumber: user.mobileNumber
    });
  }
};

export default userController;

// createUser: async (req, res) => {
//     try {
//         const user = new User(req.body);
//         await user.save();
//         res.status(201).json(user);
//     } catch (error) {
//         res.status(400).json({ message: error.message });
//     }
// },
