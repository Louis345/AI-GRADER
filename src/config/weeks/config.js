// Global configuration for the AI grader
const path = require("path");

module.exports = {
  // Base directory for rubric images
  rubricDir: path.join(__dirname, "../rubrics"),

  // Base directory for output files
  outputDir: path.join(__dirname, "../output"),

  // Anthropic API configuration
  anthropic: {
    model: "claude-3-opus-20240229", // Best model for complex reasoning tasks
    maxTokens: 4000,
  },

  // Default prompt instructions for AI grading
  defaultPrompt: `
You are an expert programming instructor grading a student assignment.
The image above contains the assignment rubric and requirements.

Please evaluate the student's work based on:
1. The GitHub repository code
2. The YouTube video transcript

For the video portion of the evaluation, pay special attention to:
- How well the student explains their design choices
- Clarity in describing the file structure
- Discussion of challenges faced during development
- Overall presentation quality
- Whether they demonstrated the required functionality

Provide a detailed, constructive evaluation using this format:
- Section-by-section scores according to the rubric
- Specific feedback with emoji indicators (✅ for good, ⚠️ for issues)
- Overall score calculation
- Use emojis praising the student when giving positive feedback

In the "Video Explanation" section, include specific feedback about the presentation quality, beyond just meeting the basic requirements.

Be fair and educational in your feedback. Use a supportive tone that encourages learning.
`,
};
