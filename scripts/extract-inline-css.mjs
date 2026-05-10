// One-shot migration: lift the inline <!-- Critical CSS --> <style> block
// out of index.html and append it to src/input.css so Tailwind/PostCSS can
// process and minify it as part of the regular build. Idempotent: if the
// marker is already present in input.css the script refuses to run again.
import { readFile, writeFile } from 'node:fs/promises';

const HTML = 'index.html';
const CSS = 'src/input.css';
const MARKER = '/* === Migrated from index.html inline <style> block === */';

const html = await readFile(HTML, 'utf8');
const css = await readFile(CSS, 'utf8');

if (css.includes(MARKER)) {
  console.error('input.css already contains the migration marker. Aborting to avoid duplicate styles.');
  process.exit(1);
}

const blockRegex = /\n\s*<!-- Critical CSS -->\s*\n\s*<style>([\s\S]*?)<\/style>\s*\n/;
const match = html.match(blockRegex);
if (!match) {
  console.error('Could not locate the "<!-- Critical CSS --> <style>...</style>" block in index.html.');
  process.exit(1);
}

const cssBlock = match[1];
const cssLineCount = cssBlock.split('\n').length;
const cssBytes = Buffer.byteLength(cssBlock, 'utf8');

const newHtml = html.replace(blockRegex, '\n');
const newCss = `${css.replace(/\s+$/, '')}\n\n${MARKER}\n${cssBlock.trim()}\n`;

await writeFile(HTML, newHtml, 'utf8');
await writeFile(CSS, newCss, 'utf8');

console.log(`Moved ~${cssLineCount} lines (${(cssBytes / 1024).toFixed(1)} KB) of CSS from index.html into ${CSS}.`);
console.log('Run "npm run build" to regenerate dist/styles.css and dist/index.html.');
