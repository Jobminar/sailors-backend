import express from "express";
import applicationController from "../application-controller/application.controller.js";

const applicationRouter = express.Router();

applicationRouter.post("/create", applicationController.createApplication);
applicationRouter.get("/all-applicants", applicationController.getApplication);

export default applicationRouter;



