import { Router } from "express";
import generationJobController from "../../controllers/generationJobController";

const router = Router();

router.get("/:id/generate", generationJobController.startGeneration);

router.get("/:jobId", generationJobController.getJobStatus);

export default router;
