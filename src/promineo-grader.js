#!/usr/bin/env node

require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const puppeteer = require("puppeteer");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

// Import your existing services
const { processGitHubRepo } = require("./services/github");
const { getYouTubeTranscript } = require("./services/youtube");
const { evaluateAssignment } = require("./services/ai");
const { generateHtml } = require("./utils/html-template");

// Import our new Promineo config
const {
  getPromineoWeekConfig,
  getAvailablePromineoWeeks,
} = require("./config/promineo-weeks");

// Helper function for delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Main Promineo LMS Grader
 */
async function main() {
  const argv = yargs(hideBin(process.argv))
    .option("week", {
      alias: "w",
      description: "Week number to grade",
      type: "number",
      choices: getAvailablePromineoWeeks(),
    })
    .option("student", {
      alias: "s",
      description: "Specific student name (optional)",
      type: "string",
    })
    .option("test", {
      alias: "t",
      description: "Test mode - fill forms but don't submit",
      type: "boolean",
      default: true, // Default to test mode for safety
    })
    .demandOption(["week"])
    .help()
    .alias("help", "h").argv;

  const { week: weekNumber, student: targetStudent, test: testMode } = argv;

  console.log(`\n🚀 Starting Promineo Grader for Week ${weekNumber}...`);
  if (testMode) {
    console.log("🧪 TEST MODE: Forms will be filled but NOT submitted");
  } else {
    console.log("🔴 LIVE MODE: Grades will be submitted to LMS");
  }

  // Get week configuration
  const weekConfig = getPromineoWeekConfig(weekNumber);
  console.log(`📋 Assignment: ${weekConfig.aiGraderConfig.name}`);

  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
    slowMo: 100,
  });

  const page = await browser.newPage();

  try {
    // Step 1: Login to Promineo (reuse your existing code)
    await loginToPromineo(page);

    // Step 2: Navigate to course (reuse your existing code)
    await navigateToCourse(page);

    // Step 3: Navigate to specific week
    await navigateToWeek(page, weekConfig);

    // Step 4: Find and process submissions
    const students = await findStudentSubmissions(page, targetStudent);

    console.log(`\n📝 Found ${students.length} student submissions to process`);

    // Step 5: Process each student (with SMS approval)
    for (let i = 0; i < students.length; i++) {
      const student = students[i];
      console.log(
        `\n👤 Processing student ${i + 1}/${students.length}: ${student.name}`
      );

      // Send SMS for approval
      const approved = await sendSMSApproval(student, weekConfig, testMode);

      if (approved) {
        await processStudent(student, weekConfig, testMode);
      } else {
        console.log(`⏭️  Skipping ${student.name}`);
      }
    }

    console.log("\n✨ Promineo grading session complete!");
  } catch (error) {
    console.error("❌ Error during Promineo grading:", error.message);
  } finally {
    await browser.close();
  }
}

/**
 * Login to Promineo LMS (reuse your existing code)
 */
async function loginToPromineo(page) {
  console.log("🔐 Logging into Promineo LMS...");

  const username = process.env.PROMINEO_USERNAME || "jt125845@gmail.com";
  const password = process.env.PROMINEO_PASSWORD || "Red!2345";

  await page.goto("https://learn.promineotech.com/login/index.php", {
    waitUntil: "networkidle2",
  });

  await page.waitForSelector('input[name="username"]', { timeout: 15000 });

  // Clear and type username
  await page.focus('input[name="username"]');
  await page.keyboard.down("Control");
  await page.keyboard.press("a");
  await page.keyboard.up("Control");
  for (const char of username) {
    await page.keyboard.type(char);
    await delay(50);
  }

  // Clear and type password
  await page.focus('input[name="password"]');
  await page.keyboard.down("Control");
  await page.keyboard.press("a");
  await page.keyboard.up("Control");
  for (const char of password) {
    await page.keyboard.type(char);
    await delay(50);
  }

  // Click login
  const loginClicked = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll("button"));
    const loginBtn = buttons.find((btn) => btn.textContent.includes("Log in"));
    if (loginBtn) {
      loginBtn.click();
      return true;
    }
    return false;
  });

  if (!loginClicked) {
    await page.keyboard.press("Enter");
  }

  await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 15000 });
  console.log("✅ Login successful");
}

/**
 * Navigate to Front End Software Developer course (reuse your existing code)
 */
async function navigateToCourse(page) {
  console.log("🎯 Navigating to course...");

  await delay(3000);

  const courseClicked = await page.evaluate(() => {
    const goCourseButtons = Array.from(
      document.querySelectorAll('a[title="Go to course"]')
    );

    for (const button of goCourseButtons) {
      if (button.href && button.href.includes("course/view.php?id=154")) {
        button.click();
        return true;
      }
    }

    if (goCourseButtons.length > 0) {
      goCourseButtons[0].click();
      return true;
    }

    return false;
  });

  if (!courseClicked) {
    throw new Error("Could not find course navigation button");
  }

  await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 });
  console.log("✅ Successfully navigated to course");
}

/**
 * Navigate to specific week in the sidebar
 */
async function navigateToWeek(page, weekConfig) {
  console.log(`📚 Navigating to ${weekConfig.sidebarSelector}...`);

  await delay(2000);

  // Try to find and click the week in the sidebar
  const weekClicked = await page.evaluate((patterns) => {
    // Look for week links in sidebar
    const sidebarLinks = Array.from(document.querySelectorAll("a"));

    for (const pattern of patterns) {
      const weekLink = sidebarLinks.find((link) =>
        link.textContent.trim().includes(pattern)
      );

      if (weekLink) {
        console.log(`Found week link: "${weekLink.textContent.trim()}"`);
        weekLink.click();
        return { success: true, text: weekLink.textContent.trim() };
      }
    }

    return { success: false };
  }, weekConfig.sidebarTextPatterns);

  if (!weekClicked.success) {
    // Debug: Show all sidebar links
    const sidebarLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a"))
        .filter((link) => link.textContent.trim().length > 0)
        .map((link) => link.textContent.trim())
        .slice(0, 20); // First 20 links
    });

    console.log("🔍 Available sidebar links:", sidebarLinks);
    throw new Error(
      `Could not find week navigation for patterns: ${weekConfig.sidebarTextPatterns.join(
        ", "
      )}`
    );
  }

  console.log(`✅ Clicked on: ${weekClicked.text}`);
  await delay(3000);

  // Now find and click the coding project
  const projectClicked = await page.evaluate((patterns) => {
    const projectLinks = Array.from(document.querySelectorAll("a"));

    for (const pattern of patterns) {
      const projectLink = projectLinks.find((link) =>
        link.textContent.trim().includes(pattern)
      );

      if (projectLink) {
        console.log(`Found project link: "${projectLink.textContent.trim()}"`);
        projectLink.click();
        return { success: true, text: projectLink.textContent.trim() };
      }
    }

    return { success: false };
  }, weekConfig.projectTextPatterns);

  if (!projectClicked.success) {
    // Debug: Show available project links
    const projectLinks = await page.evaluate(() => {
      return Array.from(document.querySelectorAll("a"))
        .filter(
          (link) =>
            link.textContent.trim().includes("Project") ||
            link.textContent.trim().includes("Coding") ||
            link.textContent.trim().includes("Assignment")
        )
        .map((link) => link.textContent.trim());
    });

    console.log("🔍 Available project links:", projectLinks);
    throw new Error(
      `Could not find coding project for patterns: ${weekConfig.projectTextPatterns.join(
        ", "
      )}`
    );
  }

  console.log(`✅ Clicked on: ${projectClicked.text}`);
  await delay(3000);
}

/**
 * Find student submissions on the current page
 */
async function findStudentSubmissions(page, targetStudent = null) {
  console.log("🔍 Looking for 'View all submissions' button...");

  // Take a screenshot to see what we're working with
  await page.screenshot({
    path: "before-view-submissions.png",
    fullPage: true,
  });
  console.log("📸 Screenshot saved: before-view-submissions.png");

  // Click "View all submissions" button - be more specific with the selector
  const viewSubmissionsClicked = await page.evaluate(() => {
    // Look specifically for the "View all submissions" button
    const links = Array.from(document.querySelectorAll("a"));

    console.log("Available links on page:");
    links.forEach((link, index) => {
      if (link.textContent.trim().length > 0) {
        console.log(
          `${index + 1}. "${link.textContent.trim()}" -> ${link.href}`
        );
      }
    });

    // Find the exact "View all submissions" link
    const viewSubmissionsLink = links.find((link) => {
      const text = link.textContent.trim().toLowerCase();
      const href = link.href.toLowerCase();

      return (
        (text === "view all submissions" ||
          text.includes("view all submissions")) &&
        href.includes("action=grading")
      );
    });

    if (viewSubmissionsLink) {
      console.log(
        `Found View all submissions button: "${viewSubmissionsLink.textContent.trim()}"`
      );
      console.log(`URL: ${viewSubmissionsLink.href}`);
      viewSubmissionsLink.click();
      return {
        success: true,
        text: viewSubmissionsLink.textContent.trim(),
        href: viewSubmissionsLink.href,
      };
    }

    // Debug: Show buttons specifically
    const buttons = Array.from(document.querySelectorAll("a.btn, button"));
    console.log("Available buttons:");
    buttons.forEach((btn, index) => {
      console.log(
        `${index + 1}. "${btn.textContent.trim()}" [${btn.className}] -> ${
          btn.href || "no href"
        }`
      );
    });

    return { success: false };
  });

  if (viewSubmissionsClicked.success) {
    console.log(`✅ Clicked: ${viewSubmissionsClicked.text}`);
    console.log(`🔗 Navigating to: ${viewSubmissionsClicked.href}`);

    // Wait for navigation to complete
    await page.waitForNavigation({ waitUntil: "networkidle2", timeout: 10000 });
    await delay(3000);

    // Take another screenshot after clicking
    await page.screenshot({
      path: "after-view-submissions.png",
      fullPage: true,
    });
    console.log("📸 Screenshot saved: after-view-submissions.png");

    // Now extract student data from submissions page
    return await extractStudentData(page, targetStudent);
  } else {
    console.log("❌ Could not find 'View all submissions' button");

    // Debug: Take screenshot of current page
    await page.screenshot({
      path: "debug-no-submissions-button.png",
      fullPage: true,
    });
    console.log("📸 Debug screenshot saved: debug-no-submissions-button.png");

    throw new Error("Could not find 'View all submissions' button");
  }
}

/**
 * Extract student submission data from the submissions page
 */
async function extractStudentData(page, targetStudent = null) {
  console.log("📊 Extracting student submission data...");

  // Take a screenshot to see what we're working with
  await page.screenshot({ path: "submissions-page-debug.png", fullPage: true });
  console.log("📸 Debug screenshot saved: submissions-page-debug.png");

  const students = await page.evaluate((target) => {
    const studentRows = [];

    console.log("🔍 Looking for student submission data...");

    // Debug: Log the page URL and title
    console.log("Current URL:", window.location.href);
    console.log("Page title:", document.title);

    // Strategy 1: Look for "Grade" buttons first, then work backwards
    const gradeButtons = Array.from(document.querySelectorAll("a")).filter(
      (link) =>
        link.textContent.trim().toLowerCase().includes("grade") &&
        link.classList.contains("btn")
    );

    console.log(`Found ${gradeButtons.length} grade buttons`);

    gradeButtons.forEach((gradeButton, index) => {
      console.log(
        `Grade button ${index + 1}:`,
        gradeButton.textContent.trim(),
        gradeButton.href
      );

      // Find the row this grade button belongs to
      let row = gradeButton.closest("tr");
      if (!row) {
        // Sometimes grade buttons aren't in table rows, look for parent containers
        row = gradeButton.closest("div");
      }

      if (row) {
        // Extract all text content from the row
        const rowText = row.textContent.trim();
        console.log(`Row ${index + 1} text:`, rowText);

        // Look for email patterns in the row
        const emailMatch = rowText.match(
          /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
        );
        const email = emailMatch
          ? emailMatch[1]
          : `student${index + 1}@example.com`;

        // Extract name (usually before the email or in a specific cell)
        let name = `Student ${index + 1}`;
        const namePatterns = [
          // Try to find name before @ symbol
          rowText.match(/([A-Za-z]+\s+[A-Za-z]+)\s*[a-zA-Z0-9._%+-]+@/),
          // Try to find capitalized words that might be names
          rowText.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)/),
        ];

        for (const pattern of namePatterns) {
          if (pattern && pattern[1]) {
            name = pattern[1].trim();
            break;
          }
        }

        // Look for GitHub URLs in the row
        const githubMatch =
          rowText.match(/(https?:\/\/github\.com\/[^\s]+)/i) ||
          rowText.match(/(github\.com\/[^\s]+)/i);
        let githubUrl = null;
        if (githubMatch) {
          githubUrl = githubMatch[1].startsWith("http")
            ? githubMatch[1]
            : "https://" + githubMatch[1];
        }

        // Look for YouTube URLs
        const youtubeMatch = rowText.match(
          /(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i
        );
        let youtubeUrl = null;
        if (youtubeMatch) {
          youtubeUrl = youtubeMatch[0].startsWith("http")
            ? youtubeMatch[0]
            : "https://" + youtubeMatch[0];
        }

        // Add student data
        studentRows.push({
          name: name,
          email: email,
          githubUrl: githubUrl,
          youtubeUrl: youtubeUrl,
          gradeUrl: gradeButton.href,
          status: "Submitted for grading",
          rowText: rowText, // Keep for debugging
        });
      }
    });

    // Strategy 2: If no grade buttons found, look for submission table structure
    if (gradeButtons.length === 0) {
      console.log("No grade buttons found, looking for table structure...");

      // Look for tables with submission data
      const tables = Array.from(document.querySelectorAll("table"));
      console.log(`Found ${tables.length} tables`);

      tables.forEach((table, tableIndex) => {
        const rows = Array.from(table.querySelectorAll("tr"));
        console.log(`Table ${tableIndex + 1} has ${rows.length} rows`);

        rows.forEach((row, rowIndex) => {
          const cells = Array.from(row.querySelectorAll("td, th"));
          if (cells.length > 0) {
            const rowText = row.textContent.trim();
            console.log(
              `Table ${tableIndex + 1}, Row ${rowIndex + 1}:`,
              rowText
            );
          }
        });
      });
    }

    console.log(`Extracted ${studentRows.length} student submissions`);
    return studentRows;
  }, targetStudent);

  console.log(`📝 Found ${students.length} students with submissions:`);
  students.forEach((student, i) => {
    console.log(`${i + 1}. ${student.name} (${student.email})`);
    console.log(`   GitHub: ${student.githubUrl || "Not found"}`);
    console.log(`   YouTube: ${student.youtubeUrl || "Not found"}`);
    console.log(`   Grade URL: ${student.gradeUrl}`);
    if (student.rowText) {
      console.log(`   Raw text: ${student.rowText.substring(0, 100)}...`);
    }
    console.log("");
  });

  return students;
}

/**
 * Send SMS for approval (mock for now)
 */
async function sendSMSApproval(student, weekConfig, testMode) {
  const modeText = testMode
    ? " (TEST MODE - no submission)"
    : " (LIVE MODE - will submit)";
  console.log(
    `📱 SMS: Grade ${student.name} - Week ${weekConfig.aiGraderConfig.weekNumber}?${modeText}`
  );

  // For testing, always return true
  // In real implementation, this would send SMS and wait for Y/N response
  return true;
}

/**
 * Process individual student using your existing AI grader
 */
async function processStudent(student, weekConfig, testMode = true) {
  try {
    console.log(`🤖 Processing ${student.name} with AI grader...`);

    // Fetch GitHub content
    const githubContent = await processGitHubRepo(student.githubUrl);

    // Fetch YouTube transcript
    let youtubeTranscript = "";
    if (student.youtubeUrl) {
      youtubeTranscript = await getYouTubeTranscript(student.youtubeUrl);
    }

    // Run AI evaluation using your existing system
    const aiResponse = await evaluateAssignment({
      studentName: student.name,
      studentEmail: student.email,
      weekConfig: weekConfig.aiGraderConfig,
      githubContent,
      youtubeTranscript,
      hasYoutubeVideo: !!student.youtubeUrl,
    });

    // Generate HTML output
    const timestamp = new Date().toISOString().replace(/[:\.]/g, "-");
    const sanitizedName = student.name.replace(/\s+/g, "-");
    const outputFilename = `${sanitizedName}-week${weekConfig.aiGraderConfig.weekNumber}-${timestamp}.html`;

    const htmlOutput = generateHtml(
      student.name,
      student.email,
      weekConfig.aiGraderConfig.weekNumber,
      weekConfig.aiGraderConfig.name,
      aiResponse
    );

    // Save HTML file
    const fs = require("fs-extra");
    const path = require("path");
    const outputPath = path.join(__dirname, "../output", outputFilename);
    fs.writeFileSync(outputPath, htmlOutput);

    console.log(`✅ ${student.name} graded successfully: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error processing ${student.name}:`, error.message);
  }
}

// Run the application
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };
