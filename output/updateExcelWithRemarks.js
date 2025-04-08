const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");
const cheerio = require("cheerio"); // You'll need to install this: npm install cheerio

async function updateExcelWithHtmlRemarks() {
  // Configure paths
  const outputDir = path.join(__dirname, "../output"); // Path to HTML files
  const excelPath = path.join(__dirname, "../grading_temp.xlsx");
  const instructorName = "Jamal Taylor";

  // Load workbook
  const workbook = new ExcelJS.Workbook();
  try {
    await workbook.xlsx.readFile(excelPath);
    console.log("Excel file loaded successfully");
  } catch (error) {
    console.log("Creating new Excel file...");
  }

  // Get or create worksheet
  let worksheet = workbook.getWorksheet(instructorName);
  if (!worksheet) {
    worksheet = workbook.addWorksheet(instructorName);
    // Set up headers
    worksheet.columns = [
      { header: "Student Name", key: "studentName", width: 20 },
      { header: "Email Address", key: "email", width: 30 },
      { header: "Project", key: "project", width: 15 },
      { header: "Remarks", key: "remarks", width: 40 },
      { header: "Date", key: "date", width: 15 },
    ];
  }

  // Read the directory for HTML files
  const files = fs
    .readdirSync(outputDir)
    .filter((file) => file.endsWith(".html"));

  // Process each file
  for (const file of files) {
    try {
      // Extract student info from filename
      // Pattern: StudentName-weekX-date.html
      const parts = file.split("-");
      const weekIndex = parts.findIndex((part) =>
        part.toLowerCase().startsWith("week")
      );

      if (weekIndex > 0) {
        // Extract student name
        const studentName = parts.slice(0, weekIndex).join(" ");

        // Extract week/project
        let project = parts[weekIndex].toLowerCase();
        if (project === "week17") {
          project = "Final Project";
        } else {
          const weekNum = project.replace(/week/i, "").trim();
          project = `Week ${weekNum}`;
        }

        // Extract date from filename
        const dateMatch = file.match(/2025-(\d{2})-(\d{2})T/);
        let dateStr = "";
        if (dateMatch) {
          const month = dateMatch[1];
          const day = dateMatch[2];
          dateStr = `Mar,${parseInt(day)},2025`;
        }

        // Read HTML file to extract remarks
        const htmlPath = path.join(outputDir, file);
        const htmlContent = fs.readFileSync(htmlPath, "utf-8");
        const $ = cheerio.load(htmlContent);

        // Extract Total Score and any summary remarks
        let remarks = "";

        // Look for Total Score information
        $("#content-to-copy")
          .find("p")
          .each((i, el) => {
            const text = $(el).text();
            if (text.includes("Total Score:")) {
              remarks = text;
            }
          });

        // If no specific remarks found, just use "See HTML file"
        if (!remarks) {
          remarks = "See HTML file for details";
        }

        // Check if this entry already exists
        let entryExists = false;
        let existingRow = null;

        worksheet.eachRow((row, rowNumber) => {
          if (rowNumber > 1) {
            // Skip header
            const nameCell = row.getCell(1).value;
            const projectCell = row.getCell(3).value;

            if (nameCell === studentName && projectCell === project) {
              entryExists = true;
              existingRow = row;
            }
          }
        });

        if (entryExists && existingRow) {
          // Update remarks if the row exists
          existingRow.getCell(4).value = remarks;
          console.log(`Updated remarks for ${studentName}, ${project}`);
        } else {
          // Add new row
          worksheet.addRow({
            studentName,
            email: "", // Leave blank for now
            project,
            remarks,
            date: dateStr,
          });
          console.log(`Added entry for ${studentName}, ${project}`);
        }
      }
    } catch (error) {
      console.error(`Error processing file ${file}:`, error);
    }
  }

  // Save the workbook
  await workbook.xlsx.writeFile(excelPath);
  console.log(`Excel file updated successfully: ${excelPath}`);
}

// Run the function
updateExcelWithHtmlRemarks().catch((error) => {
  console.error("Error updating Excel file:", error);
});
