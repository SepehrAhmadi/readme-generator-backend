import { Request, Response } from "express";
import generationJobService from "../services/generationJobService";

const startGeneration = async (req: Request, res: Response) => {
  const repositoryId = Number(req.params.id);

  try {
    const job = await generationJobService.startGeneration(repositoryId);

    res.status(200).json({
      statusCode: 200,
      message: "Generation started",
      data: job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: "Failed to start generation",
    });
  }
};

const getJobStatus = async (req: Request, res: Response) => {
  const jobId = Number(req.params.jobId);

  try {
    const job = await generationJobService.getJobById(jobId);

    if (!job) {
      return res.status(404).json({
        statusCode: 404,
        message: "Job not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      data: job,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      message: "Failed to fetch job status",
    });
  }
};

export default { startGeneration, getJobStatus };
