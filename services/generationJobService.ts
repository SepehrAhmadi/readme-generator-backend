import generationJobRepository from "../repositories/generationJobRepository";
import repositoryRepository from "../repositories/repositoryRepository";
import generatedReadmeRepository from "../repositories/generatedReadmeRepository";
import githubClient from "../clients/githubClient";
import readmeGenerationService from "./readmeGenerationService";

const startGeneration = async (repositoryId: number) => {
  console.log(`Starting generation for repository ${repositoryId}`);
  let job = await generationJobRepository.create({ repositoryId });

  const repository = await repositoryRepository.findById(repositoryId);

  if (!repository) {
    job = await generationJobRepository.markFailed(job.id, "Repository not found");
    return job;
  }

  try {
    console.log(`Fetching metadata for repository ${repositoryId}`);
    await generationJobRepository.updateStatus(job.id, "fetching_metadata");
    const metadata = await githubClient.getRepoMetadata(
      repository.owner,
      repository.name
    );

    console.log(`Fetching metadata for repository ${repositoryId}`);
    await generationJobRepository.updateStatus(job.id, "fetching_file_tree");
    const fileTree = await githubClient.getRepoFileTree(
      repository.owner,
      repository.name,
      metadata.defaultBranch
    );

    console.log(`Generating README for repository ${repositoryId}`);
    await generationJobRepository.updateStatus(job.id, "generating_readme");
    const { content, totalTokens } = await readmeGenerationService.generateReadme(
      repository.owner,
      repository.name,
      metadata.defaultBranch,
      metadata,
      fileTree
    );

    await generatedReadmeRepository.create({
      jobId: job.id,
      content,
      totalTokens,
      modelUsed: process.env.MODEL || "grok-4.5-high",
    });

    console.log(`Marking job as completed for repository ${repositoryId}`);
    job = await generationJobRepository.markCompleted(job.id);

    return job;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    job = await generationJobRepository.markFailed(job.id, message);
    throw error;
  }
};

const getJobById = async (jobId: number) => {
  return await generationJobRepository.findById(jobId);
};

export default { startGeneration, getJobById };