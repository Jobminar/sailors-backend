import Sample from "../sample-model/sample.model.js";
import multer, {memoryStorage} from "multer";

const storage = multer.memoryStorage()
const upload=multer({storage:storage})

const sampleController = {

  createSampleDetails: [
    upload.single("image"),
    
    async (req, res) => {
    try {

      if(!req.file){
        return res.status(400).json({message:"image required field is missing !!"})
      }
      // const image = req.file.buffer.toString("base64");
      const image = Buffer.from(req.file.buffer).toString("base64");
       

      const { firstName, lastName, email, phoneNumber, state, country } = req.body;

      if ( !firstName || !lastName  || !email || !phoneNumber || !state || !country ) {

        return res.status(400).json({ message: "Required fields are missing"});
      }

      const userDetails = new Sample({ firstName, lastName, email, phoneNumber, state, country, image });
      await userDetails.save();
      res.status(201).json({ message: "Successfully data added",userDetails });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "internal server error" });
    }
  }],

  getSampleDetails: async (req, res) => {
    try {
      const sample =await Sample.find();
      res.status(200).json(sample);
    } catch (error) {
      res.status(500).json({error:"failed to get the data", error:error})
    }
  },

  updateUserDetails: async (req,res) => {
    try {
      const userData = req.body;
      if(!userDetails){
        return res.status(404).json({error:"cannot update details recheck the details"});
      }else{
        const userDetails = await Sample.findByIdAndUpdate(req.params.id, userData);
      }
    } catch (error) {
      res.status(400).json({error:"error updating user details"})
    }
  },

  deleteUserDetails: async (req, res) => {
    try {
      const userData = await Sample.findByIdAndDelete(req.params.id);
      if(!userData){
        return res.status(404).json({error:"cannot delete details retry"})
      }
    } catch (error) {
      res.status(500).json({error:"error deleting user details"})
    }
  },

};
export default sampleController;
