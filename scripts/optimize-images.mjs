// One-shot image optimization for profile photos and OG card.
// Generates:
//   public/images/profile_<n>.webp  (square hero crop, ~600px)
//   public/images/og-card.jpg       (1200x630 social preview, cropped)
// Source JPEGs are kept untouched as <picture> fallbacks.
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const IMG_DIR = 'public/images';
const HERO_SIZE = 600;
const OG_W = 1200;
const OG_H = 630;
const WEBP_QUALITY = 80;

const files = (await readdir(IMG_DIR)).filter(f => /^profile_\d+\.jpg$/i.test(f));
files.sort();

console.log(`Found ${files.length} source profile images`);

for (const file of files) {
  const src = join(IMG_DIR, file);
  const out = join(IMG_DIR, file.replace(/\.jpg$/i, '.webp'));
  await sharp(src)
    .resize(HERO_SIZE, HERO_SIZE, { fit: 'cover', position: 'attention' })
    .webp({ quality: WEBP_QUALITY })
    .toFile(out);
  const [srcStat, outStat] = await Promise.all([stat(src), stat(out)]);
  console.log(`  ${file} (${kb(srcStat.size)}) -> ${out.split(/[\\/]/).pop()} (${kb(outStat.size)})`);
}

// Build the OG card from profile_1 — 1200x630 cover-crop, JPEG, optimized.
const ogSrc = join(IMG_DIR, 'profile_1.jpg');
const ogOut = join(IMG_DIR, 'og-card.jpg');
await sharp(ogSrc)
  .resize(OG_W, OG_H, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile(ogOut);
const ogStat = await stat(ogOut);
console.log(`OG card: profile_1.jpg -> og-card.jpg (${OG_W}x${OG_H}, ${kb(ogStat.size)})`);
