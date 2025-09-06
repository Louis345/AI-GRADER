// CORRECTED src/services/ai.js with proper week-specific validation and Week 17 integration
const Anthropic = require("@anthropic-ai/sdk");
const config = require("../../config/config");

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Validates Final Project implementation for Week 17 ONLY
 */
function validateWeek17FinalProject(githubContent) {
  const validations = {
    hasReactApp: false,
    hasRouting: false,
    hasAPIIntegration: false,
    hasRealCRUD: false,
    hasComponents: false,
    hasStateManagement: false,
    hasErrorHandling: false,
    usesOnlyLocalState: false,
    hasPackageJson: false,
    actualAPICallsFound: [],
    // CORRECTED: Use the new structure that matches the prompt
    localCrudOperations: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
    apiCrudOperations: {
      create: false,
      read: false,
      update: false,
      delete: false,
    },
  };

  // Check for React application
  validations.hasReactApp =
    /import.*React.*from.*react|import.*{.*Component.*}.*from.*react/gi.test(
      githubContent
    );

  // Check for React Router
  validations.hasRouting = /react-router|BrowserRouter|Routes?|Route\s/gi.test(
    githubContent
  );

  // Check for proper components structure
  validations.hasComponents =
    /export.*function.*Component|class.*extends.*Component/gi.test(
      githubContent
    );

  // CRITICAL: Check for API integration
  const apiPatterns = [
    /fetch\s*\(\s*['"](https?:\/\/[^'"]+)/gi, // External API calls
    /axios\.(get|post|put|delete|patch)\s*\(/gi, // Axios calls
    /fetch\s*\(\s*['"](\/api\/[^'"]+)/gi, // Local API calls
  ];

  let apiCallsFound = [];
  for (const pattern of apiPatterns) {
    const matches = githubContent.match(pattern) || [];
    if (matches.length > 0) {
      validations.hasAPIIntegration = true;
      apiCallsFound.push(...matches);
    }
  }
  validations.actualAPICallsFound = apiCallsFound;

  // Check if ONLY using local state (red flag for final project)
  const hasOnlyLocalState =
    /useState\s*\(/.test(githubContent) &&
    !validations.hasAPIIntegration &&
    !/(useEffect.*fetch|componentDidMount.*fetch|api|server)/gi.test(
      githubContent
    );

  validations.usesOnlyLocalState = hasOnlyLocalState;

  // LOCAL CRUD operations (what student actually implemented)
  validations.localCrudOperations.create =
    /addTask|createTask|add.*function|create.*function/gi.test(githubContent) ||
    /setTasks.*\[.*newTask.*tasks\]/gi.test(githubContent);

  validations.localCrudOperations.read =
    /tasks\.map|\.find|\.filter|display.*tasks/gi.test(githubContent);

  validations.localCrudOperations.update =
    /updateTask|editTask|update.*function|edit.*function/gi.test(githubContent);

  validations.localCrudOperations.delete =
    /deleteTask|removeTask|delete.*function|tasks\.filter.*id/gi.test(
      githubContent
    );

  // API CRUD operations (what's required for Week 17)
  validations.apiCrudOperations.create =
    /POST|post\(/gi.test(githubContent) && validations.hasAPIIntegration;
  validations.apiCrudOperations.read =
    /GET|get\(/gi.test(githubContent) && validations.hasAPIIntegration;
  validations.apiCrudOperations.update =
    /PUT|PATCH|put\(|patch\(/gi.test(githubContent) &&
    validations.hasAPIIntegration;
  validations.apiCrudOperations.delete =
    /DELETE|delete\(/gi.test(githubContent) && validations.hasAPIIntegration;

  validations.hasRealCRUD =
    Object.values(validations.apiCrudOperations).filter(Boolean).length >= 3;

  // Check for proper state management (Context, Redux, or API-based)
  validations.hasStateManagement =
    /useContext|createContext|useReducer|redux|Provider/gi.test(
      githubContent
    ) || validations.hasAPIIntegration;

  // Check for error handling in API calls
  validations.hasErrorHandling =
    /try\s*{.*catch|\.catch\s*\(|error.*handling/gi.test(githubContent);

  // Check for package.json (React project indicator)
  validations.hasPackageJson =
    /react.*dependencies|react-dom|react-scripts/gi.test(githubContent);

  // Log findings for debugging
  console.log("🔍 Week 17 Final Project Analysis:");
  console.log(`  React App: ${validations.hasReactApp ? "✅" : "❌"}`);
  console.log(`  Routing: ${validations.hasRouting ? "✅" : "❌"}`);
  console.log(
    `  API Integration: ${validations.hasAPIIntegration ? "✅" : "❌ CRITICAL"}`
  );
  console.log(`  Real API CRUD: ${validations.hasRealCRUD ? "✅" : "❌"}`);
  console.log(
    `  Only Local State: ${
      validations.usesOnlyLocalState ? "⚠️ WARNING" : "✅"
    }`
  );
  console.log(`  Components: ${validations.hasComponents ? "✅" : "❌"}`);

  console.log("  Local CRUD Operations:");
  console.log(
    `    CREATE: ${validations.localCrudOperations.create ? "✅" : "❌"}`
  );
  console.log(
    `    READ: ${validations.localCrudOperations.read ? "✅" : "❌"}`
  );
  console.log(
    `    UPDATE: ${validations.localCrudOperations.update ? "✅" : "❌"}`
  );
  console.log(
    `    DELETE: ${validations.localCrudOperations.delete ? "✅" : "❌"}`
  );

  console.log("  API CRUD Operations:");
  console.log(
    `    CREATE: ${validations.apiCrudOperations.create ? "✅" : "❌"}`
  );
  console.log(`    READ: ${validations.apiCrudOperations.read ? "✅" : "❌"}`);
  console.log(
    `    UPDATE: ${validations.apiCrudOperations.update ? "✅" : "❌"}`
  );
  console.log(
    `    DELETE: ${validations.apiCrudOperations.delete ? "✅" : "❌"}`
  );

  if (validations.actualAPICallsFound.length > 0) {
    console.log(
      `  API Calls Found: ${validations.actualAPICallsFound
        .slice(0, 3)
        .join(", ")}`
    );
  } else {
    console.log(`  API Calls Found: None - This is a major issue for Week 17!`);
  }

  return validations;
}

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
      case 17:
        console.log("📊 Analyzing Week 17 Final Project...");
        codeAnalysis = validateWeek17FinalProject(githubContent);
        validationType = "FINAL_PROJECT";
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
  } else if (validationType === "FINAL_PROJECT" && codeAnalysis) {
    prompt += `
## CODE ANALYSIS - FINAL PROJECT (Week 17):
### React Application Check:
- **React App Structure:** ${codeAnalysis.hasReactApp ? "YES ✅" : "NO ❌"}
- **React Router Used:** ${codeAnalysis.hasRouting ? "YES ✅" : "NO ❌"}
- **Components Structure:** ${codeAnalysis.hasComponents ? "YES ✅" : "NO ❌"}

### API Integration Check (CRITICAL):
- **API Calls Found:** ${
      codeAnalysis.hasAPIIntegration ? "YES ✅" : "NO ❌ - MAJOR ISSUE"
    }
- **External Data Persistence:** ${
      codeAnalysis.hasRealCRUD ? "YES ✅" : "NO ❌"
    }
- **Only Local State (Warning):** ${
      codeAnalysis.usesOnlyLocalState
        ? "YES ⚠️ - Not suitable for final project"
        : "NO ✅"
    }

### Local CRUD Operations (What Student Implemented):
- **Local CREATE:** ${
      codeAnalysis.localCrudOperations.create ? "YES ✅" : "NO ❌"
    }
- **Local READ:** ${codeAnalysis.localCrudOperations.read ? "YES ✅" : "NO ❌"}
- **Local UPDATE:** ${
      codeAnalysis.localCrudOperations.update ? "YES ✅" : "NO ❌"
    }
- **Local DELETE:** ${
      codeAnalysis.localCrudOperations.delete ? "YES ✅" : "NO ❌"
    }

### API CRUD Operations (What's Required for Week 17):
- **API CREATE (POST):** ${
      codeAnalysis.apiCrudOperations.create ? "YES ✅" : "NO ❌"
    }
- **API READ (GET):** ${
      codeAnalysis.apiCrudOperations.read ? "YES ✅" : "NO ❌"
    }
- **API UPDATE (PUT):** ${
      codeAnalysis.apiCrudOperations.update ? "YES ✅" : "NO ❌"
    }
- **API DELETE:** ${codeAnalysis.apiCrudOperations.delete ? "YES ✅" : "NO ❌"}

${
  !codeAnalysis.hasAPIIntegration
    ? "### ⚠️ CRITICAL ISSUE: No API integration detected. This is a core requirement for Week 17. Maximum Completion score: 160/320 points."
    : ""
}

${
  codeAnalysis.usesOnlyLocalState
    ? "### ⚠️ WARNING: Project appears to use only local state without persistence. Final projects should integrate with APIs or external data sources."
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

MANDATORY: Always end your response with "Best regards, Jamal Taylor" - DO NOT use any other signature.
`;

  return prompt;
}

/**
 * Get week-specific system prompt
 */
function getWeekSpecificSystemPrompt(weekConfig, codeAnalysis, validationType) {
  let systemPrompt = `You are Jamal Taylor, grading a Week ${weekConfig.weekNumber} assignment: ${weekConfig.name}.

CRITICAL INSTRUCTION: You are Jamal Taylor. Always end your feedback with "Best regards, Jamal Taylor" - never use "Best regards, The Grading Bot" or any other signature.

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
  } else if (validationType === "FINAL_PROJECT") {
    systemPrompt += `
This is the FINAL PROJECT assignment (Week 17). This is CRITICAL - focus on:
- React application with proper component structure
- React Router for navigation
- **API INTEGRATION IS MANDATORY** - must connect to external API or backend
- Full CRUD operations that persist data (not just local state)
- Professional code quality and error handling
- Proper state management (not just useState for everything)

CRITICAL GRADING RULES FOR WEEK 17:
- If NO API integration found: Maximum Completion score is 160/320 points
- If using ONLY local state with useState: Maximum Completion score is 200/320 points  
- If no external data persistence: Deduct significant points from Completion
- Perfect scores (800/800) should be RARE and only for exceptional work with all requirements

DO NOT give full points for basic Todo apps that only use local state without API integration.`;
  }

  systemPrompt += `

Use emojis in feedback:
✅ for completed requirements
⚠️ for issues
❌ for missing requirements
💡 for suggestions
🌟 for exceptional work

Write in first person as Jamal Taylor ("I can see...", "You've implemented...").
Be supportive but accurate in assessment.

MANDATORY: Always end with "Best regards, Jamal Taylor" - never use any other name or signature.`;

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
