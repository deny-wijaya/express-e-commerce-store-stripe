import { Router } from "express";
import { validateLogin, validateRegister, authenticateToken } from "@/middleware/authMid";
import { AuthController } from "@/controllers/authController";

const router = Router();
const authController = new AuthController();

// Login route
router.post("/login", validateLogin, authController.login.bind(authController));

// Register route
router.post("/register", validateRegister, authController.register.bind(authController));

// Get user profile (protected route)
router.get("/profile", authenticateToken, authController.getProfile.bind(authController));

export { router as authRoutes };
