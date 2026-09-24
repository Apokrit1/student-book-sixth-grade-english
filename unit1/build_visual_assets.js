const fs = require('fs');
const path = require('path');

const vocabData = JSON.parse(fs.readFileSync('data/vocabulary_data.json', 'utf-8'));

// SVG Art templates with distinct color palettes, icons, and shapes
const visualThemes = {
  "ancient": { bg: ["#fbd38d", "#ed8936"], icon: "🏛️", tag: "Ancient History", detail: "Classic Temple Columns" },
  "border": { bg: ["#bee3f8", "#3182ce"], icon: "🗺️", tag: "Geography", detail: "Frontier Boundary" },
  "brave": { bg: ["#fed7d7", "#e53e3e"], icon: "🦁", tag: "Courage", detail: "Brave Spirit" },
  "citrus fruit": { bg: ["#feebc8", "#dd6b20"], icon: "🍊", tag: "Nature & Food", detail: "Fresh Vitamin C" },
  "coal mines": { bg: ["#e2e8f0", "#4a5568"], icon: "⛏️", tag: "Industry", detail: "Deep Underground" },
  "coast": { bg: ["#b2f5ea", "#319795"], icon: "🏖️", tag: "Seaside", detail: "Ocean Shoreline" },
  "comprise": { bg: ["#e9d8fd", "#805ad5"], icon: "🧩", tag: "Structure", detail: "Made of Parts" },
  "connect": { bg: ["#feebc8", "#d69e2e"], icon: "🔌", tag: "Technology", detail: "Network Link" },
  "copper": { bg: ["#fbd38d", "#b7791f"], icon: "🪙", tag: "Metals", detail: "Conductive Wire" },
  "copy": { bg: ["#c4f1f9", "#00b4d8"], icon: "📋", tag: "Computing", detail: "Duplicate File" },
  "earthquake": { bg: ["#fed7d7", "#c53030"], icon: "🌋", tag: "Disasters", detail: "Ground Shaking" },
  "flow": { bg: ["#bee3f8", "#2b6cb0"], icon: "🌊", tag: "Water Flow", detail: "River Current" },
  "golden fleece": { bg: ["#fefcbf", "#d69e2e"], icon: "🐑", tag: "Mythology", detail: "Jason & Argonauts" },
  "instrument": { bg: ["#e9d8fd", "#6b46c1"], icon: "🔬", tag: "Science Lab", detail: "Lab Microscope" },
  "landmark": { bg: ["#feebc8", "#c05621"], icon: "🗼", tag: "Monuments", detail: "Historic Sight" },
  "landscape": { bg: ["#c6f6d5", "#2f855a"], icon: "🏞️", tag: "Nature", detail: "Scenic Scenery" },
  "mild": { bg: ["#feebc8", "#f6ad55"], icon: "🌤️", tag: "Weather", detail: "Pleasant Climate" },
  "molecule": { bg: ["#b2f5ea", "#234e52"], icon: "🧪", tag: "Chemistry", detail: "Bonded Atoms" },
  "mountain": { bg: ["#e2e8f0", "#2d3748"], icon: "🏔️", tag: "Mountains", detail: "Alpine Peak" },
  "multicultural": { bg: ["#fed7e2", "#d53f8c"], icon: "🌍", tag: "Cultures", detail: "Diverse Class" },
  "natural disaster": { bg: ["#fed7d7", "#9b2c2c"], icon: "🌪️", tag: "Disasters", detail: "Extreme Force" },
  "nuclear power plant": { bg: ["#fefcbf", "#b7791f"], icon: "☢️", tag: "Clean Energy", detail: "Thermal Reactor" },
  "oil well": { bg: ["#cbd5e0", "#2d3748"], icon: "🛢️", tag: "Energy", detail: "Deep Drilling" },
  "outgoing": { bg: ["#feebc8", "#dd6b20"], icon: "😄", tag: "Friendship", detail: "Sociable & Kind" },
  "paste": { bg: ["#e2e8f0", "#4a5568"], icon: "📄", tag: "Computing", detail: "Insert Content" },
  "peninsula": { bg: ["#bee3f8", "#2b6cb0"], icon: "🗾", tag: "Geography", detail: "Surrounded by Sea" },
  "plain": { bg: ["#fefcbf", "#38a169"], icon: "🌾", tag: "Farming", detail: "Flat Grassland" },
  "print": { bg: ["#e2e8f0", "#3182ce"], icon: "🖨️", tag: "Hardware", detail: "Paper Output" },
  "race": { bg: ["#fed7e2", "#b83280"], icon: "🏃", tag: "Humanity", detail: "Speed Contest" },
  "river": { bg: ["#bee3f8", "#0987a0"], icon: "🏞️", tag: "Waterway", detail: "Flowing Stream" },
  "search": { bg: ["#e9d8fd", "#553c9e"], icon: "🔍", tag: "Internet", detail: "Find Knowledge" },
  "split in": { bg: ["#feebc8", "#c53030"], icon: "✂️", tag: "Division", detail: "Two Halves" },
  "temperature": { bg: ["#fed7d7", "#e53e3e"], icon: "🌡️", tag: "Weather", detail: "Degrees Celsius" },
  "underwater": { bg: ["#b2f5ea", "#1d4044"], icon: "🤿", tag: "Marine", detail: "Deep Ocean" },
  "water supplies": { bg: ["#bee3f8", "#2b6cb0"], icon: "💧", tag: "Resources", detail: "Clean Water" }
};

const imgDir = path.join('assets', 'images');
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

vocabData.forEach(item => {
  const padId = String(item.id).padStart(2, '0');
  const safeName = item.word.toLowerCase().replace(/[^a-z0-9]/g, '_');
  const theme = visualThemes[item.word] || { bg: ["#bee3f8", "#3182ce"], icon: item.emoji, tag: item.category, detail: item.word };

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 240" width="320" height="240">
  <defs>
    <linearGradient id="grad_${padId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.bg[0]}" />
      <stop offset="100%" stop-color="${theme.bg[1]}" />
    </linearGradient>
    <filter id="shadow_${padId}" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.15" />
    </filter>
  </defs>
  
  <!-- Card Background -->
  <rect width="320" height="240" rx="16" fill="url(#grad_${padId})" />
  
  <!-- Subtle pattern circle -->
  <circle cx="280" cy="40" r="80" fill="#ffffff" opacity="0.15" />
  <circle cx="40" cy="200" r="60" fill="#ffffff" opacity="0.12" />

  <!-- Inner Badge Container -->
  <rect x="24" y="24" width="272" height="192" rx="12" fill="#ffffff" fill-opacity="0.92" filter="url(#shadow_${padId})" />
  
  <!-- Category Tag -->
  <rect x="36" y="34" width="auto" height="20" rx="10" fill="${theme.bg[1]}" opacity="0.12" />
  <text x="44" y="48" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="700" fill="${theme.bg[1]}" letter-spacing="0.5">${theme.tag.toUpperCase()}</text>

  <!-- Large Visual Icon -->
  <text x="160" y="115" font-size="52" text-anchor="middle" dominant-baseline="middle">${theme.icon}</text>
  
  <!-- Word Label -->
  <text x="160" y="160" font-family="'Outfit', sans-serif" font-size="20" font-weight="800" fill="#1a202c" text-anchor="middle">${item.word}</text>
  
  <!-- Subtitle/Detail -->
  <text x="160" y="184" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="500" fill="#718096" text-anchor="middle">${item.ipa} • ${theme.detail}</text>
</svg>`;

  const svgPath = path.join(imgDir, `${padId}_${safeName}.svg`);
  fs.writeFileSync(svgPath, svgContent, 'utf-8');
});

console.log(`Successfully generated 35 SVG visual illustrations in ${imgDir}`);
