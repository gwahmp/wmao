import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dataset root
const ROOT = path.join(__dirname, "..", "src", "data", "tools");

// Meta output folder
const META_DIR = path.join(__dirname, "..", "src", "data", "meta");
const OUT = path.join(META_DIR, "tools-stats.json");

fs.mkdirSync(META_DIR, { recursive: true });

let total = 0;

function scan(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) scan(full);
    else if (item.endsWith(".json")) {
      const list = JSON.parse(fs.readFileSync(full, "utf8"));
      if (Array.isArray(list)) total += list.length;
    }
  }
}

scan(ROOT);

fs.writeFileSync(
  OUT,
  JSON.stringify(
    {
      totalTools: total,
      generatedAt: new Date().toISOString()
    },
    null,
    2
  )
);

console.log("✅ Total tools:", total);
console.log("📄 Meta written to:", OUT);
