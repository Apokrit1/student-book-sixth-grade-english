/**
 * Coursebook Unit Extender - PDF Text Extraction Helper
 * Usage: node extract_unit_pdf.js <path-to-st_unitN.pdf> [output-path]
 */

const fs = require('fs');
const path = require('path');

async function extractPdfText() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('Usage: node extract_unit_pdf.js <path-to-pdf> [output-txt]');
    process.exit(1);
  }

  const pdfPath = path.resolve(args[0]);
  if (!fs.existsSync(pdfPath)) {
    console.error(`Error: File not found: ${pdfPath}`);
    process.exit(1);
  }

  const defaultOutput = pdfPath.replace(/\.pdf$/i, '_extracted.txt');
  const outputPath = args[1] ? path.resolve(args[1]) : defaultOutput;

  console.log(`Extracting text from: ${pdfPath}`);

  try {
    let pdfParseModule = null;
    try {
      pdfParseModule = require('pdf-parse');
    } catch (e) {
      const localModulesPath = path.join(process.cwd(), 'node_modules', 'pdf-parse');
      if (fs.existsSync(localModulesPath)) {
        pdfParseModule = require(localModulesPath);
      }
    }

    if (pdfParseModule) {
      const dataBuffer = fs.readFileSync(pdfPath);
      if (typeof pdfParseModule === 'function') {
        const data = await pdfParseModule(dataBuffer);
        fs.writeFileSync(outputPath, data.text, 'utf-8');
        console.log(`[SUCCESS] Extracted ${data.text.length} characters to: ${outputPath}`);
        console.log(`Pages parsed: ${data.numpages || 'unknown'}`);
        return;
      } else if (pdfParseModule.PDFParse) {
        const parser = new pdfParseModule.PDFParse({ data: dataBuffer });
        const result = await parser.getText();
        const text = result && result.text ? result.text : String(result);
        fs.writeFileSync(outputPath, text, 'utf-8');
        console.log(`[SUCCESS] Extracted ${text.length} characters to: ${outputPath}`);
        return;
      }
    }

    console.warn('[WARN] pdf-parse library not found or unrecognized format.');
  } catch (err) {
    console.error('[ERROR] PDF extraction failed:', err.message || err);
    process.exit(1);
  }
}

extractPdfText();
