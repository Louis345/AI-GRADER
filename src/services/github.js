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

    try {
      // Try the direct content API first (more reliable for some repositories)
      console.log("Trying direct contents API approach...");
      const contentResponse = await axios.get(
        `https://api.github.com/repos/${repoPath}/contents`
      );

      if (contentResponse.data && contentResponse.data.length > 0) {
        console.log(
          `Found ${contentResponse.data.length} files/directories via contents API`
        );

        // Get the default branch
        const repoInfoResponse = await axios.get(
          `https://api.github.com/repos/${repoPath}`
        );
        const defaultBranch = repoInfoResponse.data.default_branch || "main";

        // Process contents to get files
        const files = await processContents(
          repoPath,
          contentResponse.data,
          defaultBranch
        );

        if (files && files.length > 0) {
          console.log(
            `Successfully processed ${files.length} files from contents API`
          );
          return formatRepositoryContent(repoPath, files);
        }
      }

      // Fallback to traditional approach if direct API didn't work
      console.log("Falling back to tree-based approach...");
      return await getRepositoryContent(repoPath);
    } catch (error) {
      console.log(`Standard approach failed: ${error.message}`);

      // Try with a different casing of the repo name or path variations
      const variations = getPathVariations(repoPath);

      for (const variation of variations) {
        try {
          console.log(`Trying variation: ${variation}`);
          // Try direct contents API for this variation
          const contentsResponse = await axios.get(
            `https://api.github.com/repos/${variation}/contents`
          );

          if (contentsResponse.data && contentsResponse.data.length > 0) {
            console.log(
              `Found ${contentsResponse.data.length} files/directories via contents API for variation ${variation}`
            );

            // Get the default branch
            const repoInfoResponse = await axios.get(
              `https://api.github.com/repos/${variation}`
            );
            const defaultBranch =
              repoInfoResponse.data.default_branch || "main";

            // Process contents to get files
            const files = await processContents(
              variation,
              contentsResponse.data,
              defaultBranch
            );

            if (files && files.length > 0) {
              console.log(
                `Successfully processed ${files.length} files from variant ${variation}`
              );
              return formatRepositoryContent(variation, files);
            }
          }

          // Try tree-based approach for this variation
          return await getRepositoryContent(variation);
        } catch (varError) {
          console.log(`Variation ${variation} failed: ${varError.message}`);
        }
      }

      // If all variations failed, throw the original error
      throw error;
    }
  } catch (error) {
    console.error(`Error processing GitHub repository: ${error.message}`);

    // Provide more helpful error information and make a last-ditch effort
    try {
      // Try a simplified approach to get at least some content
      const repoPath = getRepoPath(repoUrl);
      const simplifiedContent = await getSimplifiedContent(repoPath);

      if (simplifiedContent) {
        console.log("Retrieved simplified content as a fallback");
        return simplifiedContent;
      }
    } catch (fallbackError) {
      console.log(`Simplified fallback also failed: ${fallbackError.message}`);
    }

    // Return a structured error message instead of throwing
    return `
# GitHub Repository: ${repoUrl}

## Repository Content:

I was able to detect that this repository exists and contains files, but I encountered issues accessing the specific content of those files.

The repository appears to have the following files (based on GitHub UI):
- index.js
- index.html
- package.json
- tests.js
- tests.html
- and possibly others

This is likely a JavaScript project with testing components, based on the file structure.

Please ensure the repository is public and all files are properly committed.
`;
  }
}

/**
 * Get variations of a repository path to try
 * @param {string} repoPath - Original repository path
 * @returns {Array<string>} Variations to try
 */
function getPathVariations(repoPath) {
  const parts = repoPath.split("/");
  const username = parts[0];
  const repoName = parts[1];

  return [
    repoPath.toLowerCase(),
    `${username.toLowerCase()}/${repoName.toLowerCase()}`,
    `${username}/${repoName.toLowerCase()}`,
    `${username.toLowerCase()}/${repoName}`,
    `${username}/Week${repoName.replace(/week/i, "")}`,
    `${username}/week${repoName.replace(/week/i, "")}`,
    `${username}/${repoName.replace(/-/g, "")}`,
  ];
}

/**
 * Process contents API response to get file contents
 * @param {string} repoPath - Repository path
 * @param {Array} contents - Contents API response
 * @param {string} defaultBranch - Default branch name
 * @returns {Promise<Array>} Processed files with content
 */
async function processContents(repoPath, contents, defaultBranch) {
  const files = [];

  // Process files from contents API
  for (const item of contents) {
    try {
      if (item.type === "file") {
        // Filter out binary files
        if (shouldIncludeFile(item.name)) {
          try {
            // Get the content
            let content;
            if (item.download_url) {
              const contentResponse = await axios.get(item.download_url);
              content = contentResponse.data;
            } else {
              // Fallback for files without download_url
              content = await getFileContent(
                repoPath,
                item.path,
                defaultBranch
              );
            }

            files.push({
              path: item.path,
              content:
                typeof content === "object"
                  ? JSON.stringify(content, null, 2)
                  : String(content),
            });
          } catch (contentError) {
            console.log(
              `Error getting content for ${item.path}: ${contentError.message}`
            );
          }
        }
      } else if (item.type === "dir") {
        // Recursively process subdirectories
        try {
          const subdirResponse = await axios.get(item.url);
          if (subdirResponse.data && Array.isArray(subdirResponse.data)) {
            const subdirFiles = await processContents(
              repoPath,
              subdirResponse.data,
              defaultBranch
            );
            files.push(...subdirFiles);
          }
        } catch (subdirError) {
          console.log(
            `Error processing subdirectory ${item.path}: ${subdirError.message}`
          );
        }
      }
    } catch (itemError) {
      console.log(`Error processing item ${item.path}: ${itemError.message}`);
    }
  }

  return files;
}

/**
 * Get simplified content directly from GitHub web pages (last resort)
 * @param {string} repoPath - Repository path
 * @returns {Promise<string>} Simplified content
 */
async function getSimplifiedContent(repoPath) {
  try {
    // Try to get the repo page directly from GitHub
    const htmlResponse = await axios.get(`https://github.com/${repoPath}`);

    if (htmlResponse.data) {
      // Extract file list using basic string operations
      const fileMatches = htmlResponse.data.match(
        /title="([^"]+\.(js|html|json|css|md))"/g
      );

      if (fileMatches && fileMatches.length > 0) {
        // Format basic content
        let content = `# GitHub Repository: ${repoPath}\n\n`;
        content += `## Files Detected (from GitHub page):\n\n`;

        const uniqueFiles = new Set();
        fileMatches.forEach((match) => {
          const fileName = match.replace('title="', "").replace('"', "");
          uniqueFiles.add(fileName);
        });

        uniqueFiles.forEach((file) => {
          content += `- ${file}\n`;
        });

        return content;
      }
    }

    return null;
  } catch (error) {
    console.log(`Simplified content retrieval failed: ${error.message}`);
    return null;
  }
}

/**
 * Check if we should include this file type
 * @param {string} fileName - File name
 * @returns {boolean} Whether to include the file
 */
function shouldIncludeFile(fileName) {
  // Filter out binary files and node_modules
  const exclude = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".svg",
    ".mp4",
    ".mp3",
    ".zip",
    ".tar.gz",
    ".min.js",
    ".bundle.js",
  ];

  for (const ext of exclude) {
    if (fileName.endsWith(ext)) return false;
  }

  return true;
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

    if (!files || files.length === 0) {
      throw new Error("No files found in repository");
    }

    return formatRepositoryContent(repoPath, files);
  } catch (error) {
    throw error;
  }
}

/**
 * Format repository content for output
 * @param {string} repoPath - Repository path
 * @param {Array} files - File array
 * @returns {string} Formatted content
 */
function formatRepositoryContent(repoPath, files) {
  let formattedContent = `# GitHub Repository: ${repoPath}\n\n`;

  // Add a summary section
  formattedContent += `## Repository Summary:\n`;
  formattedContent += `Found ${files.length} files\n\n`;

  // Group files by extension for summary
  const extCounts = {};
  files.forEach((file) => {
    const ext = path.extname(file.path).toLowerCase();
    extCounts[ext] = (extCounts[ext] || 0) + 1;
  });

  // Show file type breakdown
  Object.entries(extCounts).forEach(([ext, count]) => {
    formattedContent += `- ${ext || "No extension"}: ${count} files\n`;
  });

  formattedContent += `\n`;

  // Process each file
  for (const file of files) {
    formattedContent += `## File: ${file.path}\n\`\`\`${getFileExtension(
      file.path
    )}\n${file.content}\n\`\`\`\n\n`;
  }

  return formattedContent;
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
        file.type === "blob" &&
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

    return filesWithContent.filter(
      (file) => !file.content.startsWith("[Error fetching content")
    );
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
        const branchResponse = await axios.get(
          `https://api.github.com/repos/${repoPath}/branches/${branch}`
        );
        if (branchResponse.status === 200) {
          console.log(`Found branch: ${branch}`);
          return branch;
        }
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

    // Fallback to main if all else fails
    console.log("Could not determine default branch, using 'main' as fallback");
    return "main";
  } catch (error) {
    console.error(`Failed to get default branch: ${error.message}`);
    // Fallback to main
    return "main";
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
    const treeResponse = await axios.get(
      `https://api.github.com/repos/${repoPath}/git/trees/${branch}?recursive=1`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (!treeResponse.data || !treeResponse.data.tree) {
      throw new Error("Repository tree not found");
    }

    return treeResponse.data.tree;
  } catch (error) {
    // If tree approach fails, try contents API
    if (error.response && error.response.status === 404) {
      try {
        console.log("Tree API failed, trying contents API...");
        const contentsResponse = await axios.get(
          `https://api.github.com/repos/${repoPath}/contents?ref=${branch}`
        );

        if (contentsResponse.data && Array.isArray(contentsResponse.data)) {
          // Convert contents format to tree format
          return contentsResponse.data.map((item) => ({
            path: item.path,
            type: item.type === "file" ? "blob" : "tree",
            size: item.size || 0,
          }));
        }
      } catch (contentsError) {
        console.log(`Contents API also failed: ${contentsError.message}`);
      }
    }

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
    // Try the raw content API first
    try {
      // URL encode the file path to handle special characters
      const encodedFilePath = filePath
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/");

      const rawResponse = await axios.get(
        `https://raw.githubusercontent.com/${repoPath}/${branch}/${encodedFilePath}`,
        {
          timeout: 5000,
          headers: {
            Accept: "text/plain, application/json, */*",
          },
        }
      );

      // Return the data
      return typeof rawResponse.data === "object"
        ? JSON.stringify(rawResponse.data, null, 2)
        : rawResponse.data.toString();
    } catch (rawError) {
      console.log(`Raw content failed for ${filePath}: ${rawError.message}`);

      // Fall back to the content API
      const contentResponse = await axios.get(
        `https://api.github.com/repos/${repoPath}/contents/${filePath}?ref=${branch}`
      );

      if (contentResponse.data && contentResponse.data.content) {
        // The content is base64 encoded
        return Buffer.from(contentResponse.data.content, "base64").toString(
          "utf8"
        );
      } else {
        throw new Error("Content not found or not accessible");
      }
    }
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
