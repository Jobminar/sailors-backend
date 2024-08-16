import express from "express";
import nodemailer from "nodemailer";
import randomstring from "randomstring";
import path from "path";
import jwt from "jsonwebtoken";


const adminController = {

  //Create User _______________________________________

  requestOtp: async (req, res) => {
    const { email } = req.body;
   
    if (!email) {
      return res.status(401).json({ message: "check user credentials" });
    }
   
    // const otp = Math.floor(1000 + Math.random() * 9000);
    const otp = randomstring.generate({length:4, charset:"numeric" });
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // Set OTP expiry time to 5 minutes from now

    const otpCache  = {};
    otpCache[email] = otp; 

    try {
        const existing = await Admin.findOne({ email });
        sendOtpEmail(email, otp);
        res.cookie("otpCache", otpCache, {maxAge: 30000, httpOnly:true});
        res.status(200).json({message:"OTP sent Successfully", otp: otp });
        

        // const user = await Admin.findOneAndUpdate(
        //   { email },
        //   { otp, otpExpiry },
        //   { upsert: true, new: true }
        // );

    } catch (error) {
      console.error("Error generating OTP:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },


  sendOtpEmail:async(req,res)=>{
    const {email, otp} = req.body;
    const mailOptions = {
      from:"kamalakar579@gmail.com",
      to:email,
      subject:"OTP verification",
      text:`Your Otp for verification is: ${otp}`

    }

    let transporter = nodemailer.createTransport({
      service:"Gmail",
      auth:{
        user:"kamalakarp843@gmail.com",
        pass:"15263748"
      },
      tls:{
        rejectUnauthorized:false
      }
    })

    transporter.senMail(mailOptions, (error,info) => {
      if(error){
        console.log('Error occured:', error);
      }else{
        console.log('OTP Email sent successfully:', info.response)
;      }
    })
  },

   //Verify OTP _______________________________________

   verifyOtp: async (req, res) => {
    const { email, otp } = req.body;
    if (!otpCache.hasOwnProperty(email)) {
      return res.status(400).json({ message: "Email not found" });
    }

    if (otpCache[email] === otp.trim()){
      delete otpCache[email];
      return res.status(200).json({message:'OTP verified successfully'})
    }else{
      return res.status(400).json({message:'Invalid OTP'}); 
    }

    const newAdmin = new Admin({
        email,
        otp,
        otpExpiry
      });
      await newAdmin.save();

      res
        .status(201)
        .json({ message: "admin created successfully", admin: newAdmin });
  },

}
export default adminController;

