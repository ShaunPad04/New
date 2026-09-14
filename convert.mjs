import sharp from "file:///C:/Users/bradl/Claude Code/New/node_modules/.pnpm/sharp@0.35.4_@types+node@20.19.43/node_modules/sharp/lib/index.js";
const info = await sharp(process.argv[2])
  .resize({ width: 1400, withoutEnlargement: true })
  .grayscale()
  .webp({ quality: 82 })
  .toFile(process.argv[3]);
console.log(JSON.stringify(info));
