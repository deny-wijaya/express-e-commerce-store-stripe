import { Router } from "express";
import { v1Routes } from "@/routes/v1";

const router = Router();

// API versioning
router.use("/v1", v1Routes);

export { router as apiRoutes };
