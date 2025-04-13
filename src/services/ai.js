const Anthropic = require("@anthropic-ai/sdk");
const config = require("../../config/config");

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Evaluates a student assignment using AI
 * @param {Object} options - Evaluation options
 * @param {string} options.studentName - Student's name
 * @param {string} options.studentEmail - Student's email
 * @param {Object} options.weekConfig - Week configuration
 * @param {string} options.githubContent - GitHub repository content
 * @param {string} options.youtubeTranscript - YouTube video transcript
 * @returns {Promise<Object>} AI evaluation response
 */
async function evaluateAssignment({
  studentName,
  studentEmail,
  weekConfig,
  githubContent,
  youtubeTranscript,
}) {
  try {
    // Construct the prompt
    const prompt = constructPrompt({
      studentName,
      studentEmail,
      weekConfig,
      githubContent,
      youtubeTranscript,
    });

    // Call Anthropic API
    console.log("Sending request to Anthropic API...");
    const response = await anthropic.messages.create({
      model: config.anthropic.model,
      max_tokens: config.anthropic.maxTokens,
      system: config.defaultPrompt,
      messages: [{ role: "user", content: prompt }],
    });

    // Extract and format the response
    const rawResponse = response.content.reduce(
      (acc, item) => (item.text ? acc + item.text : acc),
      ""
    );

    // Process response into HTML format with preserved emojis and structure
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
 * Constructs the evaluation prompt
 * @param {Object} options - Prompt options
 * @returns {string} Formatted prompt
 */
function constructPrompt({
  studentName,
  studentEmail,
  weekConfig,
  githubContent,
  youtubeTranscript,
}) {
  return `
Student: ${studentName} (${studentEmail})
Assignment: ${weekConfig.name}

# Assignment Description
${weekConfig.rubricDescription}

# GitHub Repository Content
\`\`\`
${truncateIfNeeded(githubContent, 30000)}
\`\`\`

# YouTube Video Transcript
\`\`\`
${truncateIfNeeded(youtubeTranscript, 10000)}
\`\`\`

# Instructions
Please evaluate this student's assignment based on the rubric and provided content.
Remember to use emojis throughout your feedback.
Focus on being helpful, specific, and constructive in your feedback.
Mention the student by name and refer to yourself as "I" (the instructor).
Include any specific areas for improvement and strengths you observe.
`;
}

/**
 * Truncates text if it exceeds a specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateIfNeeded(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "... [content truncated for length]";
}

/**
 * Formats the AI response into HTML
 * @param {string} response - Raw AI response
 * @returns {string} HTML formatted response
 */
function formatResponseToHtml(response) {
  // Replace newlines with <br> tags
  let html = response.replace(/\n/g, "<br>");

  // Convert markdown-style headers
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");

  // Convert markdown-style lists
  html = html.replace(/^\* (.+)$/gm, "<li>$1</li>");
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/^(\d+)\. (.+)$/gm, "<li>$1. $2</li>");

  // Wrap lists in <ul> tags
  html = html.replace(/(?:<li>.*?<\/li>)+/g, (match) => `<ul>${match}</ul>`);

  // Bold text with asterisks
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

  // Italicize text with single asterisks
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Format code blocks
  html = html.replace(/```(.+?)```/gs, "<pre><code>$1</code></pre>");

  // Inline code
  html = html.replace(/`(.+?)`/g, "<code>$1</code>");

  // Add section styling
  html = html.replace(
    /<h[1-3]>(.+?)<\/h[1-3]>/g,
    '<div class="section"><h3>$1</h3>'
  );
  html = html.replace(/<\/ul>/g, "</ul></div>");

  // Highlight score text
  html = html.replace(/(\d+\/\d+ points)/g, '<span class="score">$1</span>');

  // Add special styling for total score
  html = html.replace(
    /(Total Score:) (\d+\/\d+)/g,
    '<div class="total-score">$1 <span class="score">$2</span></div>'
  );

  return html;
}

module.exports = { evaluateAssignment };
