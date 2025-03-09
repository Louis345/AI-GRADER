const fetch = require('node-fetch');

/**
 * Parses a GitHub URL to extract owner and repo name
 * @param {string} url - The GitHub repository URL
 * @returns {Object} The owner and repo name
 */
function parseGitHubUrl(url) {
  // Clean up URL - remove trailing .git if present
  const cleanUrl = url.replace(/\.git$/, '');
  
  // Remove trailing slash if present
  const noTrailingSlash = cleanUrl.endsWith('/') ? cleanUrl.slice(0, -1) : cleanUrl;
  
  // Regular expression to match GitHub URLs
  const regex = /github\.com\/([^\/]+)\/([^\/]+)/;
  const match = noTrailingSlash.match(regex);
  
  if (!match) {
    throw new Error('Invalid GitHub URL format');
  }
  
  return {
    owner: match[1],
    repo: match[2]
  };
}

/**
 * Fetches the file list from a GitHub repository
 * @param {string} owner - The repository owner
 * @param {string} repo - The repository name
 * @returns {Promise<Array>} List of file objects
 */
async function getRepoFiles(owner, repo) {
  try {
    console.log(`Attempting to fetch GitHub repo: ${owner}/${repo}`);
    
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/main?recursive=1`);
    
    if (!response.ok) {
      console.log(`Main branch not found, trying master branch...`);
      // Try master branch if main doesn't exist
      const masterResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/master?recursive=1`);
      
      if (!masterResponse.ok) {
        // If both fail, try to fetch the default branch
        console.log(`Master branch not found, attempting to get default branch...`);
        const repoInfoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        
        if (!repoInfoResponse.ok) {
          throw new Error(`Failed to fetch repository content: ${masterResponse.statusText}`);
        }
        
        const repoInfo = await repoInfoResponse.json();
        const defaultBranch = repoInfo.default_branch;
        console.log(`Using default branch: ${defaultBranch}`);
        
        const defaultBranchResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`);
        
        if (!defaultBranchResponse.ok) {
          throw new Error(`Failed to fetch repository content from default branch: ${defaultBranchResponse.statusText}`);
        }
        
        const data = await defaultBranchResponse.json();
        return data.tree.filter(item => item.type === 'blob');
      }
      
      const data = await masterResponse.json();
      return data.tree.filter(item => item.type === 'blob');
    }
    
    const data = await response.json();
    return data.tree.filter(item => item.type === 'blob');
  } catch (error) {
    console.error('Error fetching repository file list:', error);
    throw error;
  }
}

/**
 * Fetches file content from GitHub
 * @param {string} owner - The repository owner
 * @param {string} repo - The repository name
 * @param {string} path - Path to the file
 * @returns {Promise<string>} The file content
 */
async function getFileContent(owner, repo, path) {
  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file content: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // GitHub API returns content as base64
    return Buffer.from(data.content, 'base64').toString('utf-8');
  } catch (error) {
    console.error(`Error fetching content for ${path}:`, error);
    return `/* Unable to fetch content for ${path} */`;
  }
}

/**
 * Gets relevant files from the repository
 * Filters out node_modules, images, etc.
 * @param {string} owner - The repository owner
 * @param {string} repo - The repository name
 * @returns {Promise<Object>} Object with file paths and their contents
 */
async function getRelevantFiles(owner, repo) {
  const files = await getRepoFiles(owner, repo);
  
  // Filter out irrelevant files
  const relevantFiles = files.filter(file => {
    const path = file.path.toLowerCase();
    // Exclude node_modules, images, and other binary files
    return !path.includes('node_modules/') && 
           !path.match(/\.(jpg|jpeg|png|gif|svg|ico|woff|ttf|eot)$/) &&
           !path.match(/package-lock\.json$/);
  });
  
  // Get content for HTML, CSS, JS files first (most important for grading)
  const priorityFiles = relevantFiles.filter(file => 
    file.path.match(/\.(html|css|js|jsx|ts|tsx)$/) && 
    file.path.length < 500 // Avoid extremely long paths
  );
  
  // Limit to 20 files to avoid API rate limits and excessive content
  const filesToFetch = priorityFiles.slice(0, 20);
  
  const fileContents = {};
  
  for (const file of filesToFetch) {
    fileContents[file.path] = await getFileContent(owner, repo, file.path);
  }
  
  return fileContents;
}

/**
 * Main function to process a GitHub repository
 * @param {string} url - The GitHub repository URL
 * @returns {Promise<string>} Formatted repository content
 */
async function processGitHubRepo(url) {
  try {
    const { owner, repo } = parseGitHubUrl(url);
    console.log(`Processing GitHub repository: ${owner}/${repo}`);
    const files = await getRelevantFiles(owner, repo);
    
    let formattedContent = `GitHub Repository: ${url}\n\n`;
    
    for (const [path, content] of Object.entries(files)) {
      formattedContent += `FILE: ${path}\n${'='.repeat(80)}\n${content}\n\n`;
    }
    
    return formattedContent;
  } catch (error) {
    console.error('Error processing GitHub repository:', error);
    throw error;
  }
}

module.exports = {
  parseGitHubUrl,
  processGitHubRepo
};
