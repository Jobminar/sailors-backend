import express from 'express';
import sampleController from '../sample-controller/sample.controller.js';

const sampleRouter = express.Router();

sampleRouter.post("/upload", sampleController.createSampleDetails);
sampleRouter.get("/", sampleController.getSampleDetails);
sampleRouter.put("/updateUser", sampleController.updateUserDetails);
sampleRouter.put("/deleteUser", sampleController.deleteUserDetails);  

export default sampleRouter;
 