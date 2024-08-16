import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  examPassed: { type: String },
  schoolCollege: { type: String },
  yearOfPassing: { type: String },
  percentage: { type: String },
});

const addressSchema = new mongoose.Schema({
  houseNumber: { type: String },
  policeStation: { type: String, required: true },
  city: { type: String },
  pincode: { type: String },
  postOffice: { type: String, required: true },
  district: { type: String, required: true },
  state: { type: String },
});

const applicationSchema = new mongoose.Schema({
    post:{type:String, required:true},
    candidateName: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    mobileNumber: { type: String },
    fatherName: { type: String, required: true },
    gender: { type: String },
    emailId: { type: String },
    address: addressSchema,
    education: [educationSchema],
    uploadFiles: {
      passport: { type: Buffer, contentType: String},
      certificate: { type: Buffer,contentType: String},
      aadhar: { type: Buffer,contentType: String }
    }
  
  });
  
  const Application = mongoose.model('Application', applicationSchema);
  
  export default Application;
