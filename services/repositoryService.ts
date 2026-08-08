import githubClient from "../clients/githubClient.ts";
import repositoryRepository from "../repositories/repositoryRepository.ts";

interface CreateOrUpdateRepositoryInput {
  githubUrl: string;
}

const parseGithubUrl = (githubUrl: string) => {
  const url = new URL(githubUrl);
  const [, owner, name] = url.pathname.split("/");
  return { owner, name, fullName: `${owner}/${name}` };
};

const createOrUpdateRepository = async ({
  githubUrl,
}: CreateOrUpdateRepositoryInput) => {
  const { owner, name, fullName } = parseGithubUrl(githubUrl);

  const metadata = await githubClient.getRepoMetadata(owner, name);

  const repository = await repositoryRepository.upsertRepository({
    owner,
    name,
    fullName,
    description: metadata.description,
    primaryLanguage: metadata.primaryLanguage,
  });

  return repository;
};

export default createOrUpdateRepository;
