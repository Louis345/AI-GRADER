// Enhanced src/services/ai.js with better validation
const Anthropic = require("@anthropic-ai/sdk");
const config = require("../../config/config");

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Evaluates a student assignment using AI with text-based rubrics
 * @param {Object} options - Evaluation options
 * @returns {Promise<Object>} AI evaluation response
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
    // Validate GitHub content first
    const githubStatus = validateGitHubContent(githubContent);

    // Validate YouTube content if provided
    const youtubeStatus = hasYoutubeVideo
      ? validateYouTubeContent(youtubeTranscript)
      : null;

    // Construct the prompt with embedded rubric and validation info
    const prompt = constructPromptWithRubric({
      studentName,
      studentEmail,
      weekConfig,
      githubContent,
      youtubeTranscript,
      hasYoutubeVideo,
      githubStatus,
      youtubeStatus,
    });

    console.log("🤖 Sending request to Claude with enhanced validation...");

    // Call Anthropic API
    const response = await anthropic.messages.create({
      model: config.anthropic.model,
      max_tokens: config.anthropic.maxTokens,
      system: getEnhancedSystemPrompt(
        hasYoutubeVideo,
        githubStatus,
        youtubeStatus
      ),
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Extract and format the response
    const rawResponse = response.content.reduce(
      (acc, item) => (item.text ? acc + item.text : acc),
      ""
    );

    // Validate the AI response before returning
    const validatedResponse = validateAIResponse(
      rawResponse,
      githubStatus,
      youtubeStatus
    );

    // Process response into HTML format
    const formattedHtml = formatResponseToHtml(validatedResponse);

    return {
      rawResponse: validatedResponse,
      formattedHtml,
    };
  } catch (error) {
    console.error("Error in AI evaluation:", error);
    throw new Error(`AI evaluation failed: ${error.message}`);
  }
}

/**
 * Validate GitHub content and determine access status
 */
function validateGitHubContent(githubContent) {
  console.log("🔍 GitHub validation - content length:", githubContent.length);
  console.log("🔍 Contains 'Error:':", githubContent.includes("Error: "));
  console.log(
    "🔍 Contains '[Error fetching':",
    githubContent.includes("[Error fetching content:")
  );
  if (!githubContent || githubContent.trim().length === 0) {
    return {
      accessible: false,
      reason: "No GitHub content provided",
      hasFiles: false,
      fileCount: 0,
    };
  }

  // Check for error messages in GitHub content
  if (
    githubContent.includes("Error processing GitHub repository:") ||
    githubContent.includes("[Error fetching content:") ||
    githubContent.includes("403") ||
    githubContent.includes("Forbidden") ||
    githubContent.includes(
      "Repository content:\n\nI was able to detect that this repository exists but encountered issues"
    )
  ) {
    return {
      accessible: false,
      reason: "GitHub repository access error detected",
      hasFiles: false,
      fileCount: 0,
      errorDetails:
        githubContent.match(/Error: ([^\\n]+)/)?.[1] || "Unknown error",
    };
  }

  // Check for 403 errors
  if (githubContent.includes("403") || githubContent.includes("Forbidden")) {
    return {
      accessible: false,
      reason: "GitHub repository is private or access forbidden (403 error)",
      hasFiles: false,
      fileCount: 0,
    };
  }

  // Count actual files found
  const fileMatches = githubContent.match(/## File: /g);
  const fileCount = fileMatches ? fileMatches.length : 0;

  // Check for .gitignore specifically
  const hasGitignore =
    githubContent.includes(".gitignore") ||
    githubContent.includes("node_modules/");

  return {
    accessible: true,
    reason: "Repository accessible",
    hasFiles: fileCount > 0,
    fileCount: fileCount,
    hasGitignore: hasGitignore,
    content: githubContent,
  };
}

/**
 * Validate YouTube transcript content
 */
function validateYouTubeContent(youtubeTranscript) {
  if (!youtubeTranscript || youtubeTranscript.length === 0) {
    return {
      accessible: false,
      reason: "No YouTube transcript provided",
      hasContent: false,
      isError: false,
    };
  }

  // Check if it's an error message
  if (youtubeTranscript.includes("VIDEO_SUBMITTED_TRANSCRIPT_ERROR")) {
    return {
      accessible: false,
      reason: "YouTube transcript extraction failed",
      hasContent: false,
      isError: true,
      errorDetails: youtubeTranscript,
    };
  }

  // If it's an array, join it
  const transcriptText = Array.isArray(youtubeTranscript)
    ? youtubeTranscript.join(" ")
    : youtubeTranscript;

  return {
    accessible: true,
    reason: "YouTube transcript successfully extracted",
    hasContent: transcriptText.length > 50, // Reasonable minimum
    isError: false,
    wordCount: transcriptText.split(/\s+/).length,
    content: transcriptText,
  };
}

/**
 * Constructs the evaluation prompt with embedded rubric and validation status
 */
function constructPromptWithRubric({
  studentName,
  studentEmail,
  weekConfig,
  githubContent,
  youtubeTranscript,
  hasYoutubeVideo = true,
  githubStatus,
  youtubeStatus,
}) {
  // Build rubric section with exact point breakdowns
  let rubricSection = `
# GRADING RUBRIC - ${weekConfig.name}
**TOTAL POINTS: ${weekConfig.totalPoints}**

CRITICAL: You MUST use these EXACT point values. Do not create your own categories or point totals.

`;

  // Add each rubric section with point breakdowns
  Object.entries(weekConfig.gradingRubric).forEach(([section, details]) => {
    rubricSection += `## ${
      section.charAt(0).toUpperCase() + section.slice(1)
    } Section: ${details.points} points maximum
**Description:** ${details.description}

**EXACT POINT BREAKDOWN:**
`;

    // Add point breakdown if available
    if (details.pointBreakdown) {
      Object.entries(details.pointBreakdown).forEach(([level, points]) => {
        rubricSection += `- ${level}: ${points} points\n`;
      });
    }

    rubricSection += `
**Evaluation Criteria:**
${details.criteria.map((criterion) => `- ${criterion}`).join("\n")}

`;
  });

  // Main prompt with validation context
  let prompt = `
Student: ${studentName} (${studentEmail})
Assignment: ${weekConfig.name} (Week ${weekConfig.weekNumber})

${rubricSection}

CRITICAL GRADING INSTRUCTIONS:
- You MUST use the EXACT point values shown above for each section
- You MUST use the EXACT section names: Completion, GitHub, Errors, Video Explanation
- You MUST choose the appropriate point level from the breakdown provided
- DO NOT create new categories or make up different point totals
- Total must equal ${weekConfig.totalPoints} points (or adjusted if no video)

## IMPORTANT DATA VALIDATION CONTEXT:

### GitHub Repository Status:
- **Accessible:** ${githubStatus.accessible ? "YES" : "NO"}
- **Reason:** ${githubStatus.reason}
- **Files Found:** ${githubStatus.fileCount}
${
  githubStatus.hasGitignore
    ? "- **Has .gitignore:** YES (node_modules excluded)"
    : ""
}
${
  !githubStatus.accessible
    ? `- **Error Details:** ${
        githubStatus.errorDetails || "Repository access failed"
      }`
    : ""
}

### Video Transcript Status:
${
  hasYoutubeVideo
    ? `
- **Accessible:** ${youtubeStatus.accessible ? "YES" : "NO"}
- **Reason:** ${youtubeStatus.reason}
- **Content Quality:** ${
        youtubeStatus.hasContent ? "Good quality transcript" : "Limited content"
      }
${
  youtubeStatus.isError
    ? `- **Error Details:** Video submitted but transcript extraction failed`
    : ""
}
`
    : "- **Video Submitted:** NO"
}

CRITICAL EVALUATION RULES:
1. **DO NOT comment on audio/video quality** - you only have TEXT transcript
2. **DO NOT guess about repository access** - use the validation status above
3. **DO NOT claim files are missing** if GitHub status shows access errors
4. **DO NOT deduct points for access issues** - focus on available content
5. **BE ACCURATE about what you can actually evaluate**

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

📊 Completion (X/${weekConfig.gradingRubric.completion.points} points)
[Your feedback here]

📝 GitHub (X/${weekConfig.gradingRubric.github.points} points)  
[Your feedback here]

📈 Errors (X/${weekConfig.gradingRubric.errors.points} points)
[Your feedback here]

📱 Video Explanation (X/${weekConfig.gradingRubric.video.points} points)
[Your feedback here]

🌟 Total Score: X/${weekConfig.totalPoints} points

# Assignment Description
${weekConfig.rubricDescription}
`;

  // Add GitHub content if accessible
  if (githubStatus.accessible) {
    prompt += `
# GitHub Repository Content
\`\`\`
${truncateIfNeeded(githubContent, 30000)}
\`\`\`
`;
  } else {
    prompt += `
# GitHub Repository Content
**STATUS:** Repository could not be accessed
**REASON:** ${githubStatus.reason}
**GRADING NOTE:** Award partial credit based on video explanation of code
`;
  }

  // Add YouTube content if available
  if (hasYoutubeVideo) {
    if (youtubeStatus.accessible) {
      prompt += `
# YouTube Video Transcript
**STATUS:** Transcript successfully extracted (${youtubeStatus.wordCount} words)
**NOTE:** This is a TEXT transcript - do not comment on audio/video quality
\`\`\`
${truncateIfNeeded(youtubeStatus.content, 10000)}
\`\`\`
`;
    } else {
      prompt += `
# YouTube Video Transcript
**STATUS:** Video submitted but transcript extraction failed
**REASON:** ${youtubeStatus.reason}
**GRADING NOTE:** Award partial credit for video submission, mention manual review needed
`;
    }
  } else {
    prompt += `
# YouTube Video
No YouTube video was submitted for this assignment.
NOTE: Adjust total score by removing video points (${
      weekConfig.gradingRubric.video.points
    } points).
New total: ${
      weekConfig.totalPoints - weekConfig.gradingRubric.video.points
    } points.
`;
  }

  prompt += `
# Final Grading Instructions
Base your evaluation ONLY on the available content above. If content is not accessible, award partial credit based on what you can evaluate and mention the limitations clearly.
`;

  return prompt;
}

/**
 * Get enhanced system prompt with validation context
 */
function getEnhancedSystemPrompt(hasYoutubeVideo, githubStatus, youtubeStatus) {
  return `You are an expert programming instructor grading a student assignment.

CRITICAL EVALUATION CONSTRAINTS:
- You are evaluating based ONLY on provided TEXT content
- DO NOT comment on audio quality, video quality, or visual elements  
- DO NOT make assumptions about repository access beyond provided status
- DO NOT claim to see or hear anything - you only have text
- BE HONEST about what you can and cannot evaluate

Use plenty of emojis throughout your feedback to make it engaging:
- Positive feedback: ✅ 👏 🌟 💯 🔥
- Areas for improvement: ⚠️ 💡 🛠️ 🔨  
- Encouragement: 💪 🚀 ✨ 👍
- Section headings: 📊 📝 📈 📱 🖥️

Write in FIRST PERSON, addressing the student directly as "you" and referring to yourself as "I".

Your response MUST include:
1. Section-by-section evaluation with exact point values from the rubric
2. Specific feedback referencing the grading criteria
3. Total score calculation 
4. Constructive suggestions for improvement

Be supportive but honest in your assessment. Use a conversational, encouraging tone while providing accurate evaluation.

${
  !githubStatus.accessible
    ? `
IMPORTANT: GitHub repository access failed. Do not penalize the student for access issues. Focus evaluation on available content and mention the limitation.
`
    : ""
}

${
  !hasYoutubeVideo
    ? `
IMPORTANT: The student did not submit a video. Do not evaluate video criteria and adjust the total score accordingly.
`
    : !youtubeStatus?.accessible
    ? `
IMPORTANT: Video was submitted but transcript extraction failed. Award partial credit and mention manual review is needed.
`
    : `
IMPORTANT: You are evaluating a TEXT transcript of a video. Do not comment on audio/video quality.
`
}`;
}

/**
 * Validate AI response to catch common errors
 */
function validateAIResponse(response, githubStatus, youtubeStatus) {
  let validatedResponse = response;

  // Flag common errors
  const errors = [];

  // Check for audio/video quality comments when we only have text
  if (
    youtubeStatus?.accessible &&
    (response.includes("audio") ||
      response.includes("video quality") ||
      response.includes("choppy") ||
      response.includes("zoom in"))
  ) {
    errors.push("AI commented on audio/video quality from text transcript");
  }

  // Check for GitHub access assumptions when repository failed
  if (
    !githubStatus.accessible &&
    (response.includes("repository properly created") ||
      response.includes("files organized") ||
      response.includes("code is well"))
  ) {
    errors.push("AI made claims about inaccessible GitHub repository");
  }

  // Check for .gitignore errors when it exists
  if (
    githubStatus.hasGitignore &&
    response.includes(".gitignore file not found")
  ) {
    errors.push("AI claimed .gitignore is missing when it exists");
  }

  // Log errors for debugging
  if (errors.length > 0) {
    console.log("⚠️ AI Response Validation Errors:");
    errors.forEach((error) => console.log(`  - ${error}`));
  }

  return validatedResponse;
}

/**
 * Truncates text if needed
 */
function truncateIfNeeded(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "... [content truncated for length]";
}

/**
 * Formats the AI response into HTML
 */
function formatResponseToHtml(response) {
  let html = response.replace(/\n/g, "<br>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^\* (.+)$/gm, "<li>$1</li>");
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(?:<li>.*?<\/li>)+/g, (match) => `<ul>${match}</ul>`);
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/```(.+?)```/gs, "<pre><code>$1</code></pre>");
  html = html.replace(/`(.+?)`/g, "<code>$1</code>");
  html = html.replace(/(\d+\/\d+ points)/g, '<span class="score">$1</span>');
  html = html.replace(
    /(Total Score:) (\d+\/\d+)/g,
    '<div class="total-score">$1 <span class="score">$2</span></div>'
  );
  return html;
}

module.exports = { evaluateAssignment };
