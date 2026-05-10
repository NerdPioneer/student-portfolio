// Minify root index.html into dist/index.html (optional deploy artifact).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { minify } from 'html-minifier-terser';

const SRC = 'index.html';
const OUT_DIR = 'dist';
const OUT = `${OUT_DIR}/index.html`;

const html = await readFile(SRC, 'utf8');

const minified = await minify(html, {
  collapseWhitespace: true,
  removeComments: true,
  removeRedundantAttributes: true,
  removeScriptTypeAttributes: true,
  removeStyleLinkTypeAttributes: true,
  useShortDoctype: true,
  minifyCSS: true,
  minifyJS: true,
  sortAttributes: true,
  sortClassName: true,
});

await mkdir(OUT_DIR, { recursive: true });
await writeFile(OUT, minified, 'utf8');

const before = (html.length / 1024).toFixed(1);
const after = (minified.length / 1024).toFixed(1);
const saved = (((html.length - minified.length) / html.length) * 100).toFixed(1);
console.log(`HTML: ${before} KB -> ${after} KB (-${saved}%)  written to ${OUT}`);
