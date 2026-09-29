# Clue Challenge Specification: "Guess the Word from its Definition"

## Golden Rules
1. **Never build a crossword grid**:
   Coursebook crosswords without verified coordinates/intersections produce broken or non-standard HTML grid geometry. Attempting to build a dynamic crossword canvas or grid is strictly prohibited.
2. **Convert to Definition Guessing**:
   Every crossword or puzzle must be converted into a **"Guess the Word from its Definition"** interactive activity.
3. **Re-use Clues and Answers**:
   - The original crossword clues become the **definitions / prompts**.
   - The crossword answers become the **target words to guess**.
4. **Scope Framing**:
   - Label the activity as **`"[Theme] Terms: Guess the Word from its Definition"`** (e.g. *"Geography Terms"*, *"Shopping Terms"*, *"Mythology Terms"*).
   - Clarify in a subtitle that clue terms extend beyond the core 35-word vocabulary set.
5. **Direction Clues Rule**:
   - Compass directions or relative descriptors must be defined cleanly relative to their opposite (e.g., SOUTH = *"The compass direction opposite of North"*).
6. **Interactive Hooks**:
   - **Reveal Button**: Click to reveal the word (`💡 Reveal Word` ➔ `✨ WORD`).
   - **Score Counter**: Displays live completion progress (`Solved: X / Total`).
   - **Audio Hint**: For any target word that exists in the core vocabulary dataset, provide a `🔊 Hint` button playing its pronunciation.
