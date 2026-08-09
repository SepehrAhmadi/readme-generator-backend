import prisma from "../lib/prisma.ts";

interface GeneratedReadmeInput {
  jobId: number;
  content: string;
  totalTokens: number;
  modelUsed: string;
}

const create = async (input: GeneratedReadmeInput) => {
  return await prisma.generatedReadme.create({
    data: {
      jobId: input.jobId,
      content: input.content,
      totalTokens: input.totalTokens,
      modelUsed: input.modelUsed,
    },
  });
};

export default {
  create,
};
