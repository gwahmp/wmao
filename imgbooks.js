// scripts/process-images.js
import fs from "fs";
import path from "path";
import sharp from "sharp";

const rawDir = path.join(process.cwd(), "raw/books");
const outDir800 = path.join(process.cwd(), "public/assets/images/books");
const outDir200 = path.join(outDir800, "200");

// Ensure output directories exist
[ outDir800, outDir200 ].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function processImage(file) {
  const inputPath = path.join(rawDir, file);
  const baseName = path.parse(file).name + ".webp"; // always webp output
  const outPath800 = path.join(outDir800, baseName);
  const outPath200 = path.join(outDir200, baseName);

  // Skip if both versions already exist
  if (fs.existsSync(outPath800) && fs.existsSync(outPath200)) {
    console.log(`✅ Skipped (already processed): ${file}`);
    return;
  }

  try {
    // 800px version
    if (!fs.existsSync(outPath800)) {
      await sharp(inputPath)
        .resize({ width: 800 })
        .webp({ quality: 80 }) // adjust quality for size/performance balance
        .toFile(outPath800);
      console.log(`📸 Created 800px: ${outPath800}`);
    }

    // 200px version
    if (!fs.existsSync(outPath200)) {
      await sharp(inputPath)
        .resize({ width: 200 })
        .webp({ quality: 75 })
        .toFile(outPath200);
      console.log(`📸 Created 200px: ${outPath200}`);
    }
  } catch (err) {
    console.error(`❌ Error processing ${file}:`, err);
  }
}

async function run() {
  const files = fs.readdirSync(rawDir).filter(f =>
    /\.(jpe?g|png|webp|avif|tiff|gif)$/i.test(f)
  );

  for (const file of files) {
    await processImage(file);
  }
}

run();
