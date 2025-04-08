const { logToExcel } = require("./excelLogger");

async function testLog() {
  try {
    await logToExcel(
      "Test Student",
      "test@example.com",
      "Week 4",
      "Great job!",
      "2025-03-15"
    );
    console.log("Test row added successfully.");
  } catch (error) {
    console.error("Failed to add test row:", error);
  }
}

testLog();
