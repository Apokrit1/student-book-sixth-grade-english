/**
 * Coursebook Unit Extender - Data Twins Synchronizer
 * Usage: node sync_data_twins.js <path-to-json> [window-var-name]
 * 
 * Ensures .json and .js files never diverge, preserving 100% offline file:/// compatibility.
 */

const fs = require('fs');
const path = require('path');

function syncTwin() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node sync_data_twins.js <path-to-json> [window-var-name]');
    process.exit(1);
  }

  const jsonPath = path.resolve(args[0]);
  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: JSON file not found: ${jsonPath}`);
    process.exit(1);
  }

  const jsPath = jsonPath.replace(/\.json$/i, '.js');
  let varName = args[1];

  if (!varName) {
    const base = path.basename(jsonPath, '.json');
    if (base.includes('catalog')) {
      varName = 'COURSEBOOK_CATALOG';
    } else if (base.includes('vocabulary')) {
      varName = 'VOCABULARY_DATA';
    } else if (base.includes('workbook')) {
      const match = base.match(/unit(\d+)/i);
      varName = match ? `UNIT${match[1]}_WORKBOOK_DATA` : 'WORKBOOK_DATA';
    } else if (/unit(\d+)/i.test(base)) {
      const match = base.match(/unit(\d+)/i);
      varName = `UNIT${match[1]}_V2_DATA`;
    } else {
      varName = base.toUpperCase().replace(/[^A-Z0-9]/g, '_');
    }
  }

  try {
    const jsonRaw = fs.readFileSync(jsonPath, 'utf-8');
    JSON.parse(jsonRaw);

    const jsContent = `window.${varName} = ${jsonRaw};\n`;
    fs.writeFileSync(jsPath, jsContent, 'utf-8');

    console.log(`[SYNCED] ${path.basename(jsonPath)} ➔ ${path.basename(jsPath)} (window.${varName})`);
  } catch (err) {
    console.error(`[ERROR] Failed to sync ${jsonPath}:`, err.message);
    process.exit(1);
  }
}

syncTwin();
