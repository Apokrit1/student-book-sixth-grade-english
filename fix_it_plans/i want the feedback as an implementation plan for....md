This **Agent Implementation Plan** is structured so you can hand it directly to the coding agent maintaining your repository. It groups all pedagogical, SLA, and technical fixes by file, function name, and acceptance criteria.

# **Implementation Plan: Pedagogical & Architectural Upgrades**

**Target Repository**: English 6th Grade — Digital Coursebook Platform (*Αγγλικά ΣΤ΄ Δημοτικού*)  
**Primary Files Affected**: unit1/app\_v2.js, unit1/app.js, unit1/v2.html, portal.js, portal.css, portal.html, \_validate.mjs

**Architectural Constraint**: Maintain 100% offline (file:///) compatibility, zero external network requests, and dual-format data twin parity (.json \+ .js).

## **Phase 1: Pedagogical & SLA Enhancements**

### **Task 1.1: Enforce Strict Part-of-Speech (POS) Distractor Matching**

* **Pedagogical Rationale**: APP\_SPECIFICATION.md (§4.4 & §8.2) requires quiz distractors to match the target word's Part of Speech so learners cannot eliminate wrong options using grammatical cues. Currently, unit1/app.js and unit1/app\_v2.js select distractors purely at random from vocabList.  
* **Target Files & Functions**:  
  * unit1/app.js → loadQuizQuestion() and loadDefQuizQuestion()

  * unit1/app\_v2.js → loadNextChallengeQuestion()

* **Implementation Instructions**:  
  1. Create a reusable helper getCalibratedDistractors(target, list, count \= 3\) in both unit1/app.js and unit1/app\_v2.js.  
  2. Filter list first for items where v.id \!== target.id && v.pos \=== target.pos.  
  3. Shuffle the same-POS pool and pick up to count items. If fewer than count items share the exact POS, fill the remaining slots from the rest of list (excluding target.id and already chosen distractors).

JavaScript  
function getCalibratedDistractors(target, list, count \= 3) {  
  const samePosPool \= list  
    .filter(v \=\> v.id \!== target.id && v.pos \=== target.pos)  
    .sort(() \=\> Math.random() \- 0.5);  
  const fallbackPool \= list  
    .filter(v \=\> v.id \!== target.id && v.pos \!== target.pos)  
    .sort(() \=\> Math.random() \- 0.5);  
  return \[...samePosPool, ...fallbackPool\].slice(0, count);  
}

### **Task 1.2: Diagnose Greek L1 Word-Order Interference in Workbook Activity B4**

* **Pedagogical Rationale**: In unit1/app\_v2.js (setupB4Events), pupil sentences using Adverbs of Frequency (always, usually, often, sometimes, rarely, never) currently pass validation (is-correct) if the adverb appears anywhere in a 3+ word string. Because Greek permits sentence-initial *Πάντα / Συνήθως / Ποτέ* before the subject, pupils frequently produce L1 transfer errors like *"Always I swim in the sea"* or *"Never I do homework"*, or place the adverb after the main verb (*"I go always to the beach"*).  
* **Target File & Function**: unit1/app\_v2.js → setupB4Events(act)

* **Implementation Instructions**:  
  1. Verify that the pupil used the specific target adverb assigned to that row (act.adverbs\[idx\]), rather than any random adverb.  
  2. Add an L1 word-order check rejecting sentence-initial always, rarely, or never before a subject pronoun (I, you, we, they, he, she, my), and checking that the adverb precedes the main lexical verb (or follows am / is / are).  
  3. Display targeted, formative grammatical feedback in \#status\_b4 when a word-order error is detected.

JavaScript  
// Inside setupB4Events(act) \-\> btnCheck click listener:  
let valid \= 0;  
let wordOrderWarnings \= 0;

inputs.forEach((inp, idx) \=\> {  
  const text \= inp.value.trim();  
  const targetAdv \= (act.adverbs && act.adverbs\[idx\]) ? act.adverbs\[idx\].toLowerCase() : '';  
  const hasTargetAdverb \= new RegExp(\`\\\\b\${targetAdv}\\\\b\`, 'i').test(text);  
  const hasLength \= text.split(/\\s+/).length \>= 3;

  // Detect common Greek L1 transfer: "Always I go..." or "Never I wake up..."  
  const l1InitialError \= /^(always|rarely|never)\\s+(i|you|we|they|he|she|my)\\b/i.test(text);

  if (hasTargetAdverb && hasLength && \!l1InitialError) {  
    inp.className \= 'wb-gap-input is-correct';  
    valid++;  
  } else {  
    inp.className \= 'wb-gap-input is-retry';  
    if (l1InitialError) wordOrderWarnings++;  
  }  
});

if (valid \=== act.adverbs.length) {  
  statusEl.innerHTML \= '\<span style="color: \#276749"\>✅ Excellent\! All 6 sentences use the correct frequency adverb and word order\!\</span\>';  
} else if (wordOrderWarnings \> 0) {  
  statusEl.innerHTML \= \`\<span style="color: \#c05621"\>💡 Word Order Tip: Put "\${act.adverbs.join(' / ')}" AFTER the person and BEFORE the main verb (e.g., "I always go...", not "Always I go...").\</span\>\`;  
} else {  
  statusEl.innerHTML \= \`\<span style="color: \#c53030"\>\${valid} / \${act.adverbs.length} valid. Make sure each sentence uses the given adverb and has at least 3 words.\</span\>\`;  
}

### **Task 1.3: Effort-Scaffolding Gate on "Show Model Answers" in Student Mode**

* **Pedagogical Rationale**: In unit1/app\_v2.js, the "Show Model Answers" and "Reveal Model Text" buttons (\#btn\_a1\_reveal, \#btn\_a2\_reveal, \#btn\_a3\_reveal, \#btn\_b1i\_reveal, \#btn\_b1ii\_reveal, \#btn\_b2\_reveal, \#btn\_b3\_reveal, \#btn\_b4\_reveal, \#btn\_b5\_reveal, \#btn\_c1\_reveal, and .wb-model-toggle-btn) are active before the pupil makes any attempt.  
* **Target File & Function**: unit1/app\_v2.js → setupWorkbookModule()

* **Implementation Instructions**:  
  1. Check if Teacher Mode is active (localStorage.getItem('buddyHub\_teacherMode') \=== 'true').  
  2. If Teacher Mode is **true**, leave all "Show Model Answers" / "Reveal Model Text" buttons enabled immediately for classroom smartboard instruction.  
  3. If Teacher Mode is **false** (Student Mode):  
     * For closed and semi-open activities (a1 through c1), set btnReveal.disabled \= true; and btnReveal.title \= "Try checking your answers first to unlock the model key\!"; on initialization, and unlock btnReveal.disabled \= false; inside the activity's btnCheck click handler.  
     * For open writing activities (c2, c3, d, e), keep \#btn\_model\_\${act.id} disabled until the student types at least 12 words into \#ta\_\${act.id}.

### **Task 1.4: Convert "Audio Sentence Gap-Fill" into a True Cloze Task**

* **Pedagogical Rationale**: In unit1/app\_v2.js (loadNextChallengeQuestion), when challengeMode \=== 'gapfill', the UI asks the pupil to *"select the missing vocabulary word"*, but plays the full example sentence audio containing the spoken answer without showing a gapped sentence.  
* **Target File & Function**: unit1/app\_v2.js → loadNextChallengeQuestion()

* **Implementation Instructions**:  
  1. When challengeMode \=== 'gapfill', mask the target word in target.example with \_\_\_\_\_\_\_\_\_\_ (using a case-insensitive regex matching the headword stem).  
  2. Display the gapped written sentence inside instructionEl so the student can solve the contextual cloze, and use the audio button (chPlayBtn) to hear the full sentence as auditory confirmation/scaffolding.

JavaScript  
} else if (challengeMode \=== 'gapfill') {  
  const stem \= target.word.split(' ')\[0\].replace(/\[^a-zA-Z\]/g, '');  
  const gappedSentence \= target.example.replace(new RegExp(\`\\\\b\${stem}\[a-z\]\*\\\\b\`, 'gi'), '\_\_\_\_\_\_\_\_\_\_');  
  instructionEl.innerHTML \= \`Complete the sentence with the missing word:\<br\>\<strong style="font-size: 1.1rem; color: \#1a202c;"\>"\${gappedSentence}"\</strong\>\`;  
  clueEl.textContent \= 'Mode: Contextual Cloze & Audio Check';  
  // ... render options as existing ...  
}

### **Task 1.5: Add Inductive "Stative Verbs Alert" Card in Grammar Lab**

* **Pedagogical Rationale**: Greek uses a single present tense (*Ενεστώτας*), causing 6th-grade learners to over-apply \-ing to stative verbs in Workbook Activities B2 (Restaurant Dialogue) and B3.  
* **Target File**: unit1/v2.html (inside \#panel-grammar) and unit1/style\_v2.css

* **Implementation Instructions**:  
  * Add a compact **Stative Verbs Spotlight** callout box inside \#panel-grammar right below the Mr. Badluck / Frequency section, contrasting dynamic vs. stative verbs:  
    * **Feelings & Likes**: *like, love, hate, want, need, prefer* (*"I **want** some ice cream now"* — NOT *~~I am wanting~~*)  
    * **Thoughts & Knowledge**: *know, understand, believe, remember, think (= believe)*  
    * **Senses & Possession**: *hear, see, smell, taste, have (= own), belong*

### **Task 1.6: Replace Meta-Syllabus Quiz Fallbacks in portal.js**

* **Pedagogical Rationale**: In portal.js → buildUnitQuestions(unit, unitData), when fewer than 5 questions are loaded, the fallback generator asks meta-curriculum questions (*"Which grammar tense is prominently practiced in Unit X?"*) rather than testing 6th-grade English.  
* **Target File & Function**: portal.js → buildUnitQuestions(unit, unitData)

* **Implementation Instructions**:  
  * Replace the meta-syllabus fallback questions with a map of authentic CEFR A1+/A2 grammar and lexical multiple-choice items keyed by unit.unit (1–10) aligned with each unit's grammar focus in coursebook\_catalog.js.

## **Phase 2: Technical, Offline (file:///) & UI/UX Fixes**

### **Task 2.1: Fix Offline (file:///) Data Loading in portal.js**

* **Bug**: portal.html only includes \<script src="data/coursebook\_catalog.js"\>\</script\>. When running over file:///, loadUnitData(unitId, callback) checks window\['UNIT1\_V2\_DATA'\] (which is undefined in portal.html), then calls fetch('unit1/data/unit1\_v2\_data.json'). Browsers block fetch() over file:/// due to CORS, forcing the portal into createFallbackUnitData().  
* **Target File & Function**: portal.js → loadUnitData(unitId, callback)

* **Implementation Instructions**:  
  * Dynamically inject a \<script\> tag loading unit$unitId/data/unit${unitId}\_v2\_data.js first so window\[windowKey\] populates cleanly on file:/// without CORS errors:

JavaScript  
function loadUnitData(unitId, callback) {  
  if (STATE.unitDataCache\[unitId\]) {  
    callback(STATE.unitDataCache\[unitId\]);  
    return;  
  }

  const windowKey \= \`UNIT\${unitId}\_V2\_DATA\`;  
  if (window\[windowKey\]) {  
    STATE.unitDataCache\[unitId\] \= window\[windowKey\];  
    callback(window\[windowKey\]);  
    return;  
  }

  // Offline-first: dynamically load the .js data twin via \<script\> tag (works on file:///)  
  const script \= document.createElement('script');  
  script.src \= \`unit\${unitId}/data/unit\${unitId}\_v2\_data.js\`;  
  script.onload \= () \=\> {  
    if (window\[windowKey\]) {  
      STATE.unitDataCache\[unitId\] \= window\[windowKey\];  
      callback(window\[windowKey\]);  
    } else {  
      const fallback \= createFallbackUnitData(unitId);  
      STATE.unitDataCache\[unitId\] \= fallback;  
      callback(fallback);  
    }  
  };  
  script.onerror \= () \=\> {  
    // Fallback to fetch() if hosted on a server without .js twin, else synthetic fallback  
    fetch(\`unit\${unitId}/data/unit\${unitId}\_v2\_data.json\`)  
      .then(res \=\> res.json())  
      .then(data \=\> {  
        STATE.unitDataCache\[unitId\] \= data;  
        callback(data);  
      })  
      .catch(() \=\> {  
        const fallback \= createFallbackUnitData(unitId);  
        STATE.unitDataCache\[unitId\] \= fallback;  
        callback(fallback);  
      });  
  };  
  document.head.appendChild(script);  
}

### **Task 2.2: Fix Sequential Regex HTML Corruption in highlightStoryVocabulary**

* **Bug**: In unit1/app\_v2.js → highlightStoryVocabulary(text), running .replace() inside a vocabList.forEach() loop over mutated HTML strings can match words inside previously injected title="..." attributes or HTML tags, corrupting the DOM. It also uses var(--primary) instead of var(--primary-color).  
* **Target File & Function**: unit1/app\_v2.js → highlightStoryVocabulary(text)

* **Implementation Instructions**:  
  * Replace the sequential loop with a single-pass alternation regex sorted by descending word length (so multi-word items like "citrus fruit" or "water supplies" match before single words) with a negative lookahead (?\!\[^\<\]\*\>):

JavaScript  
function highlightStoryVocabulary(text) {  
  if (\!text || \!vocabList || \!vocabList.length) return text;  
  const lookup \= new Map(vocabList.map(item \=\> \[item.word.toLowerCase(), item\]));  
  const sortedWords \= vocabList  
    .map(item \=\> item.word.replace(/\[.\*+?^\${}()|\[\\\]\\\\\]/g, '\\\\\$&'))  
    .sort((a, b) \=\> b.length \- a.length);

  const masterRegex \= new RegExp(\`\\\\b(\${sortedWords.join('|')})\\\\b(?\!\[^\<\]\*\>)\`, 'gi');  
  return text.replace(masterRegex, (match) \=\> {  
    const item \= lookup.get(match.toLowerCase());  
    if (\!item) return match;  
    return \`\<strong style="color: var(--primary-color); text-decoration: underline dotted;" title="\${item.pos} • \${item.meaning\_gr}"\>\${match}\</strong\>\`;  
  });  
}

### **Task 2.3: Fix Story Audio Path Resolution & AudioContext Singleton in portal.js**

* **Bug 1**: In portal.js → playTrack(unit, story, autoPlay), fallback audio paths resolve to unit1/assets/audio\_v2/stories/story\_ukraine.mp3, whereas the actual files in Unit 1 follow unit1/assets/audio\_v2/stories/ukraine\_full\_story.mp3.  
* **Bug 2**: In portal.js → playTone(freq, duration), a new AudioContext() is instantiated on every quiz click without closing, eventually hitting the browser's hardware context limit.  
* **Target File & Functions**: portal.js → playTrack() and playTone()

* **Implementation Instructions**:  
  1. In playTrack(), resolve audioSrc to unit$unit.unit/assets/audi{o}_{v}2/stories/${story.id}\_full\_story.mp3 when story.audio\_file is not explicitly provided, and prepend unit\${unit.unit}/ if story.audio\_file is relative to the unit folder.  
  2. In playTone(), reuse a single module-scoped sharedAudioCtx instance (calling sharedAudioCtx.resume() if suspended).

### **Task 2.4: Isolate Print Stylesheets for Worksheets vs. Certificates in portal.css & portal.js**

* **Bug**: In portal.css (@media print), both .unit-wrapper-modal and .print-certificate-container have display: block \!important;. Printing a unit worksheet from the modal also prints the Certificate of Achievement on a second page.  
* **Target Files**: portal.css and portal.js

* **Implementation Instructions**:  
  1. In portal.js → printAchievementCertificate(), add document.body.classList.add('printing-certificate'); before calling window.print(), and remove it on afterprint.  
  2. In portal.css (@media print), scope .print-certificate-container so it only displays when body.printing-certificate is active, and hide .unit-wrapper-modal when body.printing-certificate is active:

CSS  
@media print {  
  body:not(.printing-certificate) .print-certificate-container {  
    display: none \!important;  
  }  
  body.printing-certificate .unit-wrapper-modal {  
    display: none \!important;  
  }  
}

### **Task 2.5: Cross-View State Sync, Missing Asset Cleanup & CEFR Label Alignment**

* **Target Files**: unit1/app\_v2.js, portal.html, portal.css

* **Implementation Instructions**:  
  1. **Sync Teacher Mode into Unit View**: In unit1/app\_v2.js → setupTeacherNotes(), check if (localStorage.getItem('buddyHub\_teacherMode') \=== 'true') on initialization and automatically expand \#teacherNotesContent.  
  2. **Persist Can-Do Checkboxes**: In unit1/app\_v2.js → setupCanDoPassport(), save and restore the checked state of \#canDoList input\[type="checkbox"\] in localStorage under buddyHub\_canDo\_unit\${unitNum}.  
  3. **Remove Missing Background Image 404**: In portal.css (.portal-hero-section), remove background-image: url('assets/hero-bg.jpg'); (which does not exist in assets/ and triggers a 404 console error, violating §1.2 of APP\_SPECIFICATION.md).  
  4. **Standardize CEFR Header Badge**: In portal.html, update \<span class="badge-pill"\>A2 / A2+\</span\> and footer references to A1+ / A2 so they match README.md and data/coursebook\_catalog.js.

## **Phase 3: Verification & Quality Gates**

After applying Phases 1 and 2, the agent must run and pass the following checks:

> 1. **Multi-Entry Asset & Link Validation**:  
   * Update \_validate.mjs to validate portal.html (portal.css), unit1/index.html (unit1/style.css), and unit1/v2.html (unit1/style\_v2.css), ensuring MISSING: 0 across all three entry points.

> Bash  
> node \_validate.mjs .  
> node \_validate.mjs unit1

> 2. **Offline & GDPR Compliance Harness**:  
>    Bash  
>    cd unit1 && node verify\_offline.js

   * Must confirm zero external http\:// or https\:// runtime dependencies.  
> 3. **Data Twin Parity Check**:  
   * If any data file in data/ or unit1/data/ is modified, regenerate its .js twin (window.\* \= ...) and verify byte-level JSON equivalence.