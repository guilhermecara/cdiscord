const fs = require("fs");

const env = fs.readFileSync(".env", "utf8");

for (const line of env.split("\n")) {
  if (!line || line.startsWith("#")) continue;

  const i = line.indexOf("=");
  if (i === -1) continue;

  const k = line.slice(0, i).trim();
  const v = line.slice(i + 1).trim();

  if (!(k in process.env)) process.env[k] = v;
}

module.exports = {};
