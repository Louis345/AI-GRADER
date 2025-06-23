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
    // Construct the prompt with embedded rubric
    const prompt = constructPromptWithRubric({
      studentName,
      studentEmail,
      weekConfig,
      githubContent,
      youtubeTranscript,
      hasYoutubeVideo,
    });

    console.log("🤖 Sending request to Claude with text-based rubric...");

    // Call Anthropic API (no images needed!)
    const response = await anthropic.messages.create({
      model: config.anthropic.model,
      max_tokens: config.anthropic.maxTokens,
      system: getSystemPrompt(hasYoutubeVideo),
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

    // Process response into HTML format
    const formattedHtml = formatResponseToHtml(rawResponse);

    return {
      rawResponse,
      formattedHtml,
    };
  } catch (error) {
    console.error("Error in AI evaluation:", error);
    throw new Error(`AI evaluation failed: ${error.message}`);
  }
}

/**
 * Constructs the evaluation prompt with embedded rubric
 */
function constructPromptWithRubric({
  studentName,
  studentEmail,
  weekConfig,
  githubContent,
  youtubeTranscript,
  hasYoutubeVideo = true,
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

  // Main prompt
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

# GitHub Repository Content
\`\`\`
${truncateIfNeeded(githubContent, 30000)}
\`\`\`
`;

  // Conditionally include YouTube section
  if (hasYoutubeVideo) {
    prompt += `
# YouTube Video Transcript
\`\`\`
${truncateIfNeeded(youtubeTranscript, 10000)}
\`\`\`
`;
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
# Grading Instructions
Evaluate this assignment using the rubric above. For each section, provide:
1. Score out of maximum points for that section
2. Specific feedback referencing the criteria
3. Clear explanation of points awarded/deducted

Format your response with clear section headers and point allocations exactly as shown in the rubric.
`;

  return prompt;
}

/**
 * Get system prompt
 */
function getSystemPrompt(hasYoutubeVideo) {
  return `You are an expert programming instructor grading a student assignment.

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
  !hasYoutubeVideo
    ? `
IMPORTANT: The student did not submit a video. Do not evaluate video criteria and adjust the total score accordingly.
`
    : ""
}`;
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
