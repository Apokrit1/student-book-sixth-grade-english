const fs = require('fs');
const path = require('path');
const { EdgeTTS } = require('node-edge-tts');

const v2Data = JSON.parse(fs.readFileSync(path.join('data', 'unit1_v2_data.json'), 'utf-8'));

const VOICE_NAME = 'en-GB-SoniaNeural';

// Target directories
const audioStoriesDir = path.join('assets', 'audio_v2', 'stories');
const audioGrammarDir = path.join('assets', 'audio_v2', 'grammar');
const imagesV2Dir = path.join('assets', 'images_v2');

[audioStoriesDir, audioGrammarDir, imagesV2Dir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function synthesizeFile(text, targetPath, maxRetries = 3) {
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 1000) {
    console.log(`[EXISTS] ${targetPath}`);
    return true;
  }

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const tts = new EdgeTTS({ voice: VOICE_NAME, timeout: 20000 });
      await tts.ttsPromise(text, targetPath);
      await sleep(150);
      if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 1000) {
        console.log(`[GENERATED] ${targetPath} (${fs.statSync(targetPath).size} bytes)`);
        return true;
      }
    } catch (err) {
      console.warn(`[Attempt ${attempt}] Failed ${targetPath}: ${err.message || err}`);
      await sleep(600 * attempt);
    }
  }
  return false;
}

// 1. Generate Contextual SVG Visuals
function generateSvgVisuals() {
  console.log('Generating contextual vector illustrations (SVG)...');

  const svgs = [
    {
      file: 'sasha_ukraine.svg',
      title: "Sasha's Ukraine",
      bg: '#ebf8ff',
      accent: '#3182ce',
      secondary: '#ecc94b',
      icon: '🌻',
      desc: 'Plains, Carpathians & River Dnipro'
    },
    {
      file: 'christina_albania.svg',
      title: "Christina's Albania",
      bg: '#fff5f5',
      accent: '#e53e3e',
      secondary: '#2b6cb0',
      icon: '🦅',
      desc: 'Adriatic Coast & Ancient Illyria'
    },
    {
      file: 'georgi_georgia.svg',
      title: "Georgi's Georgia",
      bg: '#f0fff4',
      accent: '#38a169',
      secondary: '#dd6b20',
      icon: '🍊',
      desc: 'Colchis, Caucasus & Citrus Groves'
    },
    {
      file: 'gwen_uk.svg',
      title: "Gwen's United Kingdom",
      bg: '#faf5ff',
      accent: '#805ad5',
      secondary: '#e53e3e',
      icon: '🏰',
      desc: 'River Thames & Multicultural Class'
    },
    {
      file: 'stem_school_lab.svg',
      title: 'Modern Digital School Lab',
      bg: '#edf2f7',
      accent: '#319795',
      secondary: '#3182ce',
      icon: '💻',
      desc: 'Coding, 3D Printing & Research'
    },
    {
      file: 'mr_badluck.svg',
      title: "Mr. Badluck's Day",
      bg: '#fffaf0',
      accent: '#dd6b20',
      secondary: '#4a5568',
      icon: '☔',
      desc: 'Routines vs. Today Misadventures'
    }
  ];

  svgs.forEach(s => {
    const filePath = path.join(imagesV2Dir, s.file);
    const content = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="100%" height="100%">
  <defs>
    <linearGradient id="grad_${s.file.replace('.svg', '')}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${s.bg}" />
      <stop offset="100%" stop-color="#ffffff" />
    </linearGradient>
  </defs>
  <rect width="400" height="250" rx="16" fill="url(#grad_${s.file.replace('.svg', '')})" stroke="${s.accent}" stroke-width="2" stroke-opacity="0.25"/>
  <circle cx="200" cy="95" r="54" fill="${s.accent}" fill-opacity="0.12" />
  <circle cx="200" cy="95" r="42" fill="${s.accent}" fill-opacity="0.18" />
  <text x="200" y="112" font-size="46" text-anchor="middle" font-family="'Segoe UI Emoji', sans-serif">${s.icon}</text>
  <text x="200" y="176" font-size="18" font-weight="800" fill="#1a202c" text-anchor="middle" font-family="'Outfit', sans-serif">${s.title}</text>
  <text x="200" y="202" font-size="13" font-weight="600" fill="#718096" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif">${s.desc}</text>
  <rect x="140" y="216" width="120" height="4" rx="2" fill="${s.accent}" fill-opacity="0.6"/>
</svg>`;
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`[SVG SAVED] ${filePath}`);
  });
}

// 2. Synthesize Story Audio Narrations
async function generateAudio() {
  console.log('\nSynthesizing neural voice narrations for Newcomer Country Stories...');
  
  for (const story of v2Data.stories) {
    const targetFile = path.join(audioStoriesDir, `${story.id}_full_story.mp3`);
    console.log(`Synthesizing story: ${story.student} (${story.country})...`);
    await synthesizeFile(story.narrative, targetFile);
  }

  console.log('\nSynthesizing Grammar Lab audio prompts...');
  
  // Mr Badluck story prompt
  const badluckText = "Mr. Badluck gets up at seven o'clock every day. But today, his alarm is ringing late at seven forty-five! He usually catches the eight fifteen morning bus, but today the bus drivers are striking, so he is running in the rain!";
  await synthesizeFile(badluckText, path.join(audioGrammarDir, 'mr_badluck_story.mp3'));

  // School Lab prompt
  const schoolLabText = "Today the pupils are in the school computer lab, working on exciting collaborative projects. Maria is searching for information on musical instruments. Markos is printing photos of the Taj Mahal. Sophia is coding a simulation, and Anne is pasting digital diagrams!";
  await synthesizeFile(schoolLabText, path.join(audioGrammarDir, 'school_lab_overview.mp3'));

  console.log('\nAll Version 2 Audio & Visual assets processed successfully!');
}

async function main() {
  generateSvgVisuals();
  await generateAudio();
}

main().catch(err => {
  console.error('Fatal error generating v2 assets:', err);
  process.exit(1);
});
