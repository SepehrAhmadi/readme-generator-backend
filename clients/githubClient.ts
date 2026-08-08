import axios from "axios";

interface RepoMetadata {
  description: string | null;
  primaryLanguage: string | null;
}

const getRepoMetadata = async (
  owner: string,
  name: string,
): Promise<RepoMetadata> => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${name}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    return {
      description: response.data.description,
      primaryLanguage: response.data.language,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`Repository ${owner}/${name} not found on GitHub`);
    }
    throw error;
  }
};

export default getRepoMetadata;
