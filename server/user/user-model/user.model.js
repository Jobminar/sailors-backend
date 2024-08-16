import mongoose from "mongoose";

const userSchema =new mongoose.Schema({
    candidateName:{type:String},
    mobileNumber:{type:String},
    otp:{type:String},
    otpExpiry:{type:String}
},
{
     timestamps: true, // Automatically manage createdAt and updatedAt fields
}
) 

const User = mongoose.model("User", userSchema);

export default User;

//Array Binary Boolean Code Date Decimal128 Double Int32 Int64 
//MaxKey MinKey Null Object ObjectId BSONRegExp String BSONSymbol 
//Timestamp Undefined
