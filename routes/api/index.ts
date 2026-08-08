import Router from "express";
const router = Router();
import repository from "./repository.ts";

router.use("/repository", repository);

export default router;
