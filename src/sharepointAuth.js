const request = require("request");
const fs = require("fs");
const path = require("path");
const config = require("./sharepointConfig");

async function getSharePointAuth() {
  const authOptions = {
    url: config.siteUrl,
    strategy: "online",
    username: config.username,
    password: config.password,
  };

  console.log("Constructing authOptions...");
  console.log(`Sanitized username: ${authOptions.username}`);
  console.log(`Sanitized password: ${authOptions.password}`);
  console.log("authOptions:", authOptions);

  console.log("Attempting authentication...");
  return new Promise((resolve, reject) => {
    request.get(
      {
        url: `${config.siteUrl}/_vti_bin/client.svc`,
        headers: {
          Authorization: "Bearer",
        },
        auth: {
          username: authOptions.username,
          password: authOptions.password,
        },
      },
      (err, response, body) => {
        if (err) {
          console.error("Authentication failed:", err);
          return reject(err);
        }

        // Debug: Log the response status and headers
        console.log("Authentication response status:", response.statusCode);
        console.log("Authentication response headers:", response.headers);

        const cookies = response.headers["set-cookie"];
        if (!cookies) {
          console.error("No cookies received in response");
          return reject(
            new Error("Authentication failed: No cookies received")
          );
        }

        const auth = {
          headers: {
            Cookie: cookies.join(";"),
          },
        };
        console.log("Authentication completed:", auth);
        resolve(auth);
      }
    );
  });
}

async function downloadExcelFile() {
  const auth = await getSharePointAuth();
  const fileUrl = `${config.siteUrl}/_api/web/GetFileByServerRelativeUrl('/personal/muhammad_shoaib_quickstart_com/Documents/Grading and Session details.xlsx')/$value`;
  const localPath = "../grading_temp.xlsx";

  console.log(`Downloading file from ${fileUrl} to ${localPath}...`);

  return new Promise((resolve, reject) => {
    request
      .get({
        url: fileUrl,
        headers: auth.headers,
      })
      .on("error", (err) => {
        console.error("Download failed:", err);
        reject(err);
      })
      .pipe(fs.createWriteStream(localPath))
      .on("finish", () => {
        console.log("Download completed.");
        resolve();
      });
  });
}

async function uploadExcelFile() {
  const auth = await getSharePointAuth();
  const localPath = "../grading_temp.xlsx";
  const folderPath = "/personal/muhammad_shoaib_quickstart_com/Documents";
  const fileName = "Grading and Session details.xlsx";
  const uploadUrl = `${config.siteUrl}/_api/web/GetFolderByServerRelativeUrl('${folderPath}')/Files/add(url='${fileName}',overwrite=true)`;

  console.log(`Uploading file from ${localPath} to SharePoint...`);

  return new Promise((resolve, reject) => {
    fs.createReadStream(localPath)
      .pipe(
        request.post({
          url: uploadUrl,
          headers: {
            ...auth.headers,
            "Content-Length": fs.statSync(localPath).size,
          },
        })
      )
      .on("response", (response) => {
        if (response.statusCode === 200) {
          console.log("Upload completed.");
          resolve();
        } else {
          console.error("Upload failed with status:", response.statusCode);
          reject(new Error(`Upload failed: ${response.statusCode}`));
        }
      })
      .on("error", (err) => {
        console.error("Upload failed:", err);
        reject(err);
      });
  });
}

module.exports = { getSharePointAuth, downloadExcelFile, uploadExcelFile };
