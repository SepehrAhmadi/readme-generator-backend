import { Router } from "express";
import createRepository from "../../controllers/repositoryController.ts";

const router = Router();

router.post("/", createRepository);

export default router;
