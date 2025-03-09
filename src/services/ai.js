const { Anthropic } = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");
const config = require("../../config/config");

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

/**
 * Encodes an image file to base64
 * @param {string} imagePath - Path to the image file
 * @returns {string} Base64-encoded image
 */
function encodeImageToBase64(imagePath) {
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    return imageBuffer.toString("base64");
  } catch (error) {
    console.error("Error encoding image:", error);
    throw error;
  }
}

/**
 * Evaluates a student assignment using Anthropic's Claude
 * @param {Object} options - Evaluation options
 * @param {string} options.studentName - Student's name
 * @param {string} options.weekConfig - Week configuration object
 * @param {string} options.githubContent - GitHub repository content
 * @param {string} options.youtubeTranscript - YouTube video transcript
 * @returns {Promise<Object>} The evaluation results
 */
async function evaluateAssignment({
  studentName,
  weekConfig,
  githubContent,
  youtubeTranscript,
}) {
  try {
    // Load and encode the rubric image
    const rubricImagePath = path.join(
      config.rubricDir,
      weekConfig.rubricImagePath
    );
    const imageBase64 = encodeImageToBase64(rubricImagePath);

    // Prepare content for the API call
    const messageContent = [
      {
        type: "image",
        source: {
          type: "base64",
          media_type: "image/png",
          data: imageBase64,
        },
      },
      {
        type: "text",
        text: config.defaultPrompt,
      },
      {
        type: "text",
        text: `STUDENT: ${studentName}\nASSIGNMENT: ${weekConfig.name} (Week ${weekConfig.weekNumber})\n\nRUBRIC DESCRIPTION: ${weekConfig.rubricDescription}\n\nGITHUB REPOSITORY CONTENT:\n${githubContent}\n\nYOUTUBE TRANSCRIPT:\n${youtubeTranscript}`,
      },
    ];

    // Make API call to Claude
    console.log("Sending request to Claude API...");

    const response = await anthropic.messages.create({
      model: config.anthropic.model,
      max_tokens: config.anthropic.maxTokens,
      messages: [
        {
          role: "user",
          content: messageContent,
        },
      ],
    });

    const evaluation = response.content[0].text;

    // Format the response for HTML display
    const formattedHtml = formatResponseForHtml(evaluation);

    return {
      rawResponse: evaluation,
      formattedHtml,
    };
  } catch (error) {
    console.error("Error evaluating assignment:", error);
    throw error;
  }
}

/**
 * Formats the AI response for HTML display
 * @param {string} text - The raw AI response
 * @returns {string} HTML-formatted response
 */
function formatResponseForHtml(text) {
  // Replace markdown headings with HTML headings
  text = text
    .replace(/^# (.*$)/gm, "<h1>$1</h1>")
    .replace(/^## (.*$)/gm, "<h2>$1</h2>")
    .replace(/^### (.*$)/gm, "<h3>$1</h3>")
    .replace(/^#### (.*$)/gm, "<h4>$1</h4>");

  // Replace markdown lists
  text = text
    .replace(/^\* (.*$)/gm, "<li>$1</li>")
    .replace(/^- (.*$)/gm, "<li>$1</li>");

  // Wrap list items in ul tags (simple approach)
  text = text.replace(/(<li>.*<\/li>)\n\n/gs, "<ul>$1</ul>\n\n");

  // Convert double newlines to paragraph breaks
  text = text.replace(/\n\n/g, "</p><p>");

  // Wrap in paragraph tags
  text = "<p>" + text + "</p>";

  // Fix any doubled paragraph tags
  text = text.replace(/<\/p><p><\/p><p>/g, "</p><p>");

  return text;
}

module.exports = {
  evaluateAssignment,
};
