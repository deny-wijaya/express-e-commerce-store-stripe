import { Router } from "express";
import { authRoutes } from "@/routes/authRoute";

const router = Router();

// API v1 routes
router.use("/auth", authRoutes);

// Health check
router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API v1 is healthy",
    timestamp: new Date().toISOString(),
  });
});

export { router as v1Routes };
