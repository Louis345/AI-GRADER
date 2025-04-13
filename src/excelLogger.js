const ExcelJS = require("exceljs");

/**
 * Logs grading information to an Excel file
 * @param {string} studentName - Student's name
 * @param {string} email - Student's email
 * @param {string} weekNumber - Week number (formatted as "Week X")
 * @param {string} remarks - Grading remarks
 * @param {string} date - Grading date
 * @returns {Promise<void>}
 */
async function logToExcel(studentName, email, weekNumber, remarks, date) {
  const localPath = path.join(__dirname, "../grading_temp.xlsx");
  const instructorName = "Jamal Taylor"; // Adjust this if your tab has a different name
  const workbook = new ExcelJS.Workbook();
  
  try {
    await workbook.xlsx.readFile(localPath);
    console.log("Excel file loaded successfully.");
  } catch (error) {
    console.log(
      "Local Excel file not found, creating a new one with instructor tab..."
    );
    const worksheet = workbook.addWorksheet(instructorName);
    worksheet.columns = [
      { header: "#", key: "rowNum", width: 5 },
      { header: "Student Name", key: "studentName", width: 20 },
      { header: "Email Address", key: "email", width: 30 },
      { header: "Project Grading", key: "weekNumber", width: 15 },
      { header: "Remarks", key: "remarks", width: 40 },
      { header: "Date", key: "date", width: 15 },
    ];
  }
  
  // Find or create the instructor's worksheet
  let worksheet = workbook.getWorksheet(instructorName);
  if (!worksheet) {
    console.log(`Worksheet "${instructorName}" not found, creating new one...`);
    worksheet = workbook.addWorksheet(instructorName);
    worksheet.columns = [
      { header: "#", key: "rowNum", width: 5 },
      { header: "Student Name", key: "studentName", width: 20 },
      { header: "Email Address", key: "email", width: 30 },
      { header: "Project Grading", key: "weekNumber", width: 15 },
      { header: "Remarks", key: "remarks", width: 40 },
      { header: "Date", key: "date", width: 15 },
    ];
  }
  
  // Truncate remarks if too long
  const maxLength = 1000;
  const truncatedRemarks =
    remarks.length > maxLength
      ? remarks.substring(0, maxLength) + "..."
      : remarks;
  
  // Add a new row with an incremented # (find the last row with data)
  const rowCount = worksheet.actualRowCount || 1;
  const newRowNumber = rowCount > 1 ? rowCount : 1; // If header only, start at 1
  
  worksheet.addRow({
    rowNum: newRowNumber,
    studentName,
    email,
    weekNumber,
    remarks: truncatedRemarks,
    date: date || new Date().toISOString().split("T")[0],
  });
  
  await workbook.xlsx.writeFile(localPath);
  console.log(
    `📝 Grading logged for ${studentName} in ${instructorName} tab of ${localPath}`
  );
}

// Don't forget to import path at the top
const path = require("path");

module.exports = { logToExcel };
