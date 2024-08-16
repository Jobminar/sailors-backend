import mongoose from "mongoose";

const sampleSchema = new mongoose.Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    phoneNumber: {type: String, required: true},
    state: {type: String, required: true},
    country: {type: String, required: true},
    image:{type:Buffer, required:true}
})

const Sample = mongoose.model("Sample", sampleSchema);

export default Sample;


