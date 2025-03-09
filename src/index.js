#!/usr/bin/env node

require("dotenv").config();
const fs = require("fs-extra");
const path = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const { processGitHubRepo } = require("./services/github");
const { getYouTubeTranscript } = require("./services/youtube");
const { evaluateAssignment } = require("./services/ai");
const { generateHtml } = require("./utils/html-template");
const { launchInteractiveGrader } = require("./interactive");
const config = require("../config/config");

/**
 * Main function to handle assignment grading
 */
async function main() {
  try {
    // Parse command line arguments
    const argv = yargs(hideBin(process.argv))
      .option("name", {
        alias: "n",
        description: "Student name",
        type: "string",
      })
      .option("github", {
        alias: "g",
        description: "GitHub repository URL",
        type: "string",
      })
      .option("youtube", {
        alias: "y",
        description: "YouTube video URL",
        type: "string",
      })
      .option("week", {
        alias: "w",
        description: "Week number",
        type: "number",
      })
      .option("interactive", {
        alias: "i",
        description: "Run in interactive mode",
        type: "boolean",
        default: false,
      })
      .help()
      .alias("help", "h").argv;

    // If interactive mode is specified or no required args provided, launch interactive mode
    if (
      argv.interactive ||
      !argv.name ||
      !argv.github ||
      !argv.youtube ||
      !argv.week
    ) {
      return await launchInteractiveGrader();
    }

    const {
      name: studentName,
      github: githubUrl,
      youtube: youtubeUrl,
      week: weekNumber,
    } = argv;

    console.log("\n🚀 Starting AI Grader...");
    console.log(`Student: ${studentName}`);
    console.log(`Week: ${weekNumber}`);
    console.log(`GitHub: ${githubUrl}`);
    console.log(`YouTube: ${youtubeUrl}`);

    // Load week configuration
    const weekConfigPath = path.join(
      __dirname,
      `../config/weeks/week${weekNumber}.json`
    );
    if (!fs.existsSync(weekConfigPath)) {
      console.error(
        `❌ Error: Configuration for week ${weekNumber} not found!`
      );
      console.log(`Please create config file at: ${weekConfigPath}`);
      process.exit(1);
    }

    const weekConfig = require(weekConfigPath);
    console.log(`\n📋 Assignment: ${weekConfig.name}`);

    // Ensure rubric image exists
    const rubricImagePath = path.join(
      config.rubricDir,
      weekConfig.rubricImagePath
    );
    if (!fs.existsSync(rubricImagePath)) {
      console.error(`❌ Error: Rubric image not found at ${rubricImagePath}`);
      process.exit(1);
    }

    // Ensure API key is set
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error(
        "❌ Error: ANTHROPIC_API_KEY is not set in your .env file!"
      );
      console.log("Please add your Anthropic API key to the .env file.");
      process.exit(1);
    }

    // Check output directory
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }

    console.log("\n📦 Fetching GitHub repository...");
    const githubContent = await processGitHubRepo(githubUrl);
    console.log(
      `✅ GitHub repository processed (${githubContent.length} characters)`
    );

    console.log("\n🎬 Fetching YouTube transcript...");
    const youtubeTranscript = await getYouTubeTranscript(youtubeUrl);
    console.log(
      `✅ YouTube transcript processed (${youtubeTranscript.length} characters)`
    );

    console.log("\n🤖 Evaluating assignment with AI...");
    console.log("This may take a minute or two...");
    const aiResponse = await evaluateAssignment({
      studentName,
      weekConfig,
      githubContent,
      youtubeTranscript,
    });
    console.log("✅ AI evaluation complete!");

    // Generate HTML output
    const timestamp = new Date().toISOString().replace(/[:\.]/g, "-");
    const sanitizedName = studentName.replace(/\s+/g, "-");
    const outputFilename = `${sanitizedName}-week${weekNumber}-${timestamp}.html`;
    const outputPath = path.join(config.outputDir, outputFilename);

    // Generate and save HTML
    const htmlOutput = generateHtml(
      studentName,
      weekNumber,
      weekConfig.name,
      aiResponse
    );
    fs.writeFileSync(outputPath, htmlOutput);

    console.log(`\n📝 Results saved to: ${outputPath}`);
    console.log(
      "\n✨ Grading complete! Open the HTML file in your browser to view and copy the results."
    );
  } catch (error) {
    console.error("\n❌ Error during execution:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the application
main();
