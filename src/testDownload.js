const { downloadExcelFile } = require("./sharepointAuth");

downloadExcelFile()
  .then((path) => console.log(`File downloaded to ${path}`))
  .catch((err) => console.error("Download failed:", err));
