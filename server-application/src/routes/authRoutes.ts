import express from "express";
import AuthController from "../controllers/AuthController";

const router = express.Router();

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
router.get("/verify", AuthController.verifyToken);

export default router;
