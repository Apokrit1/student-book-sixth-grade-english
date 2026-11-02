import re
from pathlib import Path

path = Path("vocabulary-st-modern/index.html")
text = path.read_text(encoding="utf-8")

# 1. Navigation link labels
text = text.replace(
    '<a href="#explainer">The two things</a>',
    '<a href="#explainer">Curriculum Structure</a>'
)
text = text.replace(
    '<a href="#teacher">For teachers</a>',
    '<a href="#teacher">Pedagogical Notes</a>'
)

# 2. Hero lede
old_hero_lede = """        <p class="hero-lede">
          Every lesson from the official 6th Grade syllabus — illustrated with
          <strong>expressive middle-grade graphic novel scenes</strong> for classroom dialogues &amp; school labs,
          paired with <strong>real open-source photography</strong> for real countries and places. Plus the
          <strong>Companion</strong>: the only place Greek lexical items are practiced.
        </p>"""
new_hero_lede = """        <p class="hero-lede">
          Structured digital coursebook companion for the official 6th Grade curriculum — featuring
          <strong>rich visual scenarios</strong> for classroom dialogues and school computer labs,
          alongside <strong>authentic documentary photography</strong> for geographical units and country studies. Includes the
          <strong>Vocabulary Companion</strong>: a dedicated bilingual reference for lexical acquisition.
        </p>"""
assert old_hero_lede in text, "old_hero_lede not found"
text = text.replace(old_hero_lede, new_hero_lede)

# 3. Hero meta pill
text = text.replace(
    '<span class="meta-pill blush"><strong>Companion</strong> for Greek Vocabulary</span>',
    '<span class="meta-pill blush"><strong>Companion</strong> Vocabulary Reference</span>'
)

# 4. Hero dual strip pill
text = text.replace(
    '<span class="pill-tag">v1 · COURSEBOOK</span>',
    '<span class="pill-tag">COURSEBOOK MODULE</span>'
)
text = text.replace(
    '<span class="pill-tag">v2 · COMPANION</span>',
    '<span class="pill-tag">VOCABULARY COMPANION</span>'
)
text = text.replace(
    '<strong>Greek Lexical Bridge (Λεξιλόγιο)</strong>',
    '<strong>Bilingual Lexical Reference (Λεξιλόγιο)</strong>'
)

# 5. Two-track visual system age badge
text = text.replace(
    '<span class="vs-age-badge">Target: 10–12 yrs · No Toddler Tropes</span>',
    '<span class="vs-age-badge">Target: Upper Primary (Ages 10–12)</span>'
)

# 6. Explainer section header
old_explainer_header = """  <!-- ============================ THE TWO THINGS ============================ -->
  <section class="explainer" id="explainer">
    <div class="section-inner narrow">
      <header class="section-head centered">
        <div class="kicker centered">
          <svg class="kicker-mark"><use href="#book-open"/></svg>
          <span>The two things</span>
        </div>
        <h2 class="section-title">
          One coursebook. <em>One vocabulary Companion.</em><br>
          Greek belongs in only one of them.
        </h2>
      </header>"""
new_explainer_header = """  <!-- ============================ CURRICULUM STRUCTURE ============================ -->
  <section class="explainer" id="explainer">
    <div class="section-inner narrow">
      <header class="section-head centered">
        <div class="kicker centered">
          <svg class="kicker-mark"><use href="#book-open"/></svg>
          <span>Curriculum Structure</span>
        </div>
        <h2 class="section-title">
          Integrated Coursebook. <em>Bilingual Lexical Companion.</em><br>
          Clear separation of immersive practice and vocabulary reference.
        </h2>
      </header>"""
assert old_explainer_header in text, "old_explainer_header not found"
text = text.replace(old_explainer_header, new_explainer_header)

# 7. Thing card tags and descriptions
text = text.replace(
    '<div class="thing-tag">v2 · the interactive coursebook</div>',
    '<div class="thing-tag">Interactive Coursebook</div>'
)
text = text.replace(
    '<div class="thing-tag clay">v1 · vocabulary companion</div>',
    '<div class="thing-tag clay">Vocabulary Companion</div>'
)

old_companion_desc = """          <p class="thing-desc">
            A vocabulary-only layer attached to each unit. Flashcards, pronunciation, and lexical
            activities. The <em>only</em> place Greek lexical items are allowed and practiced —
            the bridge that maps new English words onto the Greek you already speak.
          </p>"""
new_companion_desc = """          <p class="thing-desc">
            A targeted lexical support module paired with each unit. Provides interactive flashcards, audio pronunciation, and vocabulary
            reinforcement activities — creating a direct bilingual bridge between target English terminology and Greek lexical equivalents.
          </p>"""
assert old_companion_desc in text, "old_companion_desc not found"
text = text.replace(old_companion_desc, new_companion_desc)

text = text.replace(
    '<li><svg class="bullet clay"><use href="#check"/></svg> The only place Greek appears</li>',
    '<li><svg class="bullet clay"><use href="#check"/></svg> Structured bilingual lexical reference</li>'
)

old_two_things_foot = """      <p class="two-things-foot">
        Two tools. One syllabus. <em>Greek belongs in the Companion.</em>
      </p>"""
new_two_things_foot = """      <p class="two-things-foot">
        Complementary tools. One syllabus. <em>English immersion in the coursebook; structured bilingual reference in the Companion.</em>
      </p>"""
assert old_two_things_foot in text, "old_two_things_foot not found"
text = text.replace(old_two_things_foot, new_two_things_foot)

# 8. Section lede in units
old_units_lede = """        <p class="section-lede">
          Each unit card shows the <strong>Coursebook lesson</strong> on the left and the
          <strong>Companion vocabulary</strong> on the right — with real Greek translations
          in the right place. Filter by term or jump straight into a unit.
        </p>"""
new_units_lede = """        <p class="section-lede">
          Each unit card pairs the <strong>Coursebook lesson</strong> on the left with its corresponding
          <strong>Vocabulary Companion</strong> on the right, providing clear Greek definitions and audio pronunciation. Filter by term or jump straight into a unit.
        </p>"""
assert old_units_lede in text, "old_units_lede not found"
text = text.replace(old_units_lede, new_units_lede)

# 9. Unit 1 companion tagline
old_u1_tagline = """            <p class="v2-tagline">
              Greek lexical items are allowed here — and only here. The Companion maps each
              new English word onto the Greek you speak.
            </p>"""
new_u1_tagline = """            <p class="v2-tagline">
              Key unit vocabulary paired with Greek definitions and pronunciation support to reinforce comprehension.
            </p>"""
assert old_u1_tagline in text, "old_u1_tagline not found"
text = text.replace(old_u1_tagline, new_u1_tagline)

# 10. Teacher section
old_teacher = """  <!-- ============================ TEACHER ============================ -->
  <section class="teacher-section" id="teacher">
    <div class="section-inner narrow">
      <div class="teacher-card">
        <div class="kicker centered">
          <svg class="kicker-mark"><use href="#asterisk"/></svg>
          <span>For the Teacher · School Lab &amp; Classroom Ready</span>
        </div>
        <h2 class="section-title centered">
          Two scopes, <em>one syllabus.</em><br>
          Built for 11-year-olds, not toddlers.
        </h2>
        <p class="teacher-lede">
          The Coursebook is 100% in English — illustrated in an expressive middle-grade graphic novel style
          for dialogues and school computer labs, with real Wikimedia Commons photography for real countries.
          The Companion is where Greek lexical items live.
        </p>"""
new_teacher = """  <!-- ============================ METHODOLOGY & TEACHER NOTES ============================ -->
  <section class="teacher-section" id="teacher">
    <div class="section-inner narrow">
      <div class="teacher-card">
        <div class="kicker centered">
          <svg class="kicker-mark"><use href="#asterisk"/></svg>
          <span>Curricular Design · Classroom &amp; Lab Ready</span>
        </div>
        <h2 class="section-title centered">
          Pedagogical Scope &amp; Methodology<br>
          <em>Age-Appropriate Design for Grade 6 (Ages 10–12)</em>
        </h2>
        <p class="teacher-lede">
          The Coursebook delivers an immersive English learning experience with high-interest narrative dialogue, communicative tasks,
          and authentic country photography. The accompanying Vocabulary Companion supports lexical acquisition through systematic bilingual reference.
        </p>"""
assert old_teacher in text, "old_teacher not found"
text = text.replace(old_teacher, new_teacher)

old_teacher_companion_pillar = """          <div class="teacher-pillar">
            <div class="pillar-mark sage">
              <svg viewBox="0 0 24 24"><use href="#translate"/></svg>
            </div>
            <h4>Companion · vocabulary only</h4>
            <p>Vocabulary flashcards &amp; lexical-pair drills. The one place Greek lexical items are practiced.</p>
          </div>"""
new_teacher_companion_pillar = """          <div class="teacher-pillar">
            <div class="pillar-mark sage">
              <svg viewBox="0 0 24 24"><use href="#translate"/></svg>
            </div>
            <h4>Companion · Lexical Reference</h4>
            <p>Vocabulary flashcards &amp; lexical-pair drills providing clear Greek-English terminology mapping.</p>
          </div>"""
assert old_teacher_companion_pillar in text, "old_teacher_companion_pillar not found"
text = text.replace(old_teacher_companion_pillar, new_teacher_companion_pillar)

# 11. Footer brand and meta
text = text.replace(
    '<div class="footer-brand">Photodentro &amp; Ministry of Education — The Modernized English 6th Grade Coursebook</div>',
    '<div class="footer-brand">Photodentro &amp; Ministry of Education — English 6th Grade Coursebook Digital Companion</div>'
)
text = text.replace(
    '<div class="footer-meta">Created for ΣΤ΄ Δημοτικού · Bio-Warm 2026 &amp; Graphic Novel Edition · Real Country Photos via Wikimedia Commons (CC BY / CC BY-SA)</div>',
    '<div class="footer-meta">Curriculum Companion for Primary School Grade 6 (ΣΤ΄ Δημοτικού) · Authentic Country Photos via Wikimedia Commons (CC BY / CC BY-SA)</div>'
)

path.write_text(text, encoding="utf-8")
print("Refactored vocabulary-st-modern/index.html to a professional educational tone!")

