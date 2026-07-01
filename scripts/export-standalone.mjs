import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const distDir = fileURLToPath(new URL('../dist/', import.meta.url));
const htmlPath = join(distDir, 'index.html');
const html = await readFile(htmlPath, 'utf8');

const cssHref = html.match(/<link rel="stylesheet" href="([^"]+\.css)">/)?.[1];
if (!cssHref) {
  throw new Error('Could not find built CSS link in dist/index.html');
}

const cssPath = join(distDir, cssHref.replace(/^\/+/, ''));
const css = await readFile(cssPath, 'utf8');
const standalone = html.replace(
  /<link rel="stylesheet" href="[^"]+\.css">/,
  `<style data-inlined-from="${cssHref}">\n${css}\n</style>`
);

await writeFile(join(distDir, 'article-hub-landing.html'), standalone, 'utf8');
