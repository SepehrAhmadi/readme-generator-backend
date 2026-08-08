import { Request, Response } from "express";
import createOrUpdateRepository from "../services/repositoryService.ts";

const createRepository = async (req: Request, res: Response) => {
  try {
    console.log("BODY:", req.body);
    const repository = await createOrUpdateRepository({
      githubUrl: req.body.githubUrl,
    });

    res.status(200).json({
      statusCode: 200,
      message: "Repository added successfully",
      data: repository,
    });
  } catch (err) {
    if (err instanceof Error && err.message.includes("not found")) {
      return res.status(404).json({
        statusCode: 404,
        message: "Repository not found on GitHub",
      });
    }

    console.error(err);
    res.status(500).json({
      statusCode: 500,
      message: "Failed to add repository",
    });
  }
};

export default createRepository;