const inquirer = require("inquirer");
const fs = require("fs-extra");
const path = require("path");
const { execSync } = require("child_process");

// Import the unified weeks config
const { getAvailableWeeksWithNames } = require("../config/weeks");

// Configure paths
const indexPath = path.join(__dirname, "index.js");

// Store last student info
let lastStudentInfo = null;

/**
 * Launch the interactive grader
 */
async function launchInteractiveGrader() {
  console.log("\n🎓 Welcome to the AI Grader Interactive Mode 🎓\n");

  try {
    // Get available week configurations from unified config
    const weekConfigs = getAvailableWeeksWithNames();

    while (true) {
      let answers;

      // Check if we have previous student info and ask if user wants to reuse it
      if (lastStudentInfo) {
        console.log(`\n📋 Last student info:`);
        console.log(`   Name: ${lastStudentInfo.studentName}`);
        console.log(`   Email: ${lastStudentInfo.email}`);

        const reuseInfo = await inquirer.prompt([
          {
            type: "confirm",
            name: "reusePrevious",
            message: "Use same student info as last time?",
            default: true,
          },
        ]);

        if (reuseInfo.reusePrevious) {
          // Reuse previous student info, just ask for new assignment details
          const newAnswers = await inquirer.prompt([
            {
              type: "confirm",
              name: "hasYoutubeVideo",
              message: "Did the student submit a YouTube video?",
              default: true,
            },
            {
              type: "input",
              name: "githubUrl",
              message: "Enter the GitHub repository URL:",
              validate: (input) =>
                input.match(/github\.com\/[\w-]+\/[\w-]+/)
                  ? true
                  : "Please enter a valid GitHub URL",
            },
            {
              type: "input",
              name: "youtubeUrl",
              message: "Enter the YouTube video URL or ID:",
              when: (answers) => answers.hasYoutubeVideo,
              validate: (input) => {
                if (
                  input.match(/^[a-zA-Z0-9_-]{11}$/) ||
                  input.match(/youtube\.com\/watch\?v=/) ||
                  input.match(/youtu\.be\//)
                ) {
                  return true;
                }
                return "Please enter a valid YouTube URL or video ID";
              },
              filter: (input) => {
                if (input.match(/^[a-zA-Z0-9_-]{11}$/)) {
                  return `https://youtu.be/${input}`;
                }
                return input;
              },
            },
            {
              type: "list",
              name: "weekNumber",
              message: "Select the assignment week:",
              choices: weekConfigs.map((w) => ({
                name: `Week ${w.number}: ${w.name} (${w.totalPoints} pts)`,
                value: w.number,
              })),
              default: weekConfigs.length > 0 ? weekConfigs[0].number : null,
            },
          ]);

          // Combine with previous student info
          answers = {
            ...lastStudentInfo,
            ...newAnswers,
          };
        } else {
          // User wants to enter new student info
          answers = await getFullStudentInfo(weekConfigs);
        }
      } else {
        // First time or no previous info
        answers = await getFullStudentInfo(weekConfigs);
      }

      // Store this info for next time
      lastStudentInfo = {
        studentName: answers.studentName,
        email: answers.email,
      };

      console.log("\n📝 Grading Details Summary:");
      console.log(`Student: ${answers.studentName}`);
      console.log(`Email: ${answers.email}`);
      console.log(`GitHub: ${answers.githubUrl}`);
      console.log(
        `YouTube: ${
          answers.hasYoutubeVideo ? answers.youtubeUrl : "Not submitted"
        }`
      );
      console.log(`Week: ${answers.weekNumber}`);

      const confirm = await inquirer.prompt([
        {
          type: "confirm",
          name: "proceed",
          message: "Proceed with grading?",
          default: true,
        },
      ]);

      if (confirm.proceed) {
        // Build the command
        let command = `node ${indexPath} -n "${answers.studentName}" -e "${answers.email}" -g ${answers.githubUrl} -w ${answers.weekNumber}`;

        // Only add YouTube URL if provided
        if (answers.hasYoutubeVideo) {
          command += ` -y ${answers.youtubeUrl}`;
        }

        console.log("\n🚀 Starting grading process...");
        console.log(`Executing: ${command}`);

        // Execute the grading command
        execSync(command, { stdio: "inherit" });

        // Ask if they want to grade another student
        const another = await inquirer.prompt([
          {
            type: "confirm",
            name: "gradeAnother",
            message: "Would you like to grade another student?",
            default: true,
          },
        ]);

        if (!another.gradeAnother) {
          console.log("\n👋 Thank you for using AI Grader. Goodbye!");
          break;
        }
        // Continue loop for another student
      } else {
        console.log("\n❌ Grading cancelled.");
        // Ask if they want to try again or exit
        const tryAgain = await inquirer.prompt([
          {
            type: "confirm",
            name: "retry",
            message: "Would you like to try again with different info?",
            default: true,
          },
        ]);

        if (!tryAgain.retry) {
          console.log("\n👋 Goodbye!");
          break;
        }
      }
    }
  } catch (error) {
    console.error("Error in interactive mode:", error);
  }
}

/**
 * Get full student information (name, email, assignment details)
 */
async function getFullStudentInfo(weekConfigs) {
  return await inquirer.prompt([
    {
      type: "input",
      name: "studentName",
      message: "Enter the student's full name:",
      validate: (input) =>
        input.trim() !== "" ? true : "Student name is required",
    },
    {
      type: "input",
      name: "email",
      message: "Enter the student's email address:",
      validate: (input) =>
        input.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
          ? true
          : "Please enter a valid email address",
    },
    {
      type: "input",
      name: "githubUrl",
      message: "Enter the GitHub repository URL:",
      validate: (input) =>
        input.match(/github\.com\/[\w-]+\/[\w-]+/)
          ? true
          : "Please enter a valid GitHub URL",
    },
    {
      type: "confirm",
      name: "hasYoutubeVideo",
      message: "Did the student submit a YouTube video?",
      default: true,
    },
    {
      type: "input",
      name: "youtubeUrl",
      message: "Enter the YouTube video URL or ID:",
      when: (answers) => answers.hasYoutubeVideo,
      validate: (input) => {
        if (
          input.match(/^[a-zA-Z0-9_-]{11}$/) ||
          input.match(/youtube\.com\/watch\?v=/) ||
          input.match(/youtu\.be\//)
        ) {
          return true;
        }
        return "Please enter a valid YouTube URL or video ID";
      },
      filter: (input) => {
        if (input.match(/^[a-zA-Z0-9_-]{11}$/)) {
          return `https://youtu.be/${input}`;
        }
        return input;
      },
    },
    {
      type: "list",
      name: "weekNumber",
      message: "Select the assignment week:",
      choices: weekConfigs.map((w) => ({
        name: `Week ${w.number}: ${w.name} (${w.totalPoints} pts)`,
        value: w.number,
      })),
      default: weekConfigs.length > 0 ? weekConfigs[0].number : null,
    },
  ]);
}

// Run the interactive grader if this file is executed directly
if (require.main === module) {
  launchInteractiveGrader();
}

module.exports = { launchInteractiveGrader };
