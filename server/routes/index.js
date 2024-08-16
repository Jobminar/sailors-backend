import express from "express";
import sampleRouter from "../sample/sample-router/sample.router.js";
import applicationRouter from "../application/application-router/application.router.js";
import userRouter from "../user/user-router/user.router.js";
import admminRouter from "../admin/admin-router/admin.router.js";
const app = express();

app.use("/sample", sampleRouter)
app.use("/application", applicationRouter)
app.use("/user", userRouter)
app.use("/admin", admminRouter)


export default app;