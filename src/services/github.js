const axios = require("axios");
const path = require("path");
const fs = require("fs-extra");

/**
 * Process GitHub repository and extract relevant content
 * @param {string} repoUrl - GitHub repository URL (can be repo root, specific directory, or single file)
 * @returns {Promise<string>} Repository content as formatted text
 */
async function processGitHubRepo(repoUrl) {
  try {
    console.log(`Processing GitHub URL: ${repoUrl}`);

    // Check if this is a specific path (directory or file)
    if (repoUrl.includes("/tree/") || repoUrl.includes("/blob/")) {
      return await processSpecificPath(repoUrl);
    }

    // For root repository URLs, search intelligently for assignment files
    return await processEntireRepoWithSearch(repoUrl);
  } catch (error) {
    console.error(`Error processing GitHub repository: ${error.message}`);

    // Return a structured error message instead of throwing
    return `
# GitHub Repository: ${repoUrl}

## Repository Content:

I was able to detect that this repository exists but encountered issues accessing the specific content.

Error: ${error.message}

Please ensure the repository is public and all files are properly committed.
`;
  }
}

/**
 * Process a specific directory or file path from GitHub
 * @param {string} url - GitHub URL pointing to specific path
 * @returns {Promise<string>} Formatted content
 */
async function processSpecificPath(url) {
  console.log(`Processing specific GitHub path: ${url}`);

  // Parse the URL to extract components
  const urlParts = parseGitHubUrl(url);
  if (!urlParts) {
    throw new Error("Invalid GitHub URL format");
  }

  const { owner, repo, branch, path: filePath, isFile } = urlParts;
  console.log(
    `Owner: ${owner}, Repo: ${repo}, Branch: ${branch}, Path: ${filePath}`
  );

  if (isFile) {
    // Handle single file
    return await processSingleFile(owner, repo, branch, filePath);
  } else {
    // Handle directory
    return await processDirectory(owner, repo, branch, filePath);
  }
}

/**
 * Parse GitHub URL to extract components
 * @param {string} url - GitHub URL
 * @returns {Object|null} Parsed components or null if invalid
 */
function parseGitHubUrl(url) {
  // Handle tree URLs (directories)
  let match = url.match(
    /github\.com\/([^\/]+)\/([^\/]+)\/tree\/([^\/]+)\/(.+)/
  );
  if (match) {
    return {
      owner: match[1],
      repo: match[2],
      branch: match[3],
      path: match[4],
      isFile: false,
    };
  }

  // Handle blob URLs (single files)
  match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/);
  if (match) {
    return {
      owner: match[1],
      repo: match[2],
      branch: match[3],
      path: match[4],
      isFile: true,
    };
  }

  // Handle raw URLs (direct file access)
  match = url.match(
    /raw\.githubusercontent\.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/(.+)/
  );
  if (match) {
    return {
      owner: match[1],
      repo: match[2],
      branch: match[3],
      path: match[4],
      isFile: true,
    };
  }

  return null;
}

/**
 * Process a single file from GitHub
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name
 * @param {string} filePath - File path
 * @returns {Promise<string>} File content
 */
async function processSingleFile(owner, repo, branch, filePath) {
  try {
    // Try raw URL first
    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${filePath}`;
    console.log(`Fetching file from: ${rawUrl}`);

    const response = await axios.get(rawUrl);
    const fileName = filePath.split("/").pop();

    return formatRepositoryContent(`${owner}/${repo}`, [
      {
        path: filePath,
        content: response.data,
      },
    ]);
  } catch (error) {
    console.log(`Raw URL failed, trying API: ${error.message}`);

    // Fallback to GitHub API
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
    const response = await axios.get(apiUrl);

    const content = Buffer.from(response.data.content, "base64").toString(
      "utf8"
    );

    return formatRepositoryContent(`${owner}/${repo}`, [
      {
        path: filePath,
        content: content,
      },
    ]);
  }
}

/**
 * Process a directory from GitHub
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name
 * @param {string} dirPath - Directory path
 * @returns {Promise<string>} Directory content
 */
async function processDirectory(owner, repo, branch, dirPath) {
  try {
    console.log(`Fetching directory contents for: ${dirPath}`);

    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${dirPath}?ref=${branch}`;
    const response = await axios.get(apiUrl);

    if (!Array.isArray(response.data)) {
      throw new Error("Expected directory contents but got file");
    }

    const files = [];

    // Process each item in the directory
    for (const item of response.data) {
      if (item.type === "file" && shouldIncludeFile(item.name)) {
        try {
          let content;

          if (item.download_url) {
            // Use download URL if available
            const fileResponse = await axios.get(item.download_url);
            content = fileResponse.data;
          } else {
            // Fallback to API
            const fileApiResponse = await axios.get(item.url);
            content = Buffer.from(
              fileApiResponse.data.content,
              "base64"
            ).toString("utf8");
          }

          files.push({
            path: item.path,
            content:
              typeof content === "object"
                ? JSON.stringify(content, null, 2)
                : String(content),
          });
        } catch (fileError) {
          console.log(`Error fetching ${item.path}: ${fileError.message}`);
          files.push({
            path: item.path,
            content: `[Error fetching content: ${fileError.message}]`,
          });
        }
      } else if (item.type === "dir") {
        // Recursively process subdirectories (limit depth to avoid API limits)
        try {
          const subdirFiles = await processDirectory(
            owner,
            repo,
            branch,
            item.path
          );
          // Extract files from the subdirectory response
          const subdirMatch = subdirFiles.match(
            /## File: (.+?)\n```[\s\S]*?\n```/g
          );
          if (subdirMatch) {
            subdirMatch.forEach((fileBlock) => {
              const filePathMatch = fileBlock.match(/## File: (.+?)\n/);
              const contentMatch = fileBlock.match(
                /```[\s\S]*?\n([\s\S]*?)\n```/
              );
              if (filePathMatch && contentMatch) {
                files.push({
                  path: filePathMatch[1],
                  content: contentMatch[1],
                });
              }
            });
          }
        } catch (subdirError) {
          console.log(
            `Error processing subdirectory ${item.path}: ${subdirError.message}`
          );
        }
      }
    }

    return formatRepositoryContent(`${owner}/${repo}/${dirPath}`, files);
  } catch (error) {
    throw new Error(`Failed to fetch directory contents: ${error.message}`);
  }
}

/**
 * Process entire repository with intelligent search for assignment files
 * @param {string} repoUrl - Repository URL
 * @returns {Promise<string>} Repository content
 */
async function processEntireRepoWithSearch(repoUrl) {
  const repoPath = getRepoPath(repoUrl);
  const [owner, repo] = repoPath.split("/");

  try {
    // Get default branch
    const repoInfo = await axios.get(
      `https://api.github.com/repos/${repoPath}`
    );
    const defaultBranch = repoInfo.data.default_branch || "main";

    console.log(`🔍 Searching entire repository for assignment files...`);

    // Get all files recursively
    const allFiles = await getAllFilesRecursively(
      owner,
      repo,
      defaultBranch,
      ""
    );

    // Filter and prioritize relevant files
    const relevantFiles = filterAndPrioritizeFiles(allFiles);

    console.log(
      `📁 Found ${allFiles.length} total files, selected ${relevantFiles.length} relevant files`
    );

    return formatRepositoryContent(`${owner}/${repo}`, relevantFiles);
  } catch (error) {
    throw new Error(`Failed to process repository: ${error.message}`);
  }
}

/**
 * Get all files recursively from a repository
 * @param {string} owner - Repository owner
 * @param {string} repo - Repository name
 * @param {string} branch - Branch name
 * @param {string} path - Current path
 * @returns {Promise<Array>} Array of all files
 */
async function getAllFilesRecursively(owner, repo, branch, path) {
  const allFiles = [];

  try {
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
    const response = await axios.get(apiUrl);

    if (!Array.isArray(response.data)) {
      // Single file
      if (shouldIncludeFile(response.data.name)) {
        const content = await getFileContent(response.data);
        allFiles.push({
          path: response.data.path,
          content: content,
          name: response.data.name,
          size: response.data.size,
        });
      }
      return allFiles;
    }

    // Process each item
    for (const item of response.data) {
      if (item.type === "file" && shouldIncludeFile(item.name)) {
        try {
          const content = await getFileContent(item);
          allFiles.push({
            path: item.path,
            content: content,
            name: item.name,
            size: item.size,
          });
        } catch (fileError) {
          console.log(`⚠️ Error fetching ${item.path}: ${fileError.message}`);
          allFiles.push({
            path: item.path,
            content: `[Error fetching content: ${fileError.message}]`,
            name: item.name,
            size: item.size,
          });
        }
      } else if (item.type === "dir" && shouldExploreDirectory(item.name)) {
        // Recursively get files from subdirectories (limit depth to avoid API limits)
        const subdirFiles = await getAllFilesRecursively(
          owner,
          repo,
          branch,
          item.path
        );
        allFiles.push(...subdirFiles);
      }
    }
  } catch (error) {
    console.log(`⚠️ Error accessing path ${path}: ${error.message}`);
  }

  return allFiles;
}

/**
 * Get file content from GitHub API response
 * @param {Object} fileItem - GitHub API file item
 * @returns {Promise<string>} File content
 */
async function getFileContent(fileItem) {
  try {
    if (fileItem.download_url) {
      // Use download URL if available (faster)
      const response = await axios.get(fileItem.download_url);
      return typeof response.data === "object"
        ? JSON.stringify(response.data, null, 2)
        : String(response.data);
    } else if (fileItem.content) {
      // Decode base64 content
      return Buffer.from(fileItem.content, "base64").toString("utf8");
    } else {
      // Fetch via API
      const response = await axios.get(fileItem.url);
      return Buffer.from(response.data.content, "base64").toString("utf8");
    }
  } catch (error) {
    throw new Error(`Failed to fetch file content: ${error.message}`);
  }
}

/**
 * Filter and prioritize files for assignment evaluation
 * @param {Array} allFiles - All files found
 * @returns {Array} Filtered and prioritized files
 */
function filterAndPrioritizeFiles(allFiles) {
  // Priority scoring for different file types and locations
  const priorityScore = (file) => {
    let score = 0;
    const path = file.path.toLowerCase();
    const name = file.name.toLowerCase();

    // High priority: Main assignment files
    if (
      name.includes("index.") ||
      name.includes("main.") ||
      name.includes("app.")
    )
      score += 50;
    if (name.includes("war.") || name.includes("game.")) score += 40;

    // Medium priority: JavaScript/HTML/CSS files
    if (name.endsWith(".js") || name.endsWith(".jsx")) score += 30;
    if (name.endsWith(".html") || name.endsWith(".htm")) score += 25;
    if (name.endsWith(".css")) score += 20;
    if (
      name.endsWith(".json") &&
      (name.includes("package") || name.includes("config"))
    )
      score += 15;

    // File location bonuses
    if (
      path.includes("week") ||
      path.includes("assignment") ||
      path.includes("project")
    )
      score += 20;
    if (path.split("/").length <= 2) score += 10; // Prefer files closer to root

    // Content size considerations (avoid empty files, prefer substantial content)
    if (file.size > 100) score += 5;
    if (file.size > 1000) score += 5;

    // Penalties for common non-assignment files
    if (path.includes("node_modules") || path.includes(".git")) score -= 100;
    if (
      name.includes("test") &&
      !name.includes("war") &&
      !name.includes("game")
    )
      score -= 10;

    return score;
  };

  // Sort by priority score and take the most relevant files
  const scored = allFiles
    .map((file) => ({
      ...file,
      priority: priorityScore(file),
    }))
    .sort((a, b) => b.priority - a.priority);

  // Take top 15 files, but ensure we get the most important ones
  const topFiles = scored.slice(0, 15);

  // Always include certain high-value files if they exist
  const mustInclude = scored.filter(
    (file) =>
      file.priority >= 40 ||
      file.name.toLowerCase().includes("readme") ||
      file.name.toLowerCase().includes("package.json")
  );

  // Combine and deduplicate
  const combined = [
    ...new Map(
      [...mustInclude, ...topFiles].map((file) => [file.path, file])
    ).values(),
  ];

  console.log(`📋 File priorities (top 10):`);
  combined.slice(0, 10).forEach((file) => {
    console.log(`  ${file.path} (score: ${file.priority})`);
  });

  return combined;
}

/**
 * Check if we should explore this directory
 * @param {string} dirName - Directory name
 * @returns {boolean} Whether to explore
 */
function shouldExploreDirectory(dirName) {
  const exclude = [
    "node_modules",
    ".git",
    ".github",
    "dist",
    "build",
    "coverage",
    ".nyc_output",
    "logs",
    "tmp",
    "temp",
  ];

  return !exclude.some((excluded) => dirName.toLowerCase().includes(excluded));
}

/**
 * Check if we should include this file type
 * @param {string} fileName - File name
 * @returns {boolean} Whether to include the file
 */
function shouldIncludeFile(fileName) {
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
    if (fileName.toLowerCase().endsWith(ext)) return false;
  }

  return true;
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
  formattedContent += `Found ${files.length} relevant files (searched entire repository)\n\n`;

  // Group files by type for summary
  const fileTypes = {};
  files.forEach((file) => {
    const ext = path.extname(file.path).toLowerCase() || "no extension";
    fileTypes[ext] = (fileTypes[ext] || 0) + 1;
  });

  // Show file type breakdown
  Object.entries(fileTypes).forEach(([ext, count]) => {
    formattedContent += `- ${ext}: ${count} files\n`;
  });

  formattedContent += `\n## Repository Structure:\n`;

  // Show directory structure
  const directories = new Set();
  files.forEach((file) => {
    const dir = path.dirname(file.path);
    if (dir !== ".") directories.add(dir);
  });

  if (directories.size > 0) {
    Array.from(directories)
      .sort()
      .forEach((dir) => {
        formattedContent += `📁 ${dir}/\n`;
      });
    formattedContent += `\n`;
  }

  formattedContent += `## File Contents:\n\n`;

  // Process each file with priority order maintained
  for (const file of files) {
    const size = file.size ? ` (${file.size} bytes)` : "";
    formattedContent += `## File: ${file.path}${size}\n`;

    if (file.priority !== undefined) {
      formattedContent += `*Priority Score: ${file.priority}*\n`;
    }

    formattedContent += `\`\`\`${getFileExtension(file.path)}\n${
      file.content
    }\n\`\`\`\n\n`;
  }

  return formattedContent;
}

/**
 * Extract repository path from URL
 * @param {string} url - GitHub repository URL
 * @returns {string} Repository path (owner/repo)
 */
function getRepoPath(url) {
  if (url.includes("github.com")) {
    const match = url.match(/github\.com\/([^\/]+\/[^\/]+)/);
    if (match) {
      return match[1].replace(".git", "");
    }
  }

  throw new Error("Invalid GitHub URL format");
}

/**
 * Get file extension for syntax highlighting
 * @param {string} filePath - File path
 * @returns {string} File extension for syntax highlighting
 */
function getFileExtension(filePath) {
  const ext = path.extname(filePath).toLowerCase().substring(1);

  const languageMap = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    py: "python",
    html: "html",
    css: "css",
    json: "json",
    md: "markdown",
    txt: "text",
  };

  return languageMap[ext] || "";
}

module.exports = { processGitHubRepo };
