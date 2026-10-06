// Quick validation: check that index.html references real files
import fs from 'node:fs';
import path from 'node:path';

const root = process.argv[2];
if (!root) { console.error('usage: node _validate.mjs <root>'); process.exit(1); }

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const refs = new Set();

// href / src attributes
const re = /(?:href|src)\s*=\s*"([^"]+)"/g;
let m;
while ((m = re.exec(html))) refs.add(m[1]);

// url(...) in style.css
const css = fs.readFileSync(path.join(root, 'style.css'), 'utf8');
const cssRe = /url\(\s*['"]?([^'")]+)['"]?\s*\)/g;
while ((m = cssRe.exec(css))) refs.add(m[1]);

let ok = 0, bad = 0;
for (const r of refs) {
  if (/^(https?:|data:|#|\/\/)/i.test(r)) { ok++; continue; }
  let r2;
  if (r.startsWith('./')) r2 = r.slice(2);
  else r2 = r;
  const full = path.join(root, r2);
  if (fs.existsSync(full)) { ok++; }
  else { console.log('MISSING:', r, '->', full); bad++; }
}
console.log('Total:', refs.size, 'OK:', ok, 'MISSING:', bad);
process.exit(bad === 0 ? 0 : 1);