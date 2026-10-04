import json
import os
import random
import re

def get_primary_pos(pos_str):
    match = re.search(r'\(([a-z ]+)', pos_str)
    if match:
        parts = match.group(1).split(',')
        return parts[0].strip().lower()
    return "unknown"

def clean_str(s):
    if not s:
        return ""
    return s.encode('utf-8', 'ignore').decode('utf-8')

def main():
    base_dir = r"c:\photodentro\antigravity\vocabulary st"
    all_words = []
    
    # Process all units 1 through 10
    for unit_idx in range(1, 11):
        json_path = os.path.join(base_dir, f"unit{unit_idx}", "data", "vocabulary_data.json")
        if os.path.exists(json_path):
            with open(json_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for item in data:
                    item['unit'] = unit_idx
                    item['primary_pos'] = get_primary_pos(item.get('pos', ''))
                    item['clean_category'] = (item.get('category') or 'general').strip().lower()
                    all_words.append(item)
                    
    pos_groups = {}
    pos_cat_groups = {}
    for w in all_words:
        pos = w['primary_pos']
        cat = w['clean_category']
        
        if pos not in pos_groups:
            pos_groups[pos] = []
        pos_groups[pos].append(w)
        
        pair_key = (pos, cat)
        if pair_key not in pos_cat_groups:
            pos_cat_groups[pair_key] = []
        pos_cat_groups[pair_key].append(w)
        
    out_word = []
    out_greek = []
    out_def = []
    global_id = 1
    
    # Fix seed for reproducible pedagogical distractor generation
    random.seed(42)

    for w in all_words:
        target_word = w['word']
        pos = w['primary_pos']
        cat = w['clean_category']
        
        # Rule 1 & 2: Prioritize same POS and same semantic category
        same_pos_cat = [cw for cw in pos_cat_groups.get((pos, cat), []) if cw['word'].lower() != target_word.lower()]
        
        # Rule 1: Fallback to same POS across any category
        same_pos_all = [cw for cw in pos_groups.get(pos, []) if cw['word'].lower() != target_word.lower() and cw not in same_pos_cat]
        
        candidates = list(same_pos_cat)
        
        # Multi-unit pooling: If we have fewer than 3, add other words with the same POS
        if len(candidates) < 3:
            needed = 3 - len(candidates)
            if len(same_pos_all) >= needed:
                candidates.extend(random.sample(same_pos_all, needed))
            else:
                candidates.extend(same_pos_all)
                # Absolute fallback only if total words with this POS in entire coursebook < 4
                all_other = [cw for cw in all_words if cw['word'].lower() != target_word.lower() and cw not in candidates]
                if all_other:
                    candidates.extend(random.sample(all_other, min(3 - len(candidates), len(all_other))))
            
        distractors = random.sample(candidates, 3)
        
        # Word distractors
        out_word.append({
            "id": global_id,
            "unit": w.get('unit'),
            "word": target_word,
            "pos": w.get('pos', ''),
            "category": w.get('category', ''),
            "meaning": clean_str(w.get('meaning_gr', '')),
            "distractors": [clean_str(d['word']) for d in distractors]
        })
        
        # Greek distractors
        out_greek.append({
            "id": global_id,
            "unit": w.get('unit'),
            "word": target_word,
            "pos": w.get('pos', ''),
            "category": w.get('category', ''),
            "meaning": clean_str(w.get('meaning_gr', '')),
            "distractors": [clean_str(d.get('meaning_gr', '')) for d in distractors]
        })
        
        # Def distractors
        out_def.append({
            "id": global_id,
            "unit": w.get('unit'),
            "word": target_word,
            "pos": w.get('pos', ''),
            "category": w.get('category', ''),
            "meaning": clean_str(w.get('meaning_gr', '')),
            "target_def": clean_str(w.get('definition_en', '')),
            "distractors": [clean_str(d.get('definition_en', '')) for d in distractors]
        })
        
        global_id += 1
        
    def save_js(filename, data_list):
        path = os.path.join(base_dir, "_tools", filename)
        with open(path, 'w', encoding='utf-8') as f:
            f.write("const data = " + json.dumps(data_list, indent=2, ensure_ascii=False) + ";\n")
            
    save_js("distractor_data.js", out_word) # original
    save_js("distractor_data_greek.js", out_greek)
    save_js("distractor_data_def.js", out_def)
    
    print(f"Generated data for {len(out_word)} items across 3 modes (Units 1-10).")

if __name__ == "__main__":
    main()
