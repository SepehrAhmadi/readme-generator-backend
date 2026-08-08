import express from "express";
import healthRouter from "./health.ts";
import apiRoutes from "./api/index.ts";

const router = express.Router();

router.use("/health", healthRouter);
router.use("/", apiRoutes);

export default router;
