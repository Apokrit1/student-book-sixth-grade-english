/* ===================================================================
   Present Simple & Present Continuous — κουίζ
   Οι 27 προτάσεις του αρχικού αντικειμένου, ξαναγραμμένες σε καθαρό,
   σύγχρονο JavaScript. Καμία εξάρτηση από CreateJS/Animate.
   =================================================================== */
'use strict';

/* -------------------------------------------------------------------
   Τα δεδομένα — αυτούσια από το αρχικό αντικείμενο:
   [ πρόταση | σωστή απάντηση | λάθος απάντηση ]
   ------------------------------------------------------------------- */
const QUESTIONS = [
  ['Mr Brown _____ up very early.',                  'gets',         'is getting'],
  ['Dad always _____ breakfast for us.',             'makes',        'is making'],
  ['Mum _____ every day.',                           'cooks',        'is cooking'],
  ['Every morning I _____ to work at 7.45.',         'go',           'am going'],
  ['My grandparents _____ very slowly.',             'walk',         'are waking'],  // (διατηρείται το αρχικό "are waking")
  ['What _____ now?',                                'are you doing','do you do'],
  ['What kind of music _____ usually listen to?',    'do you',       'are you'],
  ['They _____ school at 2:00 in the afternoon.',    'leave',        'are leaving'],
  ['I _____ in Athens.',                             'live',         'am living'],
  ['Today I _____ to rock music!',                   'am listening', 'listen'],
  ['Look! Here I _____ on the beach.',               'am',           'am being'],
  ['People sometimes _____ their hometown to find work.','leave','are leaving'],
  ["I'm on holiday now. I _____ a great time.",      'am having',    'have'],
  ['The temperature often _____ in winter.',         'drops',        'is dropping'],
  ['It often _____ heavily in winter.',              'rains',        'is raining'],
  ["She's Italian. She _____ from Rome.",            'comes',        'is coming'],
  ['This term, I _____ German for the first time.',  'am studying',  'study'],
  ['Water _____ at a hundred degrees Celsius.',      'boils',        'is boiling'],
  ['It usually _____ heavily in Great Britain.',     'rains',        'is raining'],
  ['She rarely _____ good compositions.',            'writes',       'is writing'],
  ['Every morning I _____ to school.',               'walk',         'am Walking'],
  ['I never _____ to bed early.',                    'go',           'am going'],
  ['Look! The sun _____!',                           'is shining',   'shines'],
  ['Watch out! A car _____.',                        'is coming',    'comes'],
  ['Helen always _____ the dishes after dinner.',    'washes',       'is washing'],
  ['In the afternoons I _____ and then I play football.','study','am studying'],
  ['Run! The teacher _____.',                        'is coming',    'comes'],
];

const PER_BATCH = 5;
const SLOT = '_____';

const progressVal = document.getElementById('progressVal');
const progressBar = document.getElementById('progressBar');
const roundVal = document.getElementById('roundVal');

/* -------------------------------------------------------------------
   DOM αναφορές
   ------------------------------------------------------------------- */
const quizEl    = document.getElementById('quizList');
const scoreVal  = document.getElementById('scoreVal');
const totalVal  = document.getElementById('totalVal');
const correctVal= document.getElementById('correctVal');
const checkBtn  = document.getElementById('checkBtn');
const answersBtn= document.getElementById('answersBtn');
const againBtn  = document.getElementById('againBtn');
const helpBtn   = document.getElementById('helpBtn');
const infoBtn   = document.getElementById('infoBtn');
const helpModal = document.getElementById('helpModal');
const resultMsg = document.getElementById('resultMsg');

/* -------------------------------------------------------------------
   Κατάσταση
   ------------------------------------------------------------------- */
let pool       = [];        // shuffled αντίγραφα των QUESTIONS
let batch      = [];        // τρέχον σετ στην οθόνη (5)
let selections = [];        // ανά ερώτηση: 0 | 'A' | 'B'
let checked    = false;     // πάτησε «Έλεγχο»
let revealed   = false;     // πάτησε «Απαντήσεις»
let score      = 0;         // συνολικές σωστές
let answered   = 0;         // συνολικές απαντημένες
let batchNo    = 0;         // αριθμός γύρου

/* -------------------------------------------------------------------
   Μαγικές σταθερές
   ------------------------------------------------------------------- */
const A_KEY = 'A', B_KEY = 'B';
const OPT_TXT = { A: 'Α', B: 'Β' };

/* -------------------------------------------------------------------
   Βοηθητικές συναρτήσεις
   ------------------------------------------------------------------- */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function buildItem(q) {
  // Αντιστρέφουμε τυχαία τη θέση των απαντήσεων (Α/Β) χωρίς να χαθεί το περιεχόμενο
  const flip = Math.random() < 0.5;
  return {
    text:   q[0],
    optA:   flip ? q[2] : q[1],
    optB:   flip ? q[1] : q[2],
    correctKey: flip ? B_KEY : A_KEY,
    correctVal: q[1],
  };
}

function escapeHTML(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function sentenceHTML(text) {
  const slot = SLOT;
  return text.split(slot).map(function (part, idx) {
    if (idx === 0) return escapeHTML(part);
    return '<span class="q__gap" aria-hidden="true">' + slot + '</span>' + escapeHTML(part);
  }).join('');
}


/* -------------------------------------------------------------------
   Απόδοση
   ------------------------------------------------------------------- */
function render() {
  quizEl.textContent = '';
  batch.forEach(function (item, i) {
    quizEl.appendChild(renderQuestion(item, i));
  });
  updateScore();
}

function renderQuestion(item, i) {
  const num = i + 1;
  const li  = document.createElement('li');
  li.className = 'q';
  li.id  = 'q' + num;

  const numSpan = document.createElement('span');
  numSpan.className = 'q__num';
  numSpan.textContent = num;

  const sentence = document.createElement('p');
  sentence.className = 'q__sentence';
  sentence.id = `sentence${num}`;
  sentence.lang = 'en';
  sentence.innerHTML = sentenceHTML(item.text);

  const feedback = document.createElement('span');
  feedback.className = 'q__fb';
  feedback.id = `feedback${num}`;

  const options = document.createElement('div');
  options.className = 'q__options';
  options.appendChild(optionEl(num, A_KEY, item.optA));
  options.appendChild(optionEl(num, B_KEY, item.optB));

  li.appendChild(numSpan);
  li.appendChild(sentence);
  li.appendChild(feedback);
  li.appendChild(options);
  return li;
}

function optionEl(num, key, value) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'option' + (key === B_KEY ? ' option--b' : '');
  btn.dataset.key = key;
  btn.dataset.num = num;
  btn.setAttribute('aria-label', `Πρόταση ${num}: ${value}`);
  btn.setAttribute('aria-pressed', 'false');
  btn.setAttribute('aria-describedby', `sentence${num} feedback${num}`);

  const balloon = document.createElement('span');
  balloon.className = 'option__balloon';
  balloon.textContent = OPT_TXT[key];

  const label = document.createElement('span');
  label.className = 'option__txt';
  label.textContent = value;

  btn.appendChild(balloon);
  btn.appendChild(label);

  return btn;
}

/* Εφαρμόζει όλες τις οπτικές καταστάσεις μετά από κάθε αλλαγή */
function refreshAllStates() {
  batch.forEach(function (item, i) {
    const num = i + 1;
    const q = quizEl.querySelector('#q' + num);
    if (!q) return;

    const chosen = selections[i];
    q.querySelectorAll('.option').forEach(function (op) {
      const key = op.dataset.key;
      op.classList.toggle('is-selected', chosen === key);
      op.classList.toggle('is-correct', (checked || revealed) && key === item.correctKey);
      op.classList.toggle('is-wrong', checked && chosen === key && key !== item.correctKey);
      op.setAttribute('aria-pressed', String(chosen === key));
      op.disabled = checked || revealed;
    });

    q.classList.remove('is-good', 'is-bad');
    if (checked) {
      if (chosen === item.correctKey) q.classList.add('is-good');
      else if (chosen) q.classList.add('is-bad');
    } else if (revealed) {
      q.classList.add('is-good');
    }
  });
}

function refreshQuestionStates(numKey, chosen) {
  const q = quizEl.querySelector('#q' + numKey);
  if (!q) return;
  q.querySelectorAll('.option').forEach(function (op) {
    op.classList.toggle('is-selected', chosen === op.dataset.key);
    op.setAttribute('aria-pressed', String(chosen === op.dataset.key));
  });
}

/* -------------------------------------------------------------------
   Αλληλεπίδραση
   ------------------------------------------------------------------- */
function select(num, key) {
  if (checked || revealed) return;                  // ο γύρος τελείωσε
  const i = num - 1;
  const item = batch[i];
  if (!item) return;

  selections[i] = selections[i] === key ? 0 : key;  // toggle
  refreshQuestionStates(num, selections[i]);
  updateScore();
  resultMsg.hidden = true;
}

function check() {
  if (checked || revealed) return;
  if (selections.some(selection => !selection)) {
    renderResult(0, false);
    quizEl.children[selections.findIndex(selection => !selection)].querySelector('.option').focus();
    return;
  }
  let okCount = 0;
  let allPicked = true;

  batch.forEach(function (item, i) {
    const sel = selections[i];
    if (!sel) { allPicked = false; return; }

    answered++;
    if (sel === item.correctKey) {
      score++;
      okCount++;
    }
  });

  checked = true;
  refreshAllStates();
  checkBtn.textContent = 'Έλεγχος';
  renderResult(okCount, allPicked);
  updateScore();
  finishRound();
}

function finishRound() {
  checkBtn.hidden = true;
  answersBtn.hidden = true;
  againBtn.hidden = false;
  againBtn.focus();
}

function showAnswers() {
  if (checked || revealed) return;
  revealed = true;
  refreshAllStates();
  resultMsg.hidden = false;
  resultMsg.className = 'result result--info';
  resultMsg.textContent = 'Οι σωστές απαντήσεις είναι πράσινες. Πατήστε «Προσπάθησε ξανά» για ένα νέο σετ ερωτήσεων.';
  finishRound();
}

function tryAgain() {
  revealed = false;
  checked  = false;
  batchNo++;
  batch = nextBatch();
  selections = new Array(batch.length).fill(0);
  render();
  checkBtn.textContent = 'Έλεγχος';
  resultMsg.hidden = true;
  resultMsg.classList.remove('result--info');
  checkBtn.hidden = false;
  answersBtn.hidden = false;
  againBtn.hidden = true;
}

function nextBatch() {
  // Ξαναγεμίζουμε την «πισίνα» όταν αδειάσει
  if (pool.length < PER_BATCH) {
    pool = shuffle(pool.concat(shuffle(QUESTIONS).map(buildItem)));
  }
  return pool.splice(0, PER_BATCH);
}

function renderResult(okCount, allPicked) {
  resultMsg.hidden = false;
  resultMsg.className = 'result';
  if (okCount === batch.length) {
    resultMsg.classList.add('result--good');
    resultMsg.textContent = 'Μπράβο! Απάντησες σωστά και στα ' + okCount + '!';
  } else if (allPicked) {
    resultMsg.classList.add('result--bad');
    resultMsg.textContent = 'Σωστά: ' + okCount + ' από ' + batch.length + '. Πατήστε «Απαντήσεις» για να δεις τις σωστές!';
  } else {
    resultMsg.classList.add('result--hint');
    resultMsg.textContent = 'Διάλεξε μία απάντηση σε κάθε πρόταση, μετά πάτησε «Έλεγχος».';
  }
}

function updateScore() {
  scoreVal.textContent = score;
  totalVal.textContent = answered;
  correctVal.textContent = score;
  const picked = selections.filter(Boolean).length;
  progressVal.textContent = `${picked} από ${batch.length} επιλεγμένες`;
  progressBar.max = batch.length;
  progressBar.value = picked;
  roundVal.textContent = batchNo + 1;
}

/* -------------------------------------------------------------------
   Εκκίνηση
   ------------------------------------------------------------------- */
pool = shuffle(QUESTIONS.map(buildItem));
batch = nextBatch();
selections = new Array(batch.length).fill(0);
render();

quizEl.addEventListener('click', event => {
  const option = event.target.closest('.option');
  if (option && quizEl.contains(option)) select(Number(option.dataset.num), option.dataset.key);
});

checkBtn.addEventListener('click', check);
answersBtn.addEventListener('click', showAnswers);
againBtn.addEventListener('click', tryAgain);

helpBtn.addEventListener('click', function () {
  helpModal.hidden = false;
});
infoBtn.addEventListener('click', function () {
  window.open('credits/index.html', '_blank', 'noopener');
});
helpModal.addEventListener('click', function (e) {
  if (e.target === helpModal || e.target.closest('[data-close]')) {
    helpModal.hidden = true;
  }
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !helpModal.hidden) helpModal.hidden = true;
});
