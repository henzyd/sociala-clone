import express from "express";
import morgan from "morgan";
import AppError from "./utils/appError";
import globalErrorHandler from "./controllers/errorHandler";
import authRoute from "./routes/authentication";
import cors from "cors";
import prisma from "./db";
import { authorization } from "./middleware/authentication";

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  cors({
    origin: "*", //! Allow from anywhere, change this to the frontend URL
  })
); //? Use the cors middleware
app.use(express.json());
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: `Welcome to the LinkSphere server <${process.env.NODE_ENV}>`,
  });
});
//? Delete all users
app.delete("/users", (req, res) => {
  prisma.user.deleteMany().then(() => {
    res.status(200).json({
      status: "success",
      message: "All users deleted",
    });
  });
});
//?
app.use("/auth", authorization, authRoute);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
