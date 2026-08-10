import prisma from "../lib/prisma.ts";
import type { JobStatus } from "../types/jobStatus.ts";

interface CreateGenerationJobInput {
  repositoryId: number;
}

const create = async ({ repositoryId }: CreateGenerationJobInput) => {
  return await prisma.generationJob.create({
    data: { repositoryId, status: "pending" },
  });
};

const updateStatus = async (jobId: number, status: JobStatus) => {
  return await prisma.generationJob.update({
    where: { id: jobId },
    data: { status },
  });
};

const markCompleted = async (jobId: number) => {
  return await prisma.generationJob.update({
    where: { id: jobId },
    data: {
      status: "completed",
      completedAt: new Date(),
    },
    include: { readme: true },
  });
};

const markFailed = async (jobId: number, errorMessage: string) => {
  return await prisma.generationJob.update({
    where: { id: jobId },
    data: {
      status: "failed",
      completedAt: new Date(),
      errorMessage,
    },
  });
};

const findById = async (jobId: number) => {
  return await prisma.generationJob.findUnique({
    where: { id: jobId },
    include: { readme: true },
  });
};

export default { create, updateStatus, markCompleted, markFailed, findById };
