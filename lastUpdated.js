import fs from "fs";
import path from "path";

const __dirname = path.resolve();

const lastUpdated = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});

const data = {
  lastUpdated,
};

const filePath = path.resolve(__dirname, "static", "lastUpdated.json");

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");

console.log(`Last updated date written to ${filePath}:`, data);
