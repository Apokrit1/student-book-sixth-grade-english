# Pedagogical Redesign Implementation Plan

## Goal

Turn the English 6th Grade Interactive CLIL Hub from a directory of learning features into a dependable, guided learning experience. Students should be able to enter a unit, understand its goal, learn language in context, practice with support, use it for a meaningful task, and see what to do next.

This plan is based on the publicly visible homepage and the route checks from the review. The home page displayed ten units, separate quiz and audio destinations, unit resources, a quiz dashboard, badges, and progress filters. Direct navigation to `/unit/1` returned a 404. `/quiz/1` remained on “Preparing your quiz…” during the check. Lesson content could not be inspected, so existing learning materials, data structures, and implementation choices must be audited before changes are scoped precisely.

## Product and learning principles

- **Learning goal before feature:** explain what learners will be able to do, not only the unit theme or available assets.
- **Context before rule:** introduce language through a comprehensible example, then guide learners to notice the form and meaning.
- **Support before independence:** provide models and hints early; reduce support as learners demonstrate understanding.
- **Practice before scoring:** use low-stakes checks to identify misconceptions and point to a useful next action.
- **Transfer beyond the quiz:** finish each unit with a short communication task that uses the target language for a purpose.
- **Progress as evidence:** show progress through demonstrated skills and completed learning steps, not badges alone.
- **Accessible, age-appropriate interaction:** use plain language, clear controls, readable layouts, and keyboard and touch support.

## Scope and non-goals

### In scope

- Repair and verify unit and quiz navigation/loading.
- Improve homepage information hierarchy and the path into learning.
- Create a repeatable lesson structure, first implemented in Unit 1 and then applied to the other units.
- Add actionable formative feedback and review paths.
- Clarify progress, completion, and next steps.
- Add learner/teacher validation, instrumentation, accessibility checks, and phased rollout.

### Not assumed

- No assumption that the public site’s content, services, data, authentication, or framework are known or editable from this review.
- No assumption that the “Greek Ministry of Education” or curriculum-alignment claim has been independently verified. Keep such claims only if the owner can substantiate them.
- No assumption that “CEFR A2/A2+” labels are validated for every activity. Map objectives and tasks to evidence before presenting them as achievement claims.
- This is a plan, not authorization to edit or publish the site.

## Workstream 0 — Discovery and technical baseline

**Purpose:** establish what exists, identify the cause of the broken routes, and avoid designing against an inaccurate view of the app.

### Tasks

1. Obtain the codebase, deployment workflow, and access to a staging environment from the site owner.
2. Map current routes and entry points, including home, all ten units, all quiz routes, audio lab, resources, dashboard, profile, and teacher mode.
3. Reproduce `/unit/1` and `/quiz/1` behavior on desktop and mobile. Record browser console errors, network failures, loading duration, and direct-link versus in-app navigation behavior.
4. Inspect the route configuration, content source, quiz data, persistent progress model, and any third-party dependencies. Determine whether the quiz loader is waiting on a failed network request, missing content, or an unresolved client state.
5. Inventory all existing unit materials. For each unit, record stated objectives, vocabulary, language forms, listening/reading input, practice, output task, assessment, answer feedback, and accommodations.
6. Confirm intended learner age, English level, classroom/home use, teacher role, device constraints, connectivity assumptions, and curriculum requirements with the owner or teachers.
7. Baseline performance and accessibility: keyboard path, focus order, contrast, zoom/reflow, screen reader semantics, mobile layout, load performance, and errors.

### Deliverables

- Route and dependency map.
- Unit content inventory and gap analysis.
- Reproduction notes and root-cause findings for the 404 and quiz loading stall.
- Baseline accessibility/performance report.
- Confirmed product decisions: progress storage, anonymous versus signed-in learner assumptions, teacher access, and offline/low-bandwidth expectations.

### Exit criteria

- The owner can explain the root cause of both observed route issues, or the issues are reproduced with sufficient logs to assign a fix.
- The team has audited at least one complete unit and knows which existing content can be reused.
- No design relies on unsupported curriculum or achievement claims.

## Workstream 1 — Stabilize routes and loading states (P0)

**Purpose:** learners must be able to reach and complete the learning activity before the experience is redesigned around it.

### Tasks

1. Ensure every unit card points to a real, canonical unit route. Choose one route pattern and use it consistently, such as `/units/1` or `/unit/1`; update links, route definitions, and direct-link handling together.
2. Ensure every quiz link resolves to the intended unit quiz, whether embedded in the unit flow or available as a standalone route.
3. Support refresh, back/forward navigation, and direct URL entry for all learning routes. Configure the hosting fallback if client-side routes require one.
4. Replace indefinite “Preparing…” states with defined loading, success, empty, and error states. An error state should explain what failed in student-friendly language and offer a retry plus a safe return to the unit.
5. Add timeouts and cancellation for requests that could otherwise remain pending. Log technical error details without exposing them to students.
6. Add automated smoke tests for all ten unit routes and quiz routes, including direct navigation and refresh.

### Acceptance criteria

- Each of the ten unit links opens a working unit landing/lesson page from the homepage and by direct URL.
- Each quiz entry either loads the quiz or gives a useful, recoverable error; no indefinite spinner or “Preparing…” state remains.
- Refreshing a unit or quiz route does not produce a 404.
- Browser back and forward return to the expected pages without losing valid progress.
- Route failures are observable in logs or monitoring and can be distinguished from ordinary slow loading.

## Workstream 2 — Redesign the homepage around the learning journey (P1)

**Purpose:** make the next useful learning action obvious, especially for a sixth-grade learner.

### Recommended hierarchy

1. **Primary action:** “Continue learning” if progress exists; otherwise “Start Unit 1” or “Choose a unit.”
2. **Course orientation:** a short explanation of who the course is for and how to use it.
3. **Unit list:** clear unit title, one learner-facing outcome, estimated time if reliable, and a single primary “Start” action.
4. **Secondary materials:** audio, printable sheets, and teacher resources grouped within the relevant unit or placed in a clearly labeled resource area.
5. **Progress:** show current unit and recent demonstrated skills. Keep badges secondary to learning evidence.

### Tasks

- Replace competing calls to action (such as quiz dashboard, audio lab, flagship unit, and multiple per-unit actions) with one clear primary path.
- Add a concise “By the end, you can…” outcome to every unit card. Outcomes should describe observable communication, for example “ask and answer questions about classmates’ interests,” not vague coverage such as “learn culture.”
- Explain “Launch V2” or replace the label with learner language that describes the destination. Remove duplicate or internal-sounding labels.
- Keep unit search and term filters, but ensure their labels and empty states are understandable. Add clear reset behavior and retain accessible focus states.
- Present teacher-only answer keys and lesson notes behind an explicit teacher entry point. Verify that toggling teacher mode does not expose answers in student mode unintentionally.
- Review promotional claims and numerical feature counts for accuracy. Do not imply outcomes from “280+ audios,” “100% printable packs,” badges, or curriculum affiliation unless verified and meaningful to learners.

### Acceptance criteria

- A first-time learner can identify the course purpose and the recommended first action without teacher explanation in a short usability test.
- Every unit card communicates a learning outcome and one primary action.
- No dead-end or ambiguous launch control remains.
- Search, filters, keyboard interaction, and mobile layout remain usable.

## Workstream 3 — Establish a reusable lesson blueprint (P1)

Use one consistent structure for all units. A unit can span multiple short sessions; do not force every phase into one sitting.

### Suggested unit sequence

1. **Mission and goal:** show the real-world task and one or two success criteria in simple English.
2. **Warm-up / prior knowledge:** a low-stakes prompt, image, short poll, or recall question connected to learners’ experience.
3. **Input in context:** a short age-appropriate dialogue, story, listening clip, or reading that makes the target language meaningful. Provide replay, transcript or captions when appropriate.
4. **Notice:** guide learners to identify a useful expression or language pattern in the example before showing a concise explanation.
5. **Supported practice:** start with recognition or matching, then move to constrained production. Give hints and worked examples, and fade them progressively.
6. **Quick understanding check:** ask a small set of varied questions aligned to the stated goal. Use wrong answers to identify likely misconceptions.
7. **Meaningful use:** ask the learner to speak, write, or create something using the target language for an audience or purpose.
8. **Reflection and next step:** prompt a short self-check, show what was demonstrated, and recommend review or continuation.

### Design requirements

- Limit each screen to one main learning decision or task. Use short instructions and chunk longer text.
- Make audio controls explicit: play, replay, pause, transcript/captions, and speed where feasible. Do not make audio-only content necessary for learners who cannot access it.
- Support multiple response modes where a speaking or writing objective would otherwise be impossible to assess with multiple choice alone.
- Distinguish examples from questions. Do not reveal an answer through formatting or misleading affordances.
- Include optional vocabulary support (gloss, example sentence, audio pronunciation) without forcing translation as the only route to meaning.
- Maintain a coherent CLIL relationship: the content topic should support language learning, not distract from it. Confirm factual accuracy of subject-matter content.

### Unit 1 pilot content package

Before implementation, select the actual Unit 1 objective with a teacher/content owner. Create a one-page alignment map with:

- Target outcome and prerequisites.
- Target vocabulary and language forms.
- Context text/audio and source/accuracy review.
- Practice items and the misconception each distractor is intended to diagnose.
- Final communication task and a simple success rubric.
- Accessibility and differentiation notes.

Do not invent Unit 1 language targets from the homepage alone; “Our Multicultural Class” is only the visible theme.

### Acceptance criteria

- A teacher can trace every practice item and final task to a stated learning outcome.
- Each target form is encountered in context before independent practice.
- Learners receive at least one supported attempt and one opportunity to use the target language meaningfully.
- Instructions and success criteria pass comprehension checks with representative sixth-grade learners.

## Workstream 4 — Feedback and assessment redesign (P1)

**Purpose:** make assessment formative: it should help learners improve, not only produce a score.

### Tasks

- Tag each question to a specific outcome and skill (e.g., reading for detail, vocabulary in context, grammatical form, listening comprehension).
- Use a balanced mix of item types appropriate to the objective. Avoid treating repeated multiple-choice questions as evidence of productive speaking or writing ability.
- Provide feedback after an answer: state whether it is correct, explain the reason briefly, and offer a next hint or example when incorrect.
- Make retry behavior explicit. Let learners revise after feedback where pedagogically useful, and distinguish first-attempt evidence from later supported practice.
- For common wrong answers, provide targeted feedback based on the misconception, not generic “try again.”
- End a quiz with a topic-level result: what the learner can do, what needs practice, and a direct link to a relevant lesson step.
- Make quizzes low stakes and avoid punitive timers unless timing is itself a learning objective.
- Use teacher-reviewed answer keys. For open responses, provide exemplars and a simple rubric rather than claiming unsupported automatic scoring.

### Suggested feedback pattern

- **Correct:** “Yes. ‘Does’ is used with he/she/it in this question. Try using it in your own question.”
- **Incorrect:** “Not quite. Check who the question is about. Use the example above, then try again.”

The exact language must match the actual lesson target and be reviewed by an English teacher.

### Acceptance criteria

- Every scored item maps to a learning goal and has an explanation for each distractor or a useful general explanation.
- An incorrect answer can lead directly to a relevant support step.
- Quiz results separate score from demonstrated skill and do not overclaim mastery from a small item sample.
- Keyboard and screen-reader users can identify questions, options, submitted answers, and feedback updates.

## Workstream 5 — Progress and next-step guidance (P2)

**Purpose:** use progress to encourage persistence and guide review without turning learning into badge collection.

### Define progress states

- **Not started:** no learning activity attempted.
- **In progress:** at least one lesson step completed.
- **Practiced:** required supported practice completed.
- **Demonstrated:** learner met the unit’s stated success criteria in the final task or assessment.
- **Review recommended:** specific evidence indicates further practice is useful.

Completion rules should be transparent and teacher-approved. A badge can celebrate completion, but must not imply durable mastery by itself.

### Tasks

- Show current unit, completed steps, and one recommended next action.
- Show skill-level feedback in plain language, not only a percentage or badge.
- Link review recommendations directly to the relevant concept, example, or practice.
- Allow learners to revisit completed content without losing progress.
- Decide and disclose where progress is stored (local device, account, or classroom system). Do not collect names or other personal data unless required and properly governed.
- Provide sensible empty, reset, shared-device, and returning-learner states.

### Acceptance criteria

- A learner can tell what is complete, what is still in progress, and what to do next.
- A teacher can understand the basis for a “demonstrated” or “review recommended” status.
- Refreshing the app preserves progress according to the documented storage design.
- Progress indicators are not misleading when a student skips, retries, or revisits content.

## Workstream 6 — Accessibility, device fit, and content quality (P1–P2)

### Accessibility checklist

- Use semantic headings, landmarks, form labels, and button/link semantics.
- Ensure every interaction is keyboard operable, with a visible focus indicator and logical focus order.
- Provide text alternatives for meaningful images; treat decorative images as decorative.
- Caption or transcribe audio. Ensure important information is not conveyed by color alone.
- Verify text/background contrast, zoom/reflow, touch-target size, and responsive behavior on small screens.
- Announce dynamic quiz feedback and progress changes to assistive technology without stealing focus.
- Avoid unnecessary time limits, flashing, or motion; respect reduced-motion preferences.
- Test errors and loading states with keyboard and assistive technology, not just the happy path.

### Content quality checklist

- Teacher reviews English accuracy, age suitability, cultural representation, and clarity.
- Examples represent diverse learners respectfully and avoid stereotypes.
- Audio pronunciation, transcripts, and answer keys match the written content.
- Units use consistent terminology and scaffold from familiar contexts to more demanding language use.
- Any curriculum, CEFR, or institutional alignment claim is documented and approved before publication.

## Workstream 7 — Instrumentation and evaluation

Use a small, privacy-conscious event set to answer whether learners can progress and learn. Avoid collecting unnecessary personal data.

### Suggested events

- `unit_opened` (unit identifier, entry source)
- `lesson_step_completed` (unit, step type)
- `practice_answered` (skill tag, correctness, attempt number; avoid storing free-text responses unless necessary)
- `hint_opened`
- `quiz_completed` (skill-level outcome, not just total score)
- `final_task_submitted` (completion metadata; content only if consent and policy allow)
- `next_step_selected`
- `route_or_content_error` (route, error category, request identifier)

### Evaluation questions

- Can learners find and enter the intended unit without adult assistance?
- Where do learners abandon the sequence, and is the cause content difficulty, navigation, or technical failure?
- Do learners use hints and then improve on a subsequent attempt?
- Can learners explain the unit goal and identify their next step?
- Do teachers find the progress evidence useful for deciding what to reteach?

### Guardrails

- Set a baseline before redesign and compare using the same event definitions.
- Do not interpret clicks, time-on-page, streaks, or badge counts as learning outcomes.
- Run moderated usability sessions and teacher/content review alongside analytics.
- Define retention, consent, access control, and deletion rules before collecting learner-level data.

## Delivery phases and gates

### Phase A — Discovery and stabilization

Complete Workstream 0 and the P0 route/loading fixes. Do not begin a broad visual redesign until core destinations work. Gate: all route smoke tests pass in staging.

### Phase B — Co-design and content pilot

Work with at least one English teacher and representative learners to confirm the Unit 1 learning goal, task, and language. Prototype the homepage and lesson flow. Validate language clarity, labels, and task duration. Gate: teacher approval of alignment map and learners can describe the goal and next action.

### Phase C — Build Unit 1 end-to-end

Implement the homepage entry, unit landing page, lesson sequence, formative quiz feedback, meaningful-use task, and progress state for Unit 1. Add analytics and accessibility checks. Gate: functional, content, and accessibility acceptance criteria pass.

### Phase D — Pilot and revise

Pilot with a small class or supervised learner group. Observe first-use behavior and collect teacher feedback. Fix comprehension, route, loading, and feedback problems before scaling. Gate: no critical accessibility or reliability issue; learning sequence is usable; teachers agree evidence is interpretable.

### Phase E — Roll out the remaining units

Apply the blueprint to Units 2–10. Reuse interaction patterns, not generic or copy-pasted content. Each unit requires its own outcome-to-assessment map and content review. Roll out in batches (e.g., by term) so quality checks remain manageable.

### Phase F — Monitor and iterate

Review route error rates, lesson-step completion, quiz feedback paths, learner comprehension, and teacher usefulness. Prioritize fixes that remove barriers or improve learning evidence. Revalidate after substantial content or interaction changes.

## Prioritization

| Priority | Work | Why it comes first | Definition of done |
|---|---|---|---|
| P0 | Fix unit/quiz routes and indefinite loading | Students cannot learn from destinations they cannot reach | Direct routes, refresh, retry, and error behavior pass smoke tests |
| P1 | One clear homepage learning path | Current surface presents many features before a clear instructional sequence | New learner identifies and starts the recommended unit unaided |
| P1 | Unit 1 outcome and lesson blueprint | Establishes an evidence-based pattern before copying to ten units | Teacher-approved alignment map and complete pilot flow |
| P1 | Formative quiz feedback and recovery | Turns wrong answers into learning opportunities | Item-level explanation and targeted retry/review path |
| P1 | Accessibility and mobile testing | Learning tasks must work across learner needs and devices | Critical journeys pass keyboard, screen reader, contrast, and mobile checks |
| P2 | Skill-based progress and next steps | Progress should support decisions, not only reward completion | Transparent state and actionable recommendation validated by learners/teachers |
| P2 | Rollout for Units 2–10 | Scales the validated pattern | Each unit has content map, working route, and quality sign-off |

## Roles and responsibilities

- **Product owner:** confirms learner context, scope, data decisions, and release gates.
- **English teacher / curriculum reviewer:** approves goals, examples, feedback, and assessments.
- **Learning designer:** maps objectives to sequence, practice, assessment, and transfer task.
- **Developer:** route reliability, reusable components, state handling, instrumentation, and responsive implementation.
- **Accessibility reviewer:** validates keyboard, screen reader, visual, and cognitive accessibility.
- **Learner participants:** test comprehension, navigation, and confidence; participation should be age-appropriate and handled with appropriate consent.

One person may fill multiple roles, but content approval and technical implementation should be treated as distinct checks.

## Release checklist

- [ ] Unit and quiz routes work when reached by card, direct URL, refresh, and browser navigation.
- [ ] Loading, empty, error, and retry states are defined and tested.
- [ ] Homepage points to one clear learning action and describes unit outcomes.
- [ ] Unit 1 has a teacher-approved goal-to-assessment map.
- [ ] Context, noticing, supported practice, independent use, and reflection are connected in the learner flow.
- [ ] Quiz feedback explains errors and offers a useful next step.
- [ ] Progress labels have explicit, defensible definitions.
- [ ] Teacher resources and answer keys are not unintentionally exposed to learners.
- [ ] Mobile, keyboard, screen reader, contrast, and reduced-motion checks pass.
- [ ] Curriculum/CEFR/institutional claims are verified or removed.
- [ ] Analytics minimize personal data and have defined retention/access rules.
- [ ] Teachers and learners have tested the revised flow.

## Key risks and mitigations

- **Unknown implementation and content model:** begin with code/content discovery; do not estimate build effort until route causes and content sources are understood.
- **Over-focusing on interface polish:** make the outcome-to-assessment map a required gate for each unit.
- **Copying one template across dissimilar units:** reuse interaction patterns, but require unit-specific content and assessment review.
- **Overclaiming mastery:** use “demonstrated in this activity” rather than claiming broad proficiency from a short quiz.
- **Learner data/privacy exposure:** minimize data, avoid unnecessary identifiers, document storage and retention, and obtain appropriate approvals before instrumenting learner-level activity.
- **Teacher-mode leakage:** test role boundaries and answer-key visibility explicitly.
- **Slow or unreliable service dependencies:** design visible error/retry/fallback states and monitor failure rates.
