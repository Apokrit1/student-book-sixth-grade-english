/**
 * NOTE: Audio generation in this script is disabled.
 * Audio now comes from the generator with --set google:
 *   node ../.agents/skills/coursebook-unit-extender/scripts/generate_unit_audio.js vocab data/vocabulary_data.json --set google
 */

const fs = require('fs');
const path = require('path');
// const googleTTS = require('google-tts-api');

const vocabData = [
  {
    id: 1,
    word: "ancient",
    ipa: "[ˈeɪnʃənt]",
    pos: "(adj)",
    der: "Der: anciently (adv)",
    emoji: "🏛️",
    meaning_gr: "αρχαίος, πανάρχαιος",
    definition_en: "belonging to the distant past and no longer in existence",
    example: "The Parthenon is a famous ancient monument in Athens.",
    category: "History & Culture"
  },
  {
    id: 2,
    word: "border",
    ipa: "[ˈbɔːdə]",
    pos: "(n, v)",
    der: "Der: borderline (n), border (v) = συνορεύω",
    emoji: "🗺️",
    meaning_gr: "σύνορο, μεθόριος / συνορεύω",
    definition_en: "a line separating two countries or regions",
    example: "Greece shares a northern border with Albania, North Macedonia, and Bulgaria.",
    category: "Geography"
  },
  {
    id: 3,
    word: "brave",
    ipa: "[breɪv]",
    pos: "(adj)",
    der: "Der: bravely (adv), bravery (n)",
    emoji: "🦁",
    meaning_gr: "γενναίος, θαρραλέος",
    definition_en: "ready to face danger or pain without showing fear",
    example: "The brave firefighter saved the cat from the burning building.",
    category: "Personality"
  },
  {
    id: 4,
    word: "citrus fruit",
    ipa: "[ˈsɪtrəs fruːt]",
    pos: "(n)",
    der: "Der: citric (adj), citrus (n)",
    emoji: "🍊",
    meaning_gr: "εσπεριδοειδή (πορτοκάλια, λεμόνια κλπ)",
    definition_en: "a fruit with a thick skin and pulpy flesh, such as an orange or lemon",
    example: "Oranges and lemons are juicy citrus fruits rich in vitamin C.",
    category: "Nature & Food"
  },
  {
    id: 5,
    word: "coal mines",
    ipa: "[kəʊl maɪnz]",
    pos: "(n pl)",
    der: "Der: coal miner (n), mining (n)",
    emoji: "⛏️",
    meaning_gr: "ανθρακωρυχεία",
    definition_en: "deep underground places from which coal is dug out",
    example: "My grandfather worked underground in the coal mines for twenty years.",
    category: "Industry & Resources"
  },
  {
    id: 6,
    word: "coast",
    ipa: "[kəʊst]",
    pos: "(n)",
    der: "Der: coastal (adj), coastline (n)",
    emoji: "🏖️",
    meaning_gr: "ακτή, παράκτια ζώνη",
    definition_en: "the land near or next to the sea",
    example: "Odessa is a beautiful port city situated on the coast of the Black Sea.",
    category: "Geography"
  },
  {
    id: 7,
    word: "comprise",
    ipa: "[kəmˈpraɪz]",
    pos: "(v)",
    der: "Der: comprising (prep)",
    emoji: "🧩",
    meaning_gr: "περιλαμβάνω, αποτελούμαι από",
    definition_en: "to consist of or be made up of particular parts",
    example: "The European Union comprises twenty-seven member countries.",
    category: "General"
  },
  {
    id: 8,
    word: "connect",
    ipa: "[kəˈnekt]",
    pos: "(v)",
    der: "Der: connection (n), connected (adj)",
    emoji: "🔌",
    meaning_gr: "συνδέω, ενώνω",
    definition_en: "to join or link two or more things together",
    example: "You need a Wi-Fi cable or router to connect your computer to the internet.",
    category: "Technology"
  },
  {
    id: 9,
    word: "copper",
    ipa: "[ˈkɒpə]",
    pos: "(n)",
    der: "Der: coppery (adj)",
    emoji: "🪙",
    meaning_gr: "χαλκός (μέταλλο)",
    definition_en: "a reddish-brown metal that conducts heat and electricity very well",
    example: "Electric cables are usually made of thin copper wires.",
    category: "Science & Industry"
  },
  {
    id: 10,
    word: "copy",
    ipa: "[ˈkɒpi]",
    pos: "(v, n)",
    der: "Der: copying (n), photocopier (n)",
    emoji: "📋",
    meaning_gr: "αντιγράφω / αντίγραφο",
    definition_en: "to produce something that is an exact duplicate of an original",
    example: "Press Control and C on your keyboard to copy the text into the clipboard.",
    category: "Technology"
  },
  {
    id: 11,
    word: "earthquake",
    ipa: "[ˈɜːθkweɪk]",
    pos: "(n)",
    der: "Der: quake (n/v), aftershock (n)",
    emoji: "🌋",
    meaning_gr: "σεισμός, δόνηση της γης",
    definition_en: "a sudden violent shaking of the ground causing destruction",
    example: "During an earthquake, remember to duck under a sturdy desk.",
    category: "Nature & Disasters"
  },
  {
    id: 12,
    word: "flow",
    ipa: "[fləʊ]",
    pos: "(v, n)",
    der: "Der: flowing (adj), overflow (v/n)",
    emoji: "🌊",
    meaning_gr: "ρέω, κυλώ / ροή",
    definition_en: "to move steadily and continuously in a stream",
    example: "The River Dnipro flows smoothly across the country towards the Black Sea.",
    category: "Geography"
  },
  {
    id: 13,
    word: "golden fleece",
    ipa: "[ˌɡəʊldən ˈfliːs]",
    pos: "(n)",
    der: "Der: fleece (n) = προβιά, μαλλί προβάτου",
    emoji: "🐑",
    meaning_gr: "το χρυσόμαλλο δέρας",
    definition_en: "the magical fleece of a winged ram in Greek mythology",
    example: "Jason and the Argonauts sailed on the ship Argo to capture the golden fleece.",
    category: "History & Culture"
  },
  {
    id: 14,
    word: "instrument",
    ipa: "[ˈɪnstrəmənt]",
    pos: "(n)",
    der: "Der: instrumental (adj)",
    emoji: "🔬",
    meaning_gr: "επιστημονικό όργανο, μουσικό όργανο",
    definition_en: "a tool or device used for precise work or for making music",
    example: "A microscope is a scientific instrument used in the school science lab.",
    category: "Science & Lab"
  },
  {
    id: 15,
    word: "landmark",
    ipa: "[ˈlændmɑːk]",
    pos: "(n)",
    der: "Der: landmarking (n)",
    emoji: "🗼",
    meaning_gr: "αξιοθέατο, ορόσημο",
    definition_en: "an easily recognizable object or building that marks a location",
    example: "The Eiffel Tower is the most recognizable landmark in Paris.",
    category: "Geography & Travel"
  },
  {
    id: 16,
    word: "landscape",
    ipa: "[ˈlændskeɪp]",
    pos: "(n)",
    der: "Der: landscaping (n)",
    emoji: "🏞️",
    meaning_gr: "τοπίο, φυσική θέα",
    definition_en: "all the visible features of an area of countryside or land",
    example: "The green hills and blue lakes create a breathtaking mountain landscape.",
    category: "Geography"
  },
  {
    id: 17,
    word: "mild",
    ipa: "[maɪld]",
    pos: "(adj)",
    der: "Der: mildly (adv), mildness (n)",
    emoji: "🌤️",
    meaning_gr: "ήπιος, γλυκός (για καιρό)",
    definition_en: "moderately warm and pleasant, not cold or severe",
    example: "Mediterranean countries usually enjoy a mild and pleasant winter climate.",
    category: "Weather & Climate"
  },
  {
    id: 18,
    word: "molecule",
    ipa: "[ˈmɒlɪkjuːl]",
    pos: "(n)",
    der: "Der: molecular (adj)",
    emoji: "🧪",
    meaning_gr: "μόριο (στη χημεία/φυσική)",
    definition_en: "a group of atoms bonded together, representing the smallest unit of a compound",
    example: "A water molecule is composed of two hydrogen atoms and one oxygen atom.",
    category: "Science & Lab"
  },
  {
    id: 19,
    word: "mountain",
    ipa: "[ˈmaʊntɪn]",
    pos: "(n)",
    der: "Der: mountainous (adj), mountaineer (n)",
    emoji: "🏔️",
    meaning_gr: "βουνό, όρος",
    definition_en: "a large natural elevation of the earth's surface rising abruptly",
    example: "Mount Olympus is the highest and most majestic mountain in Greece.",
    category: "Geography"
  },
  {
    id: 20,
    word: "multicultural",
    ipa: "[ˌmʌltiˈkʌltʃərəl]",
    pos: "(adj)",
    der: "Der: multiculturalism (n)",
    emoji: "🌍",
    meaning_gr: "πολυπολιτισμικός",
    definition_en: "relating to or containing several cultural or ethnic groups",
    example: "Our multicultural class has pupils from Ukraine, Georgia, Albania, and Greece.",
    category: "Society & People"
  },
  {
    id: 21,
    word: "natural disaster",
    ipa: "[ˈnætʃrəl dɪˈzɑːstə]",
    pos: "(n)",
    der: "Der: disastrous (adj)",
    emoji: "🌪️",
    meaning_gr: "φυσική καταστροφή",
    definition_en: "a major adverse event resulting from natural processes of the Earth",
    example: "Floods, earthquakes, and forest fires are serious types of natural disaster.",
    category: "Nature & Disasters"
  },
  {
    id: 22,
    word: "nuclear power plant",
    ipa: "[ˌnjuːkliə ˈpaʊə plɑːnt]",
    pos: "(n)",
    der: "Der: nuclear energy (n)",
    emoji: "☢️",
    meaning_gr: "πυρηνικός σταθμός παραγωγής ενέργειας",
    definition_en: "a thermal power station in which the heat source is a nuclear reactor",
    example: "The nuclear power plant produces massive amounts of clean electricity.",
    category: "Industry & Resources"
  },
  {
    id: 23,
    word: "oil well",
    ipa: "[ɔɪl wel]",
    pos: "(n)",
    der: "Der: oil rig (n), drilling (n)",
    emoji: "🛢️",
    meaning_gr: "πετρελαιοπηγή, φρέαρ πετρελαίου",
    definition_en: "a hole drilled into the earth for bringing oil to the surface",
    example: "Engineers drilled an oil well deep beneath the seabed to extract petroleum.",
    category: "Industry & Resources"
  },
  {
    id: 24,
    word: "outgoing",
    ipa: "[ˈaʊtɡəʊɪŋ]",
    pos: "(adj)",
    der: "Der: outgoingness (n)",
    emoji: "😄",
    meaning_gr: "εξωστρεφής, κοινωνικός",
    definition_en: "friendly, sociable, and eager to talk to people",
    example: "Nikos is an outgoing boy who quickly makes new friends at school.",
    category: "Personality"
  },
  {
    id: 25,
    word: "paste",
    ipa: "[peɪst]",
    pos: "(v, n)",
    der: "Der: pasting (n), copy-paste (n/v)",
    emoji: "📄",
    meaning_gr: "επικολλούν, κάνω επικόλληση",
    definition_en: "to insert copied text or an image into a document on a computer",
    example: "First copy the picture, and then paste it into your presentation slide.",
    category: "Technology"
  },
  {
    id: 26,
    word: "peninsula",
    ipa: "[pəˈnɪnsjʊlə]",
    pos: "(n)",
    der: "Der: peninsular (adj)",
    emoji: "🗾",
    meaning_gr: "χερσόνησος",
    definition_en: "a piece of land almost surrounded by water or projecting into sea",
    example: "The Peloponnese is a famous peninsula connected to mainland Greece by the Isthmus.",
    category: "Geography"
  },
  {
    id: 27,
    word: "plain",
    ipa: "[pleɪn]",
    pos: "(n)",
    der: "Der: floodplain (n)",
    emoji: "🌾",
    meaning_gr: "πεδιάδα, κάμπος",
    definition_en: "a large area of flat land with few trees",
    example: "Farmers cultivate wheat and corn across the vast green plain of Thessaly.",
    category: "Geography"
  },
  {
    id: 28,
    word: "print",
    ipa: "[prɪnt]",
    pos: "(v, n)",
    der: "Der: printer (n), printout (n)",
    emoji: "🖨️",
    meaning_gr: "εκτυπώνω / εκτύπωση",
    definition_en: "to produce documents on paper using a printing machine",
    example: "Can you please print three copies of the geography project for our team?",
    category: "Technology"
  },
  {
    id: 29,
    word: "race",
    ipa: "[reɪs]",
    pos: "(n)",
    der: "Der: racial (adj), racer (n)",
    emoji: "🏃",
    meaning_gr: "φυλή (ανθρώπινη) / αγώνας ταχύτητας",
    definition_en: "a group of people sharing ethnic heritage, or a running competition",
    example: "People of every race and background live together peacefully in modern cities.",
    category: "Society & People"
  },
  {
    id: 30,
    word: "river",
    ipa: "[ˈrɪvə]",
    pos: "(n)",
    der: "Der: riverbed (n), riverside (n)",
    emoji: "🏞️",
    meaning_gr: "ποταμός, ποτάμι",
    definition_en: "a large natural stream of water flowing in a channel to the sea or a lake",
    example: "The River Thames runs straight through the historic heart of London.",
    category: "Geography"
  },
  {
    id: 31,
    word: "search",
    ipa: "[sɜːtʃ]",
    pos: "(v, n)",
    der: "Der: search engine (n), searcher (n)",
    emoji: "🔍",
    meaning_gr: "αναζητώ, ψάχνω / αναζήτηση",
    definition_en: "to look carefully through a place or online database to find something",
    example: "Pupils use the school tablets to search for information about European geography.",
    category: "Technology"
  },
  {
    id: 32,
    word: "split in",
    ipa: "[splɪt ɪn]",
    pos: "(phr v)",
    der: "Der: splitting (n), split (v/adj)",
    emoji: "✂️",
    meaning_gr: "χωρίζω σε, διασπώ σε μέρη",
    definition_en: "to divide or separate into two or more distinct parts",
    example: "The mighty river flows south, splitting the capital city in two halves.",
    category: "General"
  },
  {
    id: 33,
    word: "temperature",
    ipa: "[ˈtemprətʃə]",
    pos: "(n)",
    der: "Der: thermometer (n), temperate (adj)",
    emoji: "🌡️",
    meaning_gr: "θερμοκρασία",
    definition_en: "the degree of heat or cold measured by a thermometer",
    example: "In summer, the afternoon temperature often reaches thirty-five degrees Celsius.",
    category: "Weather & Climate"
  },
  {
    id: 34,
    word: "underwater",
    ipa: "[ˌʌndəˈwɔːtə]",
    pos: "(adj, adv)",
    der: "Der: underwater camera (n)",
    emoji: "🤿",
    meaning_gr: "υποβρύχιος / κάτω από το νερό",
    definition_en: "situated, occurring, or done beneath the surface of the water",
    example: "Divers discovered an underwater cave filled with colorful sea plants and fish.",
    category: "Nature & Sea"
  },
  {
    id: 35,
    word: "water supplies",
    ipa: "[ˈwɔːtə səˈplaɪz]",
    pos: "(n pl)",
    der: "Der: water supply system (n)",
    emoji: "💧",
    meaning_gr: "αποθέματα νερού, παροχή νερού",
    definition_en: "reservoirs or systems providing fresh drinking water to people",
    example: "Lakes and mountain reservoirs protect the city's clean drinking water supplies.",
    category: "Nature & Resources"
  }
];

// Ensure directories exist
const dirs = [
  'data',
  'assets',
  'assets/audio',
  'assets/audio/words',
  'assets/audio/defs',
  'assets/audio/examples',
  'assets/images'
];
dirs.forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// 1. Write JSON and JS data
fs.writeFileSync(path.join('data', 'vocabulary_data.json'), JSON.stringify(vocabData, null, 2), 'utf-8');
fs.writeFileSync(path.join('data', 'vocabulary_data.js'), `window.VOCABULARY_DATA = ${JSON.stringify(vocabData, null, 2)};`, 'utf-8');

// 2. Write structured text file for external TTS
let ttsText = `================================================================================
UNIT 1: OUR MULTICULTURAL CLASS - VOCABULARY COMPANION & TTS SCRIPT
Grade: 6th Grade (ΣΤ' Δημοτικού) | Level: CEFR A1+
Total Lexical Items: ${vocabData.length}
Format: Word | IPA Pronunciation | Part of Speech | Derivatives | Meaning (Greek) | English Definition | Example
================================================================================\n\n`;

vocabData.forEach((item, index) => {
  ttsText += `--------------------------------------------------------------------------------\n`;
  ttsText += `ITEM ${item.id}: ${item.word.toUpperCase()}\n`;
  ttsText += `Pronunciation: ${item.ipa}  |  Part of Speech: ${item.pos}\n`;
  ttsText += `Derivatives / Collocations: ${item.der}\n`;
  ttsText += `Greek Meaning: ${item.meaning_gr}\n`;
  ttsText += `English Definition: ${item.definition_en}\n`;
  ttsText += `Example Sentence: "${item.example}"\n`;
  ttsText += `[TTS Reading Script]: ${item.word}. Definition: ${item.definition_en}. Example: ${item.example}\n\n`;
});

fs.writeFileSync('vocabulary_unit1_tts.txt', ttsText, 'utf-8');
console.log('Successfully wrote data files and vocabulary_unit1_tts.txt');

// 3. Audio generation section (DISABLED)
// Audio now comes from generate_unit_audio.js with --set google:
// node ../.agents/skills/coursebook-unit-extender/scripts/generate_unit_audio.js vocab data/vocabulary_data.json --set google
console.log('Audio generation in build_data_and_audio.js is disabled (use generate_unit_audio.js --set google).');
