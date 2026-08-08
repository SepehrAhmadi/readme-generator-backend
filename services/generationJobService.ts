import generationJobRepository from "../repositories/generationJobRepository";
import repositoryRepository from "../repositories/repositoryRepository";
import githubClient from "../clients/githubClient";

const startGeneration = async (repositoryId: number) => {
  const job = await generationJobRepository.create({ repositoryId });

  const repository = await repositoryRepository.findById(repositoryId);

  if (!repository) {
    await generationJobRepository.markFailed(job.id, "Repository not found");
    return job;
  }

  try {
    await generationJobRepository.updateStatus(job.id, "fetching_metadata");
    const metadata = await githubClient.getRepoMetadata(
      repository.owner,
      repository.name
    );

    await generationJobRepository.updateStatus(job.id, "fetching_file_tree");
    const fileTree = await githubClient.getRepoFileTree(
      repository.owner,
      repository.name,
      metadata.defaultBranch
    );

    console.log("Metadata:", metadata);
    console.log("File tree:", fileTree);

    return job;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    await generationJobRepository.markFailed(job.id, message);
    throw error;
  }
};

export default { startGeneration };