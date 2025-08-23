// CORRECTED src/services/ai.js with proper week-specific validation
const Anthropic = require("@anthropic-ai/sdk");
const config = require("../../config/config");

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Validates API implementation for Week 12 ONLY
 */
function validateWeek12APIImplementation(githubContent) {
  const validations = {
    hasRealFetch: false,
    hasAsyncAwait: false,
    hasPOST: false,
    hasDELETE: false,
    hasGET: false,
    hasErrorHandling: false,
    usesHardcodedData: false,
    actualAPICallsFound: [],
  };

  // Check for real fetch/axios calls with actual endpoints
  const fetchPattern = /fetch\s*\(\s*['"](https?:\/\/[^'"]+|\/api\/[^'"]+)/gi;
  const axiosPattern =
    /axios\.(get|post|put|delete|patch)\s*\(\s*['"](https?:\/\/[^'"]+)/gi;

  const fetchMatches = githubContent.match(fetchPattern) || [];
  const axiosMatches = githubContent.match(axiosPattern) || [];

  validations.hasRealFetch = fetchMatches.length > 0 || axiosMatches.length > 0;
  validations.actualAPICallsFound = [...fetchMatches, ...axiosMatches];

  // Check for proper async/await implementation
  const asyncAwaitPattern =
    /async\s+function.*?await\s+fetch|async\s*\(\s*\)\s*=>\s*{[\s\S]*?await/gi;
  validations.hasAsyncAwait = asyncAwaitPattern.test(githubContent);

  // Check for CRUD operations
  validations.hasPOST = /method:\s*['"]POST['"]|\.post\(/gi.test(githubContent);
  validations.hasDELETE = /method:\s*['"]DELETE['"]|\.delete\(/gi.test(
    githubContent
  );
  validations.hasGET = /method:\s*['"]GET['"]|\.get\(|fetch\(/gi.test(
    githubContent
  );

  // Check for error handling
  validations.hasErrorHandling =
    /\.catch\(|try\s*{[\s\S]*?catch|\.then\([\s\S]*?,\s*[\s\S]*?\)/gi.test(
      githubContent
    );

  // Check for forms (needed for POST)
  validations.hasFormElements =
    /<form|document\.createElement\(['"]form|<input/gi.test(githubContent);

  return validations;
}

/**
 * Validates WAR card game implementation for Week 9
 */
function validateWeek9WARGame(githubContent) {
  const validations = {
    hasCardClass: false,
    hasDeckClass: false,
    hasPlayerClass: false,
    deals26Cards: false,
    playsAllRounds: false,
    hasPointSystem: false,
    declaresWinner: false,
    usesOOP: false,
    hasUnitTests: false,
  };

  // Check for OOP classes
  validations.hasCardClass = /class\s+Card\s*{|function\s+Card\s*\(/gi.test(
    githubContent
  );
  validations.hasDeckClass = /class\s+Deck\s*{|function\s+Deck\s*\(/gi.test(
    githubContent
  );
  validations.hasPlayerClass =
    /class\s+Player\s*{|function\s+Player\s*\(/gi.test(githubContent);

  // Check for dealing logic
  validations.deals26Cards = /26|twenty.?six/gi.test(githubContent);

  // Check for game loop
  validations.playsAllRounds = /for\s*\(|while\s*\(|\.forEach|rounds/gi.test(
    githubContent
  );

  // Check for scoring
  validations.hasPointSystem = /score|points?|wins?/gi.test(githubContent);

  // Check for winner declaration
  validations.declaresWinner = /winner|won|wins|victory/gi.test(githubContent);

  // Check OOP usage
  validations.usesOOP =
    validations.hasCardClass ||
    validations.hasDeckClass ||
    validations.hasPlayerClass;

  // Check for unit tests (bonus)
  validations.hasUnitTests =
    /describe\s*\(|it\s*\(|test\s*\(|expect\s*\(/gi.test(githubContent);

  return validations;
}

// Updated validateWeek12APIImplementation function in src/services/ai.js

function validateWeek12APIImplementation(githubContent) {
  const validations = {
    hasRealFetch: false,
    hasAsyncAwait: false,
    hasPOST: false,
    hasDELETE: false,
    hasGET: false,
    hasErrorHandling: false,
    usesJsonServer: false,
    actualAPICallsFound: [],
  };

  // More flexible fetch detection patterns
  const fetchPatterns = [
    // Standard fetch with URL
    /fetch\s*\(\s*["'`]([^"'`]+)["'`]/gi,
    // Fetch with variable
    /fetch\s*\(\s*[A-Z_]+\s*[,\)]/gi,
    // Fetch with template literal
    /fetch\s*\(\s*`[^`]+`/gi,
  ];

  // Check for any fetch usage
  for (const pattern of fetchPatterns) {
    const matches = githubContent.match(pattern) || [];
    if (matches.length > 0) {
      validations.hasRealFetch = true;
      validations.actualAPICallsFound.push(...matches);
    }
  }

  // Also check for localhost/json-server specifically
  if (
    githubContent.includes("localhost:3000") ||
    githubContent.includes("localhost:5000") ||
    githubContent.includes("json-server")
  ) {
    validations.usesJsonServer = true;
    validations.hasRealFetch = true; // json-server IS a real API
  }

  // Check for async/await OR promises (.then)
  const hasAsync = /async\s+function|async\s*\(/gi.test(githubContent);
  const hasAwait = /await\s+/gi.test(githubContent);
  const hasPromises = /\.then\s*\(/gi.test(githubContent);

  validations.hasAsyncAwait = hasAsync || hasAwait || hasPromises;

  // Check for CRUD operations (more flexible patterns)
  const postPatterns = [
    /method:\s*["']POST["']/gi,
    /method:\s*"POST"/gi,
    /\.post\(/gi,
  ];

  const deletePatterns = [
    /method:\s*["']DELETE["']/gi,
    /method:\s*"DELETE"/gi,
    /\.delete\(/gi,
  ];

  const getPatterns = [
    /fetch\s*\([^)]*\)\s*\.then/gi, // fetch().then pattern
    /fetch\s*\([^)]*\)(?!\s*,)/gi, // fetch without second parameter (defaults to GET)
    /\.get\(/gi,
  ];

  // Check each pattern type
  validations.hasPOST = postPatterns.some((pattern) =>
    pattern.test(githubContent)
  );
  validations.hasDELETE = deletePatterns.some((pattern) =>
    pattern.test(githubContent)
  );
  validations.hasGET = getPatterns.some((pattern) =>
    pattern.test(githubContent)
  );

  // Check for error handling (try/catch or .catch)
  validations.hasErrorHandling =
    /try\s*{/gi.test(githubContent) || /\.catch\s*\(/gi.test(githubContent);

  // Check for forms
  validations.hasFormElements =
    /<form/gi.test(githubContent) ||
    /getElementById.*Input/gi.test(githubContent) ||
    /querySelector.*input/gi.test(githubContent);

  // Check for db.json file (indicates json-server usage)
  if (
    githubContent.includes("db.json") ||
    githubContent.includes('"Events"') ||
    githubContent.includes("localhost")
  ) {
    validations.usesJsonServer = true;
  }

  // Log findings for debugging
  console.log("🔍 API Detection Results:");
  console.log(`  Fetch calls found: ${validations.hasRealFetch ? "✅" : "❌"}`);
  console.log(
    `  JSON Server detected: ${validations.usesJsonServer ? "✅" : "❌"}`
  );
  console.log(
    `  Async/Promises used: ${validations.hasAsyncAwait ? "✅" : "❌"}`
  );
  console.log(`  POST operations: ${validations.hasPOST ? "✅" : "❌"}`);
  console.log(`  DELETE operations: ${validations.hasDELETE ? "✅" : "❌"}`);
  console.log(`  GET operations: ${validations.hasGET ? "✅" : "❌"}`);

  if (validations.actualAPICallsFound.length > 0) {
    console.log(
      `  API calls found: ${validations.actualAPICallsFound
        .slice(0, 3)
        .join(", ")}`
    );
  }

  return validations;
}

/**
 * Main evaluation function with week-specific validation
 */
async function evaluateAssignment({
  studentName,
  studentEmail,
  weekConfig,
  githubContent,
  youtubeTranscript,
  hasYoutubeVideo = true,
}) {
  try {
    let codeAnalysis = null;
    let validationType = null;

    // Apply week-specific validation
    switch (weekConfig.weekNumber) {
      case 9:
        console.log("📊 Analyzing Week 9 WAR Card Game...");
        codeAnalysis = validateWeek9WARGame(githubContent);
        validationType = "WAR_GAME";
        break;
      case 12:
        console.log("📊 Analyzing Week 12 API Implementation...");
        codeAnalysis = validateWeek12APIImplementation(githubContent);
        validationType = "API";
        break;
      default:
        console.log(
          "📊 No specific validation for Week",
          weekConfig.weekNumber
        );
        validationType = "GENERAL";
    }

    if (codeAnalysis) {
      console.log(`✅ ${validationType} Analysis Complete:`, codeAnalysis);
    }

    // Construct the prompt with appropriate validation
    const prompt = constructWeekSpecificPrompt({
      studentName,
      studentEmail,
      weekConfig,
      githubContent,
      youtubeTranscript,
      hasYoutubeVideo,
      codeAnalysis,
      validationType,
    });

    console.log("🤖 Sending request to Claude with week-specific grading...");

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: config.anthropic.model,
      max_tokens: config.anthropic.maxTokens,
      system: getWeekSpecificSystemPrompt(
        weekConfig,
        codeAnalysis,
        validationType
      ),
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const rawResponse = response.content.reduce(
      (acc, item) => (item.text ? acc + item.text : acc),
      ""
    );

    const formattedHtml = formatResponseToHtml(rawResponse);

    return {
      rawResponse,
      formattedHtml,
      codeAnalysis,
    };
  } catch (error) {
    console.error("Error in AI evaluation:", error);
    throw new Error(`AI evaluation failed: ${error.message}`);
  }
}

/**
 * Construct week-specific evaluation prompt
 */
function constructWeekSpecificPrompt({
  studentName,
  studentEmail,
  weekConfig,
  githubContent,
  youtubeTranscript,
  hasYoutubeVideo,
  codeAnalysis,
  validationType,
}) {
  let prompt = `
Student: ${studentName} (${studentEmail})
Assignment: ${weekConfig.name} (Week ${weekConfig.weekNumber})

# GRADING RUBRIC - ${weekConfig.name}
**TOTAL POINTS: ${weekConfig.totalPoints}**
`;

  // Add week-specific validation results
  if (validationType === "WAR_GAME" && codeAnalysis) {
    prompt += `
## CODE ANALYSIS - WAR CARD GAME (Week 9):
### Object-Oriented Programming Check:
- **Card Class Found:** ${codeAnalysis.hasCardClass ? "YES ✅" : "NO ❌"}
- **Deck Class Found:** ${codeAnalysis.hasDeckClass ? "YES ✅" : "NO ❌"}
- **Player Class Found:** ${codeAnalysis.hasPlayerClass ? "YES ✅" : "NO ❌"}
- **Uses OOP Concepts:** ${codeAnalysis.usesOOP ? "YES ✅" : "NO ❌"}

### Game Implementation Check:
- **Deals 26 Cards:** ${codeAnalysis.deals26Cards ? "YES ✅" : "NO ❌"}
- **Plays All Rounds:** ${codeAnalysis.playsAllRounds ? "YES ✅" : "NO ❌"}
- **Has Point System:** ${codeAnalysis.hasPointSystem ? "YES ✅" : "NO ❌"}
- **Declares Winner:** ${codeAnalysis.declaresWinner ? "YES ✅" : "NO ❌"}

### Bonus:
- **Unit Tests Present:** ${
      codeAnalysis.hasUnitTests ? "YES ✅ (+10 points)" : "NO"
    }
`;
  } else if (validationType === "API" && codeAnalysis) {
    prompt += `
## CODE ANALYSIS - API IMPLEMENTATION (Week 12):
### API Integration Check:
- **Real API Calls Found:** ${
      codeAnalysis.hasRealFetch ? "YES ✅" : "NO ❌ - CRITICAL ISSUE"
    }
- **Async/Await Used:** ${codeAnalysis.hasAsyncAwait ? "YES ✅" : "NO ❌"}
- **Error Handling:** ${codeAnalysis.hasErrorHandling ? "YES ✅" : "NO ❌"}

### CRUD Operations Check:
- **GET/READ:** ${codeAnalysis.hasGET ? "YES ✅" : "NO ❌"}
- **POST/CREATE:** ${codeAnalysis.hasPOST ? "YES ✅" : "NO ❌"}
- **DELETE:** ${codeAnalysis.hasDELETE ? "YES ✅" : "NO ❌"}
- **Has Forms:** ${codeAnalysis.hasFormElements ? "YES ✅" : "NO ❌"}

${
  !codeAnalysis.hasRealFetch
    ? "### ⚠️ CRITICAL: No real API calls detected. Maximum Completion score: 40/160 points."
    : ""
}
`;
  }

  // Add rubric sections
  Object.entries(weekConfig.gradingRubric).forEach(([section, details]) => {
    prompt += `
## ${section.charAt(0).toUpperCase() + section.slice(1)} Section: ${
      details.points
    } points maximum
**Description:** ${details.description}
`;
    if (details.pointBreakdown) {
      prompt += `**Point Breakdown:**\n`;
      Object.entries(details.pointBreakdown).forEach(([level, points]) => {
        prompt += `- ${level}: ${points} points\n`;
      });
    }
    prompt += `**Criteria:**\n${details.criteria
      .map((c) => `- ${c}`)
      .join("\n")}\n`;
  });

  // Add content
  prompt += `
## GitHub Repository Content:
\`\`\`
${githubContent}
\`\`\`

## YouTube Transcript:
${hasYoutubeVideo ? youtubeTranscript : "No video submitted"}

# GRADING INSTRUCTION:
Evaluate based on the Week ${
    weekConfig.weekNumber
  } requirements above. Use the code analysis results to inform your grading but verify against the actual code.
`;

  return prompt;
}

/**
 * Get week-specific system prompt
 */
function getWeekSpecificSystemPrompt(weekConfig, codeAnalysis, validationType) {
  let systemPrompt = `You are grading a Week ${weekConfig.weekNumber} assignment: ${weekConfig.name}.

IMPORTANT: Grade according to the SPECIFIC requirements for Week ${weekConfig.weekNumber}, not any other week.
`;

  if (validationType === "WAR_GAME") {
    systemPrompt += `
This is the WAR CARD GAME assignment (Week 9). Focus on:
- Object-oriented programming with classes
- Proper game logic implementation
- Dealing 26 cards to each player
- Playing all rounds automatically
- Tracking points and declaring a winner
- Use of console.log for output

DO NOT evaluate for API calls, fetch, or CRUD operations - those are NOT part of Week 9.`;
  } else if (validationType === "API") {
    systemPrompt += `
This is the API and Fetch assignment (Week 12). Focus on:
- Real API integration (not hardcoded data)
- CRUD operations with actual API calls
- Proper use of fetch/axios with async/await
- Forms that POST data to the API
- Error handling for API failures

If no real API calls are found, this is a critical failure worth maximum 40/160 completion points.`;
  }

  systemPrompt += `

Use emojis in feedback:
✅ for completed requirements
⚠️ for issues
❌ for missing requirements
💡 for suggestions
🌟 for exceptional work

Write in first person ("I can see...", "You've implemented...").
Be supportive but accurate in assessment.`;

  return systemPrompt;
}

/**
 * Format response to HTML
 */
function formatResponseToHtml(response) {
  // IMPORTANT: Process in the correct order to preserve emojis

  // First, escape any existing HTML to prevent injection
  let html = response
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Convert markdown to HTML (but NOT newlines yet)

  // Headers (must come before other replacements)
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // Bold text
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Code blocks (multiline)
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Lists - handle carefully to preserve emojis
  // Convert list items to HTML
  html = html.replace(/^\* (.+)$/gm, "<li>$1</li>");
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");

  // Wrap consecutive list items in ul tags
  html = html.replace(/(<li>.*?<\/li>\n?)+/g, function (match) {
    return "<ul>" + match + "</ul>";
  });

  // Score highlighting (preserve emojis in these patterns)
  html = html.replace(/(\d+\/\d+ points)/g, '<span class="score">$1</span>');

  // Total score highlighting
  html = html.replace(
    /(Total Score:)\s*(\d+\/\d+)/g,
    '<div class="total-score">$1 <span class="score">$2</span></div>'
  );

  // Convert newlines to line breaks (do this LAST to preserve structure)
  html = html.replace(/\n/g, "<br>");

  // Clean up any double line breaks after block elements
  html = html.replace(/<\/(h[1-6]|ul|pre|div)><br>/g, "</$1>");
  html = html.replace(/<br><(h[1-6]|ul|pre|div)/g, "<$1");

  return html;
}

module.exports = { evaluateAssignment };
