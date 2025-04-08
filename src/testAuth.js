const { getSharePointAuth } = require("./sharepointAuth");
getSharePointAuth()
  .then((auth) => console.log("Authentication successful:", auth))
  .catch((err) => console.error("Authentication failed:", err));
