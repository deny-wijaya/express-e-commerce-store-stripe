import { Router } from "express";
import { validateLogin, validateRegister, authenticateToken } from "@/middleware/authMid";
import { AuthController } from "@/controllers/authController";

const router = Router();
const authController = new AuthController();

// Login route
router.post("/login", validateLogin, authController.login);

// Register route
router.post("/register", validateRegister, authController.register);

// Get user profile (protected route)
router.get("/profile", authenticateToken, authController.getProfile);

export { router as authRoutes };
