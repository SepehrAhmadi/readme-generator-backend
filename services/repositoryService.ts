import getRepoMetadata from "../clients/githubClient.ts";
import upsertRepository from "../repositories/repositoryRepository.ts";

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

  const metadata = await getRepoMetadata(owner, name);

  const repository = await upsertRepository({
    owner,
    name,
    fullName,
    description: metadata.description,
    primaryLanguage: metadata.primaryLanguage,
  });

  return repository;
};

export default createOrUpdateRepository;
