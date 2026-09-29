/**
 * fetch_commons_images.js
 * 
 * Reusable build-time tool for Coursebook Unit Extender (Units 1-10).
 * Queries Wikimedia Commons API following the 4-rung query ladder,
 * downloads pre-scaled 768px thumbnails to an external scratch directory,
 * audits licenses (CC0, PD, CC BY, CC BY-SA), and produces 35mm grayscale
 * photocopy simulation files for pedagogical inspection.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const USER_AGENT = 'CoursebookUnitExtender/2.0 (educational coursebook companion bot; contact: teacher@photodentro.gr)';

function parseLicense(licShortName, usageTerms) {
  if (!licShortName) return { accepted: false, reason: 'missing LicenseShortName' };
  const lic = licShortName.trim();
  const ut = (usageTerms || '').trim();

  // Reject GFDL-only
  if (lic.toUpperCase().includes('GFDL') && !lic.toUpperCase().includes('CC') && !lic.toLowerCase().includes('public domain')) {
    return { accepted: false, reason: 'GFDL-only' };
  }
  // Reject unparseable / no restrictions
  if (/no restrictions/i.test(lic) || /unknown/i.test(lic)) {
    return { accepted: false, reason: `unparseable licence: ${lic}` };
  }

  // Accept CC0
  if (/^CC0(\s+[0-9.]+)?$/i.test(lic) || lic.toUpperCase() === 'CC0') {
    return { accepted: true, type: 'CC0', cleanName: lic };
  }
  // Accept Public Domain
  if (/^(Public domain|PD-.*|PDM)$/i.test(lic) || lic.toLowerCase() === 'public domain') {
    return { accepted: true, type: 'Public domain', cleanName: lic };
  }
  // Accept CC BY <version>
  if (/^CC\s+BY(\s+[0-9.]+)?$/i.test(lic)) {
    return { accepted: true, type: 'CC BY', cleanName: lic };
  }
  // Accept CC BY-SA <version>
  if (/^CC\s+BY-SA(\s+[0-9.]+)?$/i.test(lic)) {
    return { accepted: true, type: 'CC BY-SA', cleanName: lic };
  }

  return { accepted: false, reason: `unsupported licence: ${lic}` };
}

async function queryCommons(queryStr, limit = 8) {
  const url = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2'
    + '&generator=search&gsrsearch=' + encodeURIComponent(queryStr)
    + '&gsrnamespace=6&gsrlimit=' + limit
    + '&prop=imageinfo&iiprop=url|extmetadata|size|mime&iiurlwidth=768'
    + '&iiextmetadatafilter=Artist|LicenseShortName|LicenseUrl|UsageTerms|Credit|Attribution|ObjectName|ImageDescription';

  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  const data = await res.json();
  return data.query?.pages || [];
}

async function fetchCandidateImages(itemConfig, scratchDir) {
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  const { id, slug, name, rungs, anchorRule } = itemConfig;
  console.log(`\n============================================================`);
  console.log(`PROCESSING [${id}] ${name.toUpperCase()} (Anchor Rule: ${anchorRule ? 'YES - ' + anchorRule : 'NO'})`);

  let chosenRung = null;
  let candidatePages = [];

  for (let r = 0; r < rungs.length; r++) {
    const rungQuery = rungs[r];
    const rungIndex = r + 1;
    console.log(`\n--- Rung ${rungIndex}: "${rungQuery}" ---`);
    try {
      const pages = await queryCommons(rungQuery, 8);
      console.log(`    Returned: ${pages.length} candidate(s)`);
      if (pages.length > 0) {
        // Inspect licenses
        const accepted = pages.filter(p => {
          const info = p.imageinfo?.[0] || {};
          const meta = info.extmetadata || {};
          const lic = meta.LicenseShortName?.value;
          const ut = meta.UsageTerms?.value;
          return parseLicense(lic, ut).accepted;
        });
        console.log(`    Accepted licenses on Rung ${rungIndex}: ${accepted.length} / ${pages.length}`);
        if (accepted.length > 0) {
          chosenRung = rungIndex;
          candidatePages = pages;
          break; // Stop at first rung that yields acceptable pictures
        }
      }
    } catch (err) {
      console.error(`    Error on Rung ${rungIndex}:`, err.message);
    }
    // Polite delay
    await new Promise(res => setTimeout(res, 350));
  }

  if (candidatePages.length === 0) {
    console.log(`=> No acceptable candidates across all rungs for [${id}] ${name}`);
    return { itemConfig, chosenRung: null, candidates: [] };
  }

  // Process & download candidates for this rung
  const processed = [];
  for (let i = 0; i < candidatePages.length; i++) {
    const p = candidatePages[i];
    const info = p.imageinfo?.[0] || {};
    const meta = info.extmetadata || {};
    const lic = meta.LicenseShortName?.value || null;
    const ut = meta.UsageTerms?.value || null;
    const licCheck = parseLicense(lic, ut);

    const safeTitle = p.title.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 35);
    const prefix = `${id}_rung${chosenRung}_c${i + 1}_${safeTitle}`;
    const origPath = path.join(scratchDir, `${prefix}_thumb.jpg`);
    const webpPath = path.join(scratchDir, `${prefix}.webp`);
    const grayPath = path.join(scratchDir, `${prefix}_gray.png`);
    const gray35mmPath = path.join(scratchDir, `${prefix}_gray_35mm.png`);

    let webpSize = 0;
    if (info.thumburl) {
      try {
        const imgRes = await fetch(info.thumburl, { headers: { 'User-Agent': USER_AGENT } });
        if (imgRes.ok) {
          const buf = Buffer.from(await imgRes.arrayBuffer());
          fs.writeFileSync(origPath, buf);

          // Convert to webp max 768px, target < 90KB
          execSync(`ffmpeg -y -i "${origPath}" -vf "scale='min(768,iw)':-2" -c:v libwebp -quality 78 "${webpPath}"`, { stdio: 'pipe' });
          webpSize = fs.statSync(webpPath).size;

          // Grayscale full
          execSync(`ffmpeg -y -i "${webpPath}" -vf "format=gray" "${grayPath}"`, { stdio: 'pipe' });

          // 35mm print preview (~132px width at 96dpi)
          execSync(`ffmpeg -y -i "${grayPath}" -vf "scale=132:-2" "${gray35mmPath}"`, { stdio: 'pipe' });
        }
      } catch (err) {
        console.error(`    Error downloading thumb for ${p.title}:`, err.message);
      }
    }

    processed.push({
      index: i + 1,
      title: p.title,
      width: info.width,
      height: info.height,
      thumburl: info.thumburl,
      license: lic,
      licenseUrl: meta.LicenseUrl?.value || null,
      usageTerms: ut,
      artist: meta.Artist?.value ? meta.Artist.value.replace(/<[^>]+>/g, '').trim() : null,
      objectName: meta.ObjectName?.value ? meta.ObjectName.value.replace(/<[^>]+>/g, '').trim() : null,
      description: meta.ImageDescription?.value ? meta.ImageDescription.value.replace(/<[^>]+>/g, '').trim() : null,
      licCheck,
      webpPath,
      grayPath,
      gray35mmPath,
      webpSizeKb: (webpSize / 1024).toFixed(1)
    });

    await new Promise(res => setTimeout(res, 250));
  }

  return { itemConfig, chosenRung, candidates: processed };
}

module.exports = {
  parseLicense,
  queryCommons,
  fetchCandidateImages
};
