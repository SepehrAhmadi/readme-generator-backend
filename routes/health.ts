import express, { type Router, type Request, type Response } from "express";

const router: Router = express.Router();

router.route("/").get((req: Request, res: Response) => {
  res.status(200).json({
    statusCode: 200,
    message: "Server is running",
  });
});

export default router;
