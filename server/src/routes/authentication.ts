import express from "express";
import { body } from "express-validator";
import { login, signup, logout } from "../controllers/authentication";
import { authorization } from "../middleware/authentication";

const router = express.Router();

const emailVaidator = () =>
  body("email").trim().isEmail().withMessage("Invalid email address");

const passwordValidator = () =>
  body("password")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long");

router.post(
  "/signup",
  [
    body("username").trim().notEmpty().withMessage("Username is required"),
    emailVaidator(),
    passwordValidator(),
  ],
  signup
);
router.post("/login", [(emailVaidator(), passwordValidator())], login);
router.post(
  "/logout",
  authorization,
  [
    body("refreshToken")
      .trim()
      .notEmpty()
      .withMessage("Refresh token is required"),
  ],
  logout
);

export default router;
