const ExcelJS = require("exceljs");

async function logToExcel(studentName, email, weekNumber, remarks, date) {
  const localPath = "../grading_temp.xlsx";
  const instructorName = "Jamal Taylor"; // Adjust this if your tab has a different name (e.g., your email)

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
  const lastRow = worksheet.lastRow || { number: 0 };
  const newRowNumber = lastRow.number + 1;
  worksheet.addRow({
    "#": newRowNumber,
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

module.exports = { logToExcel };
