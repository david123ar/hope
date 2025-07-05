const fs = require("fs");
const path = require("path");

// Load original imageData file
const imageData = require("./imageData.js").imageData;

// Define the new base URL
const BASE_URL = "https://cdn.noitatnemucod.net/avatar/100x100";

// Transform function to update all URLs
function updateImageUrls(data) {
  for (const key in data.hashtags) {
    data.hashtags[key].images = data.hashtags[key].images.map((url) => {
      const parts = url.split("/").filter(Boolean);
      const dirIndex = parts.findIndex((part) => part === "avatar");
      const relativePath = parts.slice(dirIndex + 1).join("/");
      return `${BASE_URL}/${relativePath}`;
    });
  }
  return data;
}

// Apply transformation
const updatedData = updateImageUrls(imageData);

// Save updated output
fs.writeFileSync(
  path.join(__dirname, "imageData.updated.js"),
  `export const imageData = ${JSON.stringify(updatedData, null, 2)};\n`,
  "utf8"
);

console.log("✅ imageData.updated.js generated successfully.");
