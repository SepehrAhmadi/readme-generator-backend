import Router from "express";
const router = Router();
import repository from "./repository.ts";
import generationJob from "./generationJob.ts";

router.use("/repository", repository);
router.use("/generationJob", generationJob);

export default router;
