import axios from "axios";

interface RepoMetadata {
  description: string | null;
  primaryLanguage: string | null;
  defaultBranch: string;
}

interface GitTreeItem {
  path: string;
  type: string;
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
      defaultBranch: response.data.default_branch,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`Repository ${owner}/${name} not found on GitHub`);
    }
    throw error;
  }
};

const getRepoFileTree = async (
  owner: string,
  name: string,
  branch: string,
): Promise<string[]> => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${name}/git/trees/${branch}`,
      {
        params: { recursive: 1 },
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      },
    );

    return response.data.tree
      .filter((item: GitTreeItem) => item.type === "blob")
      .map((item: GitTreeItem) => item.path);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`File tree not found for ${owner}/${name}`);
    }
    throw error;
  }
};

const getFileContent = async (
  owner: string,
  name: string,
  path: string,
  branch: string
): Promise<string> => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${name}/contents/${path}`,
      {
        params: { ref: branch },
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
        },
      }
    );

    return Buffer.from(response.data.content, "base64").toString("utf-8");
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error(`File ${path} not found in ${owner}/${name}`);
    }
    throw error;
  }
};

export default { getRepoMetadata, getRepoFileTree, getFileContent };
