const axios = require("axios");
const path = require("path");

const GITHUB_CONFIG = {
  MAX_FILES: 20,
  MAX_FILE_SIZE: 50000,
  MAX_TOTAL_SIZE: 150000,
  PRIORITY_FILES: [
    "package.json",
    "README.md",
    "script.js",
    "main.js",
    "war.js",
    "game.js",
    "index.js",
    "app.js",
    "src/App.js",
    "src/App.jsx",
    "src/App.tsx",
    "src/index.js",
    "src/index.jsx",
    "src/index.tsx",
    "src/script.js",
  ],
};

async function processGitHubRepo(repoUrl) {
  try {
    console.log(`📦 Processing GitHub URL: ${repoUrl}`);

    // Determine URL type and route accordingly
    const urlType = analyzeGitHubUrl(repoUrl);
    console.log(`📊 URL Type Detected: ${urlType.type}`);
    console.log(`📊 Branch Detected: ${urlType.branch}`);

    switch (urlType.type) {
      case "NESTED_DIRECTORY":
        // e.g., /tree/main/Final-Project OR /tree/master/Todo-app
        return await processNestedDirectory(urlType);

      case "ROOT_REPOSITORY":
        // e.g., github.com/user/repo
        return await processRootRepository(urlType);

      case "SINGLE_FILE":
        // e.g., /blob/main/src/App.js
        return await processSingleFile(urlType);

      case "SRC_DIRECTORY":
        // e.g., /tree/main/src
        return await processSourceDirectory(urlType);

      default:
        throw new Error(`Unsupported URL type: ${urlType.type}`);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    return generateErrorReport(repoUrl, error);
  }
}

function analyzeGitHubUrl(url) {
  // Remove trailing slashes
  url = url.replace(/\/+$/, "");

  // Check for nested directory (e.g., /tree/main/Final-Project OR /tree/master/Todo-app)
  let match = url.match(
    /github\.com\/([^\/]+)\/([^\/]+)\/tree\/([^\/]+)(?:\/(.+))?/
  );
  if (match) {
    const [, owner, repo, branch, path] = match;

    // If no path specified, treat as root repository with specific branch
    if (!path) {
      return {
        type: "ROOT_REPOSITORY",
        owner,
        repo,
        branch,
        url,
      };
    }

    // Check if it's a nested project (common patterns)
    const isNested = path.match(
      /^(Final-Project|final-project|project|client|frontend|my-app|Todo-app|todo-app)/i
    );
    const isSrc = path.match(/^src$/i);

    return {
      type: isNested
        ? "NESTED_DIRECTORY"
        : isSrc
        ? "SRC_DIRECTORY"
        : "NESTED_DIRECTORY",
      owner,
      repo,
      branch,
      path,
      url,
    };
  }

  // Check for single file
  match = url.match(/github\.com\/([^\/]+)\/([^\/]+)\/blob\/([^\/]+)\/(.+)/);
  if (match) {
    return {
      type: "SINGLE_FILE",
      owner: match[1],
      repo: match[2],
      branch: match[3],
      path: match[4],
      url,
    };
  }

  // Check for root repository
  match = url.match(/github\.com\/([^\/]+)\/([^\/]+)(?:\/)?$/);
  if (match) {
    return {
      type: "ROOT_REPOSITORY",
      owner: match[1],
      repo: match[2],
      branch: null, // Will be determined later
      url,
    };
  }

  return { type: "UNKNOWN", url };
}

/**
 * Process nested directory (student created project in subdirectory)
 */
async function processNestedDirectory(urlInfo) {
  const { owner, repo, branch, path: nestedPath } = urlInfo;

  console.log(`📂 Processing nested project in: ${nestedPath}/`);
  console.log(`📂 Using branch: ${branch}`);
  console.log(`  This appears to be a nested submission structure`);

  const files = [];
  let totalSize = 0;

  // First, check if this nested directory has a package.json (validates it's a project root)
  const packageJsonUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${nestedPath}/package.json?ref=${branch}`;
  const hasPackageJson = await checkFileExists(packageJsonUrl);

  if (!hasPackageJson) {
    console.log(`⚠️ Warning: No package.json found in ${nestedPath}/`);
  }

  // Priority files for nested structure
  const priorityPaths = [
    `${nestedPath}/package.json`,
    `${nestedPath}/README.md`,
    `${nestedPath}/src/App.js`,
    `${nestedPath}/src/App.jsx`,
    `${nestedPath}/src/App.tsx`,
    `${nestedPath}/src/index.js`,
    `${nestedPath}/src/index.jsx`,
    `${nestedPath}/src/index.tsx`,
    // Add common root-level files for Todo apps
    `${nestedPath}/index.html`,
    `${nestedPath}/style.css`,
    `${nestedPath}/styles.css`,
    `${nestedPath}/script.js`,
    `${nestedPath}/main.js`,
  ];

  // Fetch priority files
  for (const filePath of priorityPaths) {
    if (totalSize >= GITHUB_CONFIG.MAX_TOTAL_SIZE) break;

    const file = await fetchFile(owner, repo, branch, filePath);
    if (file && file.content) {
      files.push({
        ...file,
        path: file.path.replace(`${nestedPath}/`, ""), // Normalize path
        priority: true,
      });
      totalSize += file.content.length;
      console.log(`  ✅ Added priority file: ${file.path}`);
    }
  }

  // Fetch component files (if it's a React app)
  const componentsPath = `${nestedPath}/src/components`;
  const components = await fetchDirectory(
    owner,
    repo,
    branch,
    componentsPath,
    5
  );
  files.push(
    ...components.map((f) => ({
      ...f,
      path: f.path.replace(`${nestedPath}/`, ""), // Normalize path
    }))
  );

  // Also try to get any additional JS/CSS files in the root of nested directory
  const additionalFiles = await fetchDirectory(
    owner,
    repo,
    branch,
    nestedPath,
    8
  );

  // Filter out already fetched priority files and add the rest
  const newFiles = additionalFiles.filter(
    (f) =>
      !files.some(
        (existing) => existing.path === f.path.replace(`${nestedPath}/`, "")
      )
  );

  files.push(
    ...newFiles
      .map((f) => ({
        ...f,
        path: f.path.replace(`${nestedPath}/`, ""), // Normalize path
      }))
      .slice(0, 5) // Limit additional files
  );

  return formatOutput(owner, repo, files, "NESTED", nestedPath, branch);
}

/**
 * Process root repository (correctly submitted project)
 */
async function processRootRepository(urlInfo) {
  const { owner, repo } = urlInfo;
  let { branch } = urlInfo;

  console.log(`📦 Processing root repository: ${owner}/${repo}`);

  // Get default branch if not specified
  if (!branch) {
    try {
      const repoInfo = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}`
      );
      branch = repoInfo.data.default_branch || "main";
      console.log(`🌿 Default branch detected: ${branch}`);
    } catch (error) {
      console.log(`⚠️ Could not fetch repo info, trying 'main' branch`);
      branch = "main";
    }
  } else {
    console.log(`🌿 Using specified branch: ${branch}`);
  }

  console.log(`  This appears to be a correctly structured submission`);

  const files = [];
  let totalSize = 0;

  // Check if package.json exists at root (correct structure)
  const hasRootPackageJson = await checkFileExists(
    `https://api.github.com/repos/${owner}/${repo}/contents/package.json?ref=${branch}`
  );

  if (!hasRootPackageJson) {
    console.log(`⚠️ No package.json at root - checking for nested projects...`);

    // Look for common nested patterns
    const possibleNested = [
      "Final-Project",
      "final-project",
      "client",
      "frontend",
      "Todo-app",
      "todo-app",
    ];
    for (const nested of possibleNested) {
      const nestedExists = await checkFileExists(
        `https://api.github.com/repos/${owner}/${repo}/contents/${nested}/package.json?ref=${branch}`
      );
      if (nestedExists) {
        console.log(`📍 Found nested project in: ${nested}/`);
        return processNestedDirectory({
          owner,
          repo,
          branch,
          path: nested,
          type: "NESTED_DIRECTORY",
        });
      }
    }
  }

  // Process as normal root repository
  const priorityPaths = GITHUB_CONFIG.PRIORITY_FILES;

  for (const filePath of priorityPaths) {
    if (totalSize >= GITHUB_CONFIG.MAX_TOTAL_SIZE) break;

    const file = await fetchFile(owner, repo, branch, filePath);
    if (file && file.content) {
      files.push({ ...file, priority: true });
      totalSize += file.content.length;
      console.log(`  ✅ Added: ${file.path}`);
    }
  }

  // Fetch src components
  const components = await fetchDirectory(
    owner,
    repo,
    branch,
    "src/components",
    5
  );
  files.push(...components);

  // Also check src/Components (capital C)
  if (components.length === 0) {
    const componentsCapital = await fetchDirectory(
      owner,
      repo,
      branch,
      "src/Components",
      5
    );
    files.push(...componentsCapital);
  }

  // For Todo apps and similar, also check for root-level files
  const rootFiles = ["index.html", "style.css", "styles.css"];
  for (const fileName of rootFiles) {
    if (totalSize >= GITHUB_CONFIG.MAX_TOTAL_SIZE) break;

    const file = await fetchFile(owner, repo, branch, fileName);
    if (file && file.content) {
      files.push({ ...file, priority: false });
      totalSize += file.content.length;
      console.log(`  ✅ Added root file: ${file.path}`);
    }
  }

  return formatOutput(owner, repo, files, "ROOT", null, branch);
}

/**
 * Process source directory directly
 */
async function processSourceDirectory(urlInfo) {
  const { owner, repo, branch, path: srcPath } = urlInfo;

  console.log(`📁 Processing src directory: ${srcPath}`);
  console.log(`🌿 Using branch: ${branch}`);

  const files = [];

  // Get main app files from src
  const appFiles = [
    "App.js",
    "App.jsx",
    "App.tsx",
    "index.js",
    "index.jsx",
    "index.tsx",
  ];
  for (const fileName of appFiles) {
    const file = await fetchFile(owner, repo, branch, `${srcPath}/${fileName}`);
    if (file) files.push(file);
  }

  // Get components
  const components = await fetchDirectory(
    owner,
    repo,
    branch,
    `${srcPath}/components`,
    8
  );
  files.push(...components);

  // Get parent package.json if exists
  const packageJson = await fetchFile(owner, repo, branch, "package.json");
  if (packageJson) files.push({ ...packageJson, priority: true });

  return formatOutput(owner, repo, files, "SRC_ONLY", srcPath, branch);
}

/**
 * Helper: Check if file exists
 */
async function checkFileExists(url) {
  try {
    const response = await axios.get(url);
    return response.status === 200;
  } catch {
    return false;
  }
}

/**
 * Helper: Fetch single file
 */
async function fetchFile(owner, repo, branch, filePath) {
  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`;
    console.log(`🔍 Fetching: ${url}`);
    const response = await axios.get(url);

    if (response.data && response.data.content) {
      const content = Buffer.from(response.data.content, "base64").toString(
        "utf8"
      );
      return {
        path: filePath,
        content: truncateContent(content, GITHUB_CONFIG.MAX_FILE_SIZE),
      };
    }
  } catch (error) {
    console.log(
      `  ❌ Could not fetch ${filePath}: ${
        error.response?.status || error.message
      }`
    );
    return null;
  }
}

/**
 * Helper: Fetch directory contents
 */
async function fetchDirectory(owner, repo, branch, dirPath, maxFiles = 5) {
  const files = [];

  try {
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${dirPath}?ref=${branch}`;
    console.log(`📂 Fetching directory: ${url}`);
    const response = await axios.get(url);

    if (Array.isArray(response.data)) {
      const relevantFiles = response.data
        .filter((item) => item.type === "file")
        .filter(
          (item) =>
            !item.name.includes(".test.") &&
            !item.name.includes(".spec.") &&
            !item.name.startsWith(".") &&
            (item.name.endsWith(".js") ||
              item.name.endsWith(".jsx") ||
              item.name.endsWith(".ts") ||
              item.name.endsWith(".tsx") ||
              item.name.endsWith(".css") ||
              item.name.endsWith(".html"))
        )
        .slice(0, maxFiles);

      for (const file of relevantFiles) {
        const fileContent = await fetchFile(owner, repo, branch, file.path);
        if (fileContent) {
          files.push(fileContent);
          console.log(`  ✅ Added: ${file.path}`);
        }
      }
    }
  } catch (error) {
    // Directory doesn't exist
    console.log(
      `  ℹ️ Directory not found: ${dirPath} (${
        error.response?.status || error.message
      })`
    );
  }

  return files;
}

/**
 * Helper: Format output
 */
function formatOutput(
  owner,
  repo,
  files,
  submissionType,
  nestedPath = null,
  branch = null
) {
  let output = `# GitHub Repository: ${owner}/${repo}\n\n`;

  output += `## Submission Analysis:\n`;
  output += `- **Submission Type:** ${
    submissionType === "NESTED"
      ? "⚠️ Nested Project Structure"
      : "✅ Correct Root Structure"
  }\n`;
  if (branch) {
    output += `- **Branch:** ${branch}\n`;
  }
  if (nestedPath) {
    output += `- **Project Location:** ${nestedPath}/\n`;
  }
  output += `- **Files Retrieved:** ${files.length}\n`;
  output += `- **Repository Accessible:** ✅ Yes\n`;

  const hasPackageJson = files.some((f) => f.path.includes("package.json"));
  const hasAppFile = files.some((f) => f.path.includes("App."));
  const hasComponents = files.some((f) =>
    f.path.toLowerCase().includes("component")
  );
  const hasIndexHtml = files.some((f) => f.path.includes("index.html"));
  const hasCssFile = files.some((f) => f.path.match(/\.(css|scss|sass)$/));
  const hasJsFile = files.some((f) => f.path.match(/\.(js|jsx|ts|tsx)$/));

  output += `- **package.json found:** ${hasPackageJson ? "✅" : "❌"}\n`;
  output += `- **App file found:** ${hasAppFile ? "✅" : "❌"}\n`;
  output += `- **Components found:** ${hasComponents ? "✅" : "❌"}\n`;
  output += `- **HTML file found:** ${hasIndexHtml ? "✅" : "❌"}\n`;
  output += `- **CSS file found:** ${hasCssFile ? "✅" : "❌"}\n`;
  output += `- **JavaScript file found:** ${hasJsFile ? "✅" : "❌"}\n\n`;

  if (submissionType === "NESTED") {
    output += `### ⚠️ Note for Student:\n`;
    output += `Your project is nested in a subdirectory (${nestedPath}/). `;
    output += `For future submissions, consider placing your project files directly in the repository root.\n\n`;
  }

  output += `## File Contents:\n\n`;

  // Sort files to show priority files first
  const sortedFiles = files.sort((a, b) => {
    if (a.priority && !b.priority) return -1;
    if (!a.priority && b.priority) return 1;
    return 0;
  });

  for (const file of sortedFiles) {
    const ext = path.extname(file.path).substring(1);
    const lang = getLanguageFromExtension(ext);

    output += `### File: ${file.path}${file.priority ? " 📌" : ""}\n`;
    output += `\`\`\`${lang}\n`;
    output += file.content;
    output += `\n\`\`\`\n\n`;
  }

  return output;
}

/**
 * Helper: Generate error report
 */
function generateErrorReport(url, error) {
  return (
    `# GitHub Repository Access Error\n\n` +
    `## Repository URL: ${url}\n\n` +
    `## Error Details:\n` +
    `- **Error Type:** ${error.message}\n` +
    `- **Repository Accessible:** ❌ Unable to verify\n\n` +
    `## Troubleshooting:\n` +
    `1. Ensure the repository is public\n` +
    `2. Check the URL is correct\n` +
    `3. Verify all files are committed and pushed\n` +
    `4. Check if the branch name is correct (master vs main)\n\n` +
    `## Grading Note:\n` +
    `Unable to fully evaluate the submission due to repository access issues.\n`
  );
}

/**
 * Helper: Truncate content
 */
function truncateContent(content, maxLength) {
  if (!content) return "";
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + "\n// ... [truncated for length]";
}

/**
 * Helper: Get language from file extension
 */
function getLanguageFromExtension(ext) {
  const map = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    json: "json",
    md: "markdown",
    css: "css",
    html: "html",
  };
  return map[ext] || "";
}

/**
 * Process single file (backward compatibility)
 */
async function processSingleFile(urlInfo) {
  const { owner, repo, branch, path: filePath } = urlInfo;
  const file = await fetchFile(owner, repo, branch, filePath);

  if (!file) {
    throw new Error(`Could not fetch file: ${filePath}`);
  }

  return formatOutput(owner, repo, [file], "SINGLE_FILE", null, branch);
}

module.exports = { processGitHubRepo };
