import mongoose from "mongoose";

const adminSchema =new mongoose.Schema({
    email:{type:String},
    password:{type:String},
    otp:{type:String},
    otpExpiry:{type:String}
},
{
     timestamps: true, // Automatically manage createdAt and updatedAt fields
}
) 

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;

//Array Binary Boolean Code Date Decimal128 Double Int32 Int64 
//MaxKey MinKey Null Object ObjectId BSONRegExp String BSONSymbol 
//Timestamp Undefined
