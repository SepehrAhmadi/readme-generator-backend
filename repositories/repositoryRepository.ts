import prisma from "../lib/prisma.ts";

interface UpsertRepositoryInput {
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  primaryLanguage: string | null;
}

const upsertRepository = async (data: UpsertRepositoryInput) => {
  return await prisma.repository.upsert({
    where: {
      fullName: data.fullName,
    },
    update: {
      description: data.description,
      primaryLanguage: data.primaryLanguage,
    },
    create: {
      owner: data.owner,
      name: data.name,
      fullName: data.fullName,
      description: data.description,
      primaryLanguage: data.primaryLanguage,
    },
  });
};

export default upsertRepository;
