import subprocess
import json
from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
JSON_OUT = DATA_DIR / "git_checkpoints.json"
JS_OUT = DATA_DIR / "git_checkpoints.js"

# Curated milestone metadata enriching git tags
MILESTONE_DETAILS = {
    "v1.0-units1-3": {
        "title": "Units 1, 2, and 3 Flagship Companions",
        "category": "Core Curriculum",
        "badge_color": "#3b82f6",
        "highlights": [
            "Complete Unit 1 ('Our Multicultural Class'), Unit 2 ('Going Shopping'), and Unit 3 ('Imaginary Creatures')",
            "Full offline dual-engine vocabulary audio (Google TTS + Edge Neural Sonia)",
            "Dual JSON/JS data twins architecture preventing browser CORS blocks",
            "Interactive Workbook modules and automated test harnesses"
        ]
    },
    "v1.4-unit4": {
        "title": "Unit 4: The History of the Aeroplane",
        "category": "Aviation & History",
        "badge_color": "#2563eb",
        "highlights": [
            "Flagship v2 companion for Unit 4 (Daedalus & Icarus, Wright Brothers, FAA Museum)",
            "Past Simple vs. Past Continuous time linker grammar labs",
            "Scaffolded in-flight dialogue audio recordings and SVG illustrations",
            "Auto-evaluating 14-activity workbook module"
        ]
    },
    "v1.8-units5-8": {
        "title": "Units 5 to 8 Full Curriculum Expansion",
        "category": "Term 2 & 3 Units",
        "badge_color": "#8b5cf6",
        "highlights": [
            "Unit 5 ('Travelling Through Time'), Unit 6 ('Me, Myself and My Future Job')",
            "Unit 7 ('Share Your Experiences'), Unit 8 ('Blow Your Own Trumpet')",
            "Inductive grammar labs for 'used to', modal verbs, and Present Perfect",
            "Full pedagogical review and CEFR progression across Units 1–8"
        ]
    },
    "v2.0-all-10-units": {
        "title": "Complete 10-Unit Digital Coursebook Curriculum",
        "category": "Curriculum Milestone",
        "badge_color": "#10b981",
        "highlights": [
            "Units 9 ('Earth Day Everyday') and Unit 10 ('Time for Fun') completed",
            "Full 10-unit coursebook catalog and master search metadata",
            "Calibrated 10-unit vocabulary distractors catalog (~357 KB)",
            "Kinetic launch presentation video pipeline"
        ]
    },
    "v2.0-clil-portal": {
        "title": "Master Interactive CLIL Hub & Unit Wrapper",
        "category": "Platform Architecture",
        "badge_color": "#f59e0b",
        "highlights": [
            "Modern CLIL Dashboard with term filters (Terms 1, 2, 3) and cross-curricular tags",
            "Instant multi-unit lexical search with CEFR level filters",
            "Interactive random quiz challenge engine across all 10 units",
            "Standardized unit_wrapper.html modal viewer for seamless navigation"
        ]
    },
    "v2.0-before-redesign": {
        "title": "Unit 1 Modernized Vocabulary Companion Styles",
        "category": "UI / Design System",
        "badge_color": "#ec4899",
        "highlights": [
            "Bio-Warm 2026 / EdTech design system tokens",
            "Refactored Unit 1 navigation bar with quick quizzes links",
            "Tactile mode switcher tab rail (Table, Cards, Listening, Definition Challenge)",
            "Audio speed controls (0.8x, 1.0x, 1.2x) and Sonia Neural voice selection"
        ]
    },
    "v2.0-consensus-review": {
        "title": "Consensus Action Plan & Argon Review Bundle",
        "category": "QA & Model Review",
        "badge_color": "#06b6d4",
        "highlights": [
            "Comprehensive synthesis of external QA reports (ChatGPT, Claude, Manus)",
            "Enforced strict 4-rule ELT validation standard and regex word-boundary heuristics",
            "Lightweight review bundle (~1.09 MB) and single-file export (argon_review.txt)",
            "Unit 1 audio sequence playback queue with Web Speech fallback"
        ]
    }
}

def get_git_checkpoints():
    cmd = [
        "git", "for-each-ref",
        "--format=%(refname:short)|*|%(objectname:short)|*|%(*objectname:short)|*|%(creatordate:iso8601)|*|%(*authordate:iso8601)|*|%(subject)|*|%(contents:body)",
        "refs/tags"
    ]
    res = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, check=True)
    lines = res.stdout.strip().split("\n")

    checkpoints = []
    for line in lines:
        if not line.strip():
            continue
        parts = line.split("|*|")
        tag_name = parts[0].strip()
        tag_obj = parts[1].strip()
        commit_hash = parts[2].strip() if len(parts) > 2 and parts[2].strip() else tag_obj
        tag_date_raw = parts[3].strip() if len(parts) > 3 else ""
        commit_date_raw = parts[4].strip() if len(parts) > 4 and parts[4].strip() else tag_date_raw
        subject = parts[5].strip() if len(parts) > 5 else ""
        body = parts[6].strip() if len(parts) > 6 else ""

        # Format date
        display_date = commit_date_raw[:10] if commit_date_raw else tag_date_raw[:10]

        meta = MILESTONE_DETAILS.get(tag_name, {
            "title": subject or tag_name,
            "category": "Git Checkpoint",
            "badge_color": "#6366f1",
            "highlights": [subject] if subject else ["Checkpoint tag"]
        })

        checkpoints.append({
            "tag": tag_name,
            "commit": commit_hash,
            "date": display_date,
            "title": meta["title"],
            "category": meta["category"],
            "badge_color": meta["badge_color"],
            "message": subject,
            "body": body,
            "highlights": meta["highlights"],
            "is_latest": False
        })

    # Sort chronologically by date
    checkpoints.sort(key=lambda x: x["date"])
    if checkpoints:
        checkpoints[-1]["is_latest"] = True

    return checkpoints

def main():
    print(f"Scanning Git repository at {ROOT} for tags...")
    checkpoints = get_git_checkpoints()
    print(f"Found {len(checkpoints)} checkpoints.")

    # Get current git commit and branch
    branch_res = subprocess.run(["git", "rev-parse", "--abbrev-ref", "HEAD"], cwd=ROOT, capture_output=True, text=True)
    head_res = subprocess.run(["git", "rev-parse", "--short", "HEAD"], cwd=ROOT, capture_output=True, text=True)
    current_branch = branch_res.stdout.strip()
    current_head = head_res.stdout.strip()

    data = {
        "repository": "student-book-sixth-grade-english",
        "current_branch": current_branch,
        "current_head": current_head,
        "last_updated": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "total_checkpoints": len(checkpoints),
        "checkpoints": checkpoints
    }

    DATA_DIR.mkdir(parents=True, exist_ok=True)
    JSON_OUT.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Written: {JSON_OUT}")

    js_code = f"// Automatically generated by _tools/update_version_navigator.py\nwindow.GIT_CHECKPOINTS = {json.dumps(data, indent=2, ensure_ascii=False)};\n"
    JS_OUT.write_text(js_code, encoding="utf-8")
    print(f"Written: {JS_OUT}")
    print("Dashboard data updated successfully. Open version_navigator.html in your browser!")

if __name__ == "__main__":
    import sys
    if len(sys.argv) >= 3 and sys.argv[1] == "--create":
        tag_name = sys.argv[2]
        msg = sys.argv[3] if len(sys.argv) > 3 else f"Checkpoint {tag_name}"
        print(f"Creating git tag '{tag_name}' with message: {msg}...")
        try:
            subprocess.run(["git", "tag", "-a", tag_name, "-m", msg], cwd=ROOT, check=True)
            print(f"✓ Tag '{tag_name}' created successfully in git!")
        except Exception as e:
            print(f"Error creating tag: {e}")
    main()

