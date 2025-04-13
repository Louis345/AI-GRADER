const axios = require("axios");
const path = require("path");
const fs = require("fs-extra");

/**
 * Process GitHub repository and extract relevant content
 * @param {string} repoUrl - GitHub repository URL
 * @returns {Promise<string>} Repository content as formatted text
 */
async function processGitHubRepo(repoUrl) {
  try {
    console.log(`Processing GitHub repository: ${getRepoPath(repoUrl)}`);

    // Validate GitHub URL format
    if (!repoUrl.includes("github.com")) {
      throw new Error("Invalid GitHub URL format");
    }

    // Extract repo path
    const repoPath = getRepoPath(repoUrl);
    console.log(`Attempting to fetch GitHub repo: ${repoPath}`);

    // Try to get the repository files
    try {
      return await getRepositoryContent(repoPath);
    } catch (error) {
      // If original repo path fails, try with "s" appended (common mistake)
      if (repoPath.endsWith("API")) {
        const alternateRepoPath = `${repoPath}s`;
        console.log(
          `Original repo not found. Trying alternate path: ${alternateRepoPath}`
        );

        try {
          return await getRepositoryContent(alternateRepoPath);
        } catch (altError) {
          console.error(
            `Alternate repository path also failed: ${altError.message}`
          );
          throw new Error(
            `Could not find repository at ${repoPath} or ${alternateRepoPath}`
          );
        }
      }

      // If we reach here, both attempts failed or it wasn't an API/APIs issue
      throw error;
    }
  } catch (error) {
    console.error(`Error processing GitHub repository: ${error.message}`);

    // Return a structured error message instead of throwing
    return `
GitHub Repository Error:
- Repository URL: ${repoUrl}
- Error Message: ${error.message}
- Possible Solutions:
  1. Check if the repository URL is correct
  2. Verify the repository is public
  3. Make sure the repository exists
  4. Check for typos in the repository name (e.g., API vs APIs)

Please correct the repository URL and try again.
`;
  }
}

/**
 * Get repository content from GitHub
 * @param {string} repoPath - Repository path (owner/repo)
 * @returns {Promise<string>} Repository content
 */
async function getRepositoryContent(repoPath) {
  try {
    // Get repository files
    const files = await getRelevantFiles(repoPath);

    // Format repository content
    let formattedContent = `# GitHub Repository: ${repoPath}\n\n`;

    // Process each file
    for (const file of files) {
      formattedContent += `## File: ${file.path}\n\`\`\`${getFileExtension(
        file.path
      )}\n${file.content}\n\`\`\`\n\n`;
    }

    return formattedContent;
  } catch (error) {
    throw error;
  }
}

/**
 * Extract repository path from URL
 * @param {string} url - GitHub repository URL
 * @returns {string} Repository path (owner/repo)
 */
function getRepoPath(url) {
  // Handle both HTTPS and SSH URLs
  if (url.includes("github.com")) {
    // HTTPS URL format
    const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
    if (match) {
      return match[1].replace(".git", "");
    }
  } else if (url.includes("git@github.com")) {
    // SSH URL format
    const match = url.match(/git@github\.com:([^\/]+\/[^\/]+)/);
    if (match) {
      return match[1].replace(".git", "");
    }
  }

  throw new Error("Invalid GitHub URL format");
}

/**
 * Get repository files from GitHub
 * @param {string} repoPath - Repository path (owner/repo)
 * @returns {Promise<Array>} Array of file objects
 */
async function getRelevantFiles(repoPath) {
  try {
    // Get default branch name
    const defaultBranch = await getDefaultBranch(repoPath);

    // Get file list from default branch
    const fileList = await getRepoFiles(repoPath, defaultBranch);

    // Filter relevant files
    const relevantFiles = fileList.filter((file) => {
      // Include only text files under a certain size and exclude certain directories
      return (
        file.type === "file" &&
        file.size < 500000 && // 500 KB limit
        !file.path.startsWith("node_modules/") &&
        !file.path.startsWith(".git/") &&
        !file.path.includes("/node_modules/") &&
        !file.path.endsWith(".jpg") &&
        !file.path.endsWith(".jpeg") &&
        !file.path.endsWith(".png") &&
        !file.path.endsWith(".gif") &&
        !file.path.endsWith(".svg") &&
        !file.path.endsWith(".mp4") &&
        !file.path.endsWith(".mp3") &&
        !file.path.endsWith(".zip") &&
        !file.path.endsWith(".tar.gz")
      );
    });

    // Get content for each file
    const filesWithContent = await Promise.all(
      relevantFiles.map(async (file) => {
        try {
          const content = await getFileContent(
            repoPath,
            file.path,
            defaultBranch
          );
          return {
            path: file.path,
            content: content,
          };
        } catch (error) {
          return {
            path: file.path,
            content: `[Error fetching content: ${error.message}]`,
          };
        }
      })
    );

    return filesWithContent;
  } catch (error) {
    throw error;
  }
}

/**
 * Get default branch name for a repository
 * @param {string} repoPath - Repository path (owner/repo)
 * @returns {Promise<string>} Default branch name
 */
async function getDefaultBranch(repoPath) {
  try {
    // Try common branch names first to reduce API calls
    const commonBranches = ["main", "master"];

    for (const branch of commonBranches) {
      try {
        await axios.get(
          `https://api.github.com/repos/${repoPath}/branches/${branch}`
        );
        console.log(`Found branch: ${branch}`);
        return branch;
      } catch (error) {
        console.log(`Branch "${branch}" not found, trying next...`);
      }
    }

    // If common branches not found, get repository info to find default branch
    console.log(`Common branches not found, getting default branch info...`);
    const response = await axios.get(
      `https://api.github.com/repos/${repoPath}`
    );

    if (response.data && response.data.default_branch) {
      console.log(`Using default branch: ${response.data.default_branch}`);
      return response.data.default_branch;
    }

    throw new Error("Could not determine default branch");
  } catch (error) {
    throw new Error(`Failed to get default branch: ${error.message}`);
  }
}

/**
 * Get repository files from a specific branch
 * @param {string} repoPath - Repository path (owner/repo)
 * @param {string} branch - Branch name
 * @returns {Promise<Array>} Array of file objects
 */
async function getRepoFiles(repoPath, branch) {
  try {
    // Get repository tree
    const response = await axios.get(
      `https://api.github.com/repos/${repoPath}/git/trees/${branch}?recursive=1`
    );

    if (!response.data || !response.data.tree) {
      throw new Error("Repository tree not found");
    }

    return response.data.tree;
  } catch (error) {
    // Improve error messages for common issues
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error(
          "Repository not found. Check the URL and make sure it's public."
        );
      } else if (error.response.status === 403) {
        throw new Error("API rate limit exceeded or access denied.");
      }
    }

    throw new Error(`Failed to fetch repository content: ${error.message}`);
  }
}

/**
 * Get file content from GitHub
 * @param {string} repoPath - Repository path (owner/repo)
 * @param {string} filePath - File path within the repository
 * @param {string} branch - Branch name
 * @returns {Promise<string>} File content
 */
async function getFileContent(repoPath, filePath, branch) {
  try {
    // Get file content
    const response = await axios.get(
      `https://raw.githubusercontent.com/${repoPath}/${branch}/${filePath}`
    );

    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch file content: ${error.message}`);
  }
}

/**
 * Get file extension for syntax highlighting
 * @param {string} filePath - File path
 * @returns {string} File extension for syntax highlighting
 */
function getFileExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase().substring(1);

  // Map file extensions to syntax highlighting languages
  const languageMap = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    rb: "ruby",
    java: "java",
    c: "c",
    cpp: "cpp",
    cs: "csharp",
    php: "php",
    html: "html",
    css: "css",
    scss: "scss",
    sass: "sass",
    less: "less",
    md: "markdown",
    json: "json",
    xml: "xml",
    yaml: "yaml",
    yml: "yaml",
    sql: "sql",
    sh: "bash",
    bash: "bash",
    txt: "text",
  };

  return languageMap[ext] || "";
}

module.exports = { processGitHubRepo };
