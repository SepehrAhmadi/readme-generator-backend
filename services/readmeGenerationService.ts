import { generateText, tool, stepCountIs } from "ai";
import { z } from "zod";
import aiClient from "../clients/aiClient";
import githubClient from "../clients/githubClient";

interface RepoMetadata {
  description: string | null;
  primaryLanguage: string | null;
  defaultBranch: string;
}

const stripMarkdownFence = (text: string): string => {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:markdown|md)?\n([\s\S]*?)\n```$/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }
  return trimmed;
};

const generateReadme = async (
  owner: string,
  name: string,
  branch: string,
  metadata: RepoMetadata,
  fileTree: string[],
) => {
  const getFileContentTool = tool({
    description:
      "Only call this for files essential to understanding the project's purpose and setup — such as package.json, requirements.txt, Cargo.toml, go.mod, or the main entry file. Do not call this for every file in the tree.",

    inputSchema: z.object({
      path: z.string().describe("The file path to read, e.g. 'package.json'"),
    }),

    execute: async ({ path }) => {
      return await githubClient.getFileContent(owner, name, path, branch);
    },
  });

  const systemPrompt = `You are an expert technical writer generating a README.md file for a GitHub repository.
  You will be given the repository's metadata and its file tree.
  If you need to see the contents of a specific file to understand the project better, use the getFileContent tool — but only for files that are truly essential (like dependency manifests or the main entry point). Do not read every file.
  When you have enough information, write a complete, well-structured README in Markdown format, including sections like: project title, description, installation, usage, and any other relevant sections based on what you learn.

  IMPORTANT: Return ONLY the raw README content as plain text. Do NOT wrap your output in a markdown code fence (no triple backticks, no "\`\`\`markdown" at the start or "\`\`\`" at the end). Start your response directly with the title heading, e.g. "# Project Name".`;
  
  const prompt = `Repository metadata:
- Description: ${metadata.description ?? "N/A"}
- Primary language: ${metadata.primaryLanguage ?? "N/A"}

File tree:
${fileTree.join("\n")}

Generate a README.md for this repository.`;

  const { text, usage } = await generateText({
    model: aiClient(process.env.MODEL || "grok-4.5-high"),
    system: systemPrompt,
    prompt,
    tools: {
      getFileContent: getFileContentTool,
    },
    stopWhen: stepCountIs(5),
  });

  return {
    content: stripMarkdownFence(text),
    totalTokens: usage.totalTokens ?? 0,
  };
};

export default { generateReadme };
