const fs = require("fs");
const path = require("path");

const envPath = path.resolve(__dirname, "..", ".env");

if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, "utf8");

  for (const line of env.split("\n")) {
    if (!line || line.trim().startsWith("#")) continue;

    const i = line.indexOf("=");
    if (i === -1) continue;

    const k = line.slice(0, i).trim();
    const v = line.slice(i + 1).trim();

    if (!(k in process.env)) process.env[k] = v;
  }
} else {
    console.warn("Warning: .env file not found at", envPath);
}

module.exports = {};