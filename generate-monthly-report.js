#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
// Using regex parsing instead of JSDOM to avoid dependency
const inquirer = require("inquirer");

/**
 * Monthly Grading Report Generator
 * Parses HTML grading files and generates CSV report
 */

class GradingReportGenerator {
  constructor() {
    // Fix the path - when running from project root, __dirname is the location of the script
    this.outputDir = path.join(process.cwd(), "output");
    this.cohortMappings = {
      // Add more cohort mappings as needed
      default: "2025-2-25-fe-central",
    };

    console.log(`📂 Looking for files in: ${this.outputDir}`);
  }

  /**
   * Main function to generate monthly report
   */
  async generateReport() {
    try {
      console.log("🎓 Monthly Grading Report Generator\n");

      // Get month/year from user
      const { monthYear } = await inquirer.prompt([
        {
          type: "input",
          name: "monthYear",
          message: "Enter the month and year (MM/YYYY format):",
          validate: (input) => {
            if (input.match(/^\d{1,2}\/\d{4}$/)) {
              return true;
            }
            return "Please enter in MM/YYYY format (e.g., 8/2025)";
          },
        },
      ]);

      console.log(`\n📊 Generating report for ${monthYear}...`);

      // Parse month/year
      const [month, year] = monthYear.split("/").map(Number);

      // Find all HTML files in output directory
      const htmlFiles = await this.findHtmlFiles();
      console.log(
        `📁 Found ${htmlFiles.length} HTML files in output directory`
      );

      // Filter files by month/year
      const monthFiles = this.filterFilesByMonth(htmlFiles, month, year);
      console.log(`📅 Found ${monthFiles.length} files for ${monthYear}`);

      if (monthFiles.length === 0) {
        console.log(`❌ No grading files found for ${monthYear}`);
        return;
      }

      // Parse each file and extract data
      const gradingData = await this.parseGradingFiles(monthFiles);

      // Generate CSV
      const csvContent = this.generateCSV(gradingData);

      // Save CSV file with proper encoding
      const csvFileName = `grading_report_${month}_${year}.csv`;
      const csvPath = path.join(this.outputDir, csvFileName);

      // Write with UTF-8 BOM for Excel compatibility
      const csvWithBOM = "\ufeff" + csvContent;
      fs.writeFileSync(csvPath, csvWithBOM, "utf8");

      console.log(`\n✅ Report generated successfully!`);
      console.log(`📄 CSV file saved: ${csvPath}`);
      console.log(`📋 ${gradingData.length} records processed`);

      console.log("\n📤 IMPORT INSTRUCTIONS:");
      console.log("1. Go to SharePoint Excel");
      console.log('2. Click "Upload and open" or "Open" → "Upload"');
      console.log(`3. Select the file: ${csvFileName}`);
      console.log(
        "4. Excel should automatically recognize it as CSV and import properly"
      );

      console.log("\n🔄 Alternative: Use Data → Get Data → From Text/CSV");
      console.log("   Then browse and select your CSV file");

      // Show preview
      console.log("\n📋 Preview of CSV content:");
      const lines = csvContent.split("\r\n");
      console.log(lines.slice(0, 4).join("\n")); // Header + 3 records
    } catch (error) {
      console.error("❌ Error generating report:", error.message);
      console.error(error.stack);
    }
  }

  /**
   * Find all HTML files in output directory
   */
  async findHtmlFiles() {
    try {
      console.log(`📂 Checking directory: ${this.outputDir}`);

      // Check if directory exists
      if (!fs.existsSync(this.outputDir)) {
        console.error(`❌ Output directory does not exist: ${this.outputDir}`);
        return [];
      }

      const files = fs.readdirSync(this.outputDir);
      console.log(`📄 All files found: ${files.join(", ")}`);

      const htmlFiles = files
        .filter((file) => file.endsWith(".html"))
        .map((file) => ({
          name: file,
          path: path.join(this.outputDir, file),
          stats: fs.statSync(path.join(this.outputDir, file)),
        }));

      console.log(`📋 HTML files: ${htmlFiles.map((f) => f.name).join(", ")}`);
      return htmlFiles;
    } catch (error) {
      console.error("Error reading output directory:", error.message);
      return [];
    }
  }

  /**
   * Filter files by month and year based on filename timestamp
   */
  filterFilesByMonth(files, targetMonth, targetYear) {
    return files.filter((file) => {
      try {
        // Extract timestamp from filename (format: name-week#-YYYY-MM-DDTHH-mm-ss-sssZ.html)
        const timestampMatch = file.name.match(/(\d{4})-(\d{2})-(\d{2})T/);

        if (timestampMatch) {
          const [, year, month] = timestampMatch;
          return (
            parseInt(year) === targetYear && parseInt(month) === targetMonth
          );
        }

        // Fallback: use file modification time
        const fileDate = file.stats.mtime;
        return (
          fileDate.getFullYear() === targetYear &&
          fileDate.getMonth() + 1 === targetMonth
        );
      } catch (error) {
        console.warn(`Warning: Could not parse date from ${file.name}`);
        return false;
      }
    });
  }

  /**
   * Parse HTML grading files and extract data using regex
   */
  async parseGradingFiles(files) {
    const gradingData = [];

    for (const file of files) {
      try {
        console.log(`📖 Processing: ${file.name}`);

        const htmlContent = fs.readFileSync(file.path, "utf8");

        // Extract metadata from meta tags using regex
        const studentName =
          this.extractMetaContent(htmlContent, "student-name") || "Unknown";
        const studentEmail =
          this.extractMetaContent(htmlContent, "student-email") || "N/A";
        const weekNumber =
          this.extractMetaContent(htmlContent, "week-number") || "Unknown";
        const assignmentName =
          this.extractMetaContent(htmlContent, "assignment-name") || "Unknown";
        const gradingDate = this.extractMetaContent(
          htmlContent,
          "grading-date"
        );

        // Parse grading date
        const submissionDate = gradingDate
          ? new Date(gradingDate)
          : file.stats.mtime;
        const formattedSubmissionDate = `${
          submissionDate.getMonth() + 1
        }/${submissionDate.getDate()}/${submissionDate.getFullYear()}`;

        // Determine cohort (you might need to customize this logic)
        const cohort = this.determineCohort(studentEmail, submissionDate);

        // Calculate due date (you might need to customize this logic)
        const dueDate = this.calculateDueDate(weekNumber, submissionDate);

        // Create record
        const record = {
          project: `Week ${weekNumber}: ${this.getProjectName(assignmentName)}`,
          bootcamp: "Front End Software Developer",
          studentName: studentName,
          email: studentEmail,
          cohort: cohort,
          dueDate: dueDate,
          status: "Submitted",
          submissionDate: formattedSubmissionDate,
          grade: "Graded",
        };

        gradingData.push(record);
        console.log(`  ✅ Processed: ${studentName} - ${record.project}`);
      } catch (error) {
        console.error(`❌ Error processing ${file.name}:`, error.message);
      }
    }

    return gradingData;
  }

  /**
   * Extract meta tag content using regex
   */
  extractMetaContent(html, name) {
    const regex = new RegExp(
      `<meta\\s+name="${name}"\\s+content="([^"]*)"`,
      "i"
    );
    const match = html.match(regex);
    return match ? match[1] : null;
  }

  /**
   * Determine cohort based on email and date (customize as needed)
   */
  determineCohort(email, date) {
    // Add logic to determine cohort based on email domain, date, or other factors
    // For now, return a default cohort
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    // Example logic - customize based on your cohort structure
    if (month >= 2 && month <= 4) {
      return `${year}-2-25-fe-central`;
    } else if (month >= 5 && month <= 7) {
      return `${year}-4-30-fe-central`;
    } else if (month >= 8 && month <= 10) {
      return `${year}-7-30-fe-central`;
    } else {
      return `${year}-2-25-fe-central`;
    }
  }

  /**
   * Calculate due date based on week number and submission date
   */
  calculateDueDate(weekNumber, submissionDate) {
    // Add logic to calculate due date based on cohort schedule
    // For now, estimate based on submission date
    const dueDate = new Date(submissionDate);
    dueDate.setDate(dueDate.getDate() - 7); // Assume submitted a week after due

    return `${
      dueDate.getMonth() + 1
    }/${dueDate.getDate()}/${dueDate.getFullYear()}`;
  }

  /**
   * Get project name from assignment name
   */
  getProjectName(assignmentName) {
    // Map assignment names to project names
    const projectMappings = {
      "Bootstrap Project": "Bootstrap",
      "JS4 - ECMA Script": "JavaScript ECMA",
      "JavaScript Unit Final Coding Project - WAR Card Game":
        "JavaScript WAR Game",
      "API's and Fetch": "API Integration",
      "Final Coding Project": "Final Project",
    };

    return projectMappings[assignmentName] || assignmentName;
  }

  generateCSV(data) {
    // CSV headers
    const headers = [
      "Project",
      "Bootcamp",
      "Student",
      "Email",
      "Cohort",
      "Due Date",
      "Status",
      "Submission Date",
      "Grade",
    ];

    // Start with headers
    let csv = headers.join(",") + "\n";

    // Add data rows
    data.forEach((record) => {
      const row = [
        record.project,
        record.bootcamp,
        record.studentName,
        record.email,
        record.cohort,
        record.dueDate,
        record.status,
        record.submissionDate,
        record.grade,
      ];

      // Escape commas in fields by wrapping in quotes
      const escapedRow = row.map((field) => {
        if (field && field.toString().includes(",")) {
          return `"${field}"`;
        }
        return field;
      });

      csv += escapedRow.join(",") + "\n";
    });

    return csv;
  }
}

/**
 * Main execution
 */
async function main() {
  const generator = new GradingReportGenerator();
  await generator.generateReport();
}

// Run if this file is executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { GradingReportGenerator };
