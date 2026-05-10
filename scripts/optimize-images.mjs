// One-shot image optimization for profile photos and OG card.
// - public/images/profile_<n>.webp  (600x600 hero crop, q80)
// - public/images/og-card.jpg       (1200x630 social preview, mozjpeg)
// Source JPEGs are kept as <picture> fallbacks.
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const IMG_DIR = 'public/images';
const HERO_SIZE = 600;
const OG_W = 1200;
const OG_H = 630;
const WEBP_QUALITY = 80;
const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const files = (await readdir(IMG_DIR))
  .filter((f) => /^profile_\d+\.jpg$/i.test(f))
  .sort();

console.log(`Found ${files.length} source profile images`);

for (const file of files) {
  const src = join(IMG_DIR, file);
  const out = join(IMG_DIR, file.replace(/\.jpg$/i, '.webp'));
  await sharp(src)
    .resize(HERO_SIZE, HERO_SIZE, { fit: 'cover', position: 'attention' })
    .webp({ quality: WEBP_QUALITY })
    .toFile(out);
  const [s1, s2] = await Promise.all([stat(src), stat(out)]);
  console.log(`  ${file} (${kb(s1.size)}) -> ${out.split(/[\\/]/).pop()} (${kb(s2.size)})`);
}

const ogSrc = join(IMG_DIR, 'profile_1.jpg');
const ogOut = join(IMG_DIR, 'og-card.jpg');
await sharp(ogSrc)
  .resize(OG_W, OG_H, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile(ogOut);
const ogStat = await stat(ogOut);
console.log(`OG card: profile_1.jpg -> og-card.jpg (${OG_W}x${OG_H}, ${kb(ogStat.size)})`);
