import Application from "../application-model/application.model.js";
import multer from "multer";

// Configure Multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size (5 MB)
  fileFilter: (req, file, cb) => {
    // Define allowed file types
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});

const applicationController = {
  // Controller function to create a new application
  createApplication: [
    upload.fields([
      { name: "passport", maxCount: 1 },
      { name: "certificate", maxCount: 1 },
      { name: "aadhar", maxCount: 1 }
    ]),
    async (req, res) => {
      const { passport, certificate, aadhar } = req.files;
      console.log("files received");
      console.log(passport, certificate, aadhar);
      try {
        // Destructure and parse form data
        const {
          post,
          candidateName,
          dateOfBirth,
          mobileNumber,
          fatherName,
          gender,
          emailId,
          address,
          education
        } = req.body;

        // Ensure files are uploaded
        if (!passport || !certificate || !aadhar) {
          return res
            .status(400)
            .json({ message: "All required files must be uploaded." });
        }

        // Convert uploaded files to base64 strings
        const passportFile = Buffer.from(req.files.passport[0].buffer).toString("base64");
        const certificateFile = Buffer.from(req.files.certificate[0].buffer).toString("base64");
        const aadharFile = Buffer.from(req.files.aadhar[0].buffer).toString("base64");

        

        // Create a new application document
        const application = new Application({
          post,
          candidateName,
          dateOfBirth: new Date(dateOfBirth),
          mobileNumber,
          fatherName,
          gender,
          emailId,
          address,
          education,
          uploadFiles: {
            passport: passportFile,
            certificate: certificateFile,
            aadhar: aadharFile
          }
        });

        // Save the application to the database
        await application.save();
        res
          .status(201)
          .json({ message: "Application created successfully.", application });
      } catch (error) {
        if (error.name === "ValidationError") {
          console.error("Validation Error:", error.errors);
          res.status(400).json({ errors: error.errors });
        } else {
          console.error("Error creating application:", error);
          res.status(500).json({ error: error.message });
        }
      }
    }
  ],

  testApplication: async (req, res) => {
   
    try {
      // Destructure and parse form data
      const {
        post,
        candidateName,
        dateOfBirth,
        mobileNumber,
        fatherName,
        gender,
        emailId,
      } = req.body;

      // Create a new application document
      const application01 = new Application({
        post,
        candidateName,
        dateOfBirth: new Date(dateOfBirth),
        mobileNumber,
        fatherName,
        gender,
        emailId,
      });

      // Save the application to the database
      await application01.save();
      res
        .status(201)
        .json({ message: "Application created successfully.", application01 });
    } catch (error) {
      if (error.name === "ValidationError") {
        console.error("Validation Error:", error.errors);
        res.status(400).json({ errors: error.errors });
      } else {
        console.error("Error creating application:", error);
        res.status(500).json({ error: error.message });
      }
    }
  },

  getApplication: async (req, res) => {
    try {
      const loadApplication = await Application.find();
      res.status(200).json(loadApplication);
    } catch (error) {
      res.status(500).json({ error: "failed to get data", error: error });
    }
  }

  // getSampleDetails: async (req, res) => {
  //   try {
  //     const sample =await Sample.find();
  //     res.status(200).json(sample);
  //   } catch (error) {
  //     res.status(500).json({error:"failed to get the data", error:error})
  //   }
  // }
};

export default applicationController;
