const data = [
  {
    "id": 1,
    "unit": 1,
    "word": "ancient",
    "pos": "(adj)",
    "category": "History & Culture",
    "meaning": "αρχαίος, πανάρχαιος",
    "distractors": [
      "δραστήριος, ενεργητικός",
      "ναυαγός",
      "εξωστρεφής, κοινωνικός"
    ]
  },
  {
    "id": 2,
    "unit": 1,
    "word": "border",
    "pos": "(n, v)",
    "category": "Geography",
    "meaning": "σύνορο, μεθόριος / συνορεύω",
    "distractors": [
      "ποταμός, ποτάμι",
      "ακτή, παράλια",
      "πεδιάδα, κάμπος"
    ]
  },
  {
    "id": 3,
    "unit": 1,
    "word": "brave",
    "pos": "(adj)",
    "category": "Personality",
    "meaning": "γενναίος, θαρραλέος",
    "distractors": [
      "εξωστρεφής, κοινωνικός",
      "χαλαρός, φαρδύς",
      "περιβαλλοντικός"
    ]
  },
  {
    "id": 4,
    "unit": 1,
    "word": "citrus fruit",
    "pos": "(n)",
    "category": "Nature & Food",
    "meaning": "εσπεριδοειδή (πορτοκάλια, λεμόνια κλπ)",
    "distractors": [
      "ξωτικό, πνεύμα",
      "εργαλείο",
      "οικιακή οικονομία"
    ]
  },
  {
    "id": 5,
    "unit": 1,
    "word": "coal mines",
    "pos": "(n pl)",
    "category": "Industry & Resources",
    "meaning": "ανθρακωρυχεία",
    "distractors": [
      "καναπεδάκια",
      "άνθρωποι",
      "ράγες, σιδηροτροχιές"
    ]
  },
  {
    "id": 6,
    "unit": 1,
    "word": "coast",
    "pos": "(n)",
    "category": "Geography",
    "meaning": "ακτή, παράλια",
    "distractors": [
      "ποταμός, ποτάμι",
      "χερσόνησος",
      "βουνό, όρος"
    ]
  },
  {
    "id": 7,
    "unit": 1,
    "word": "comprise",
    "pos": "(v)",
    "category": "General",
    "meaning": "περιλαμβάνω, αποτελούμαι από",
    "distractors": [
      "βουτώ",
      "εφευρίσκω",
      "σχεδιάζω"
    ]
  },
  {
    "id": 8,
    "unit": 1,
    "word": "connect",
    "pos": "(v)",
    "category": "Technology",
    "meaning": "συνδέω, ενώνω",
    "distractors": [
      "αναζητώ, ψάχνω / αναζήτηση",
      "αντιγράφω / αντίγραφο",
      "επικολλούν, κάνω επικόλληση"
    ]
  },
  {
    "id": 9,
    "unit": 1,
    "word": "copper",
    "pos": "(n)",
    "category": "Science & Industry",
    "meaning": "χαλκός (μέταλλο)",
    "distractors": [
      "φτερό (πτηνού ή αεροπλάνου)",
      "εργαλείο",
      "πιλοτήριο, θάλαμος διακυβέρνησης"
    ]
  },
  {
    "id": 10,
    "unit": 1,
    "word": "copy",
    "pos": "(v, n)",
    "category": "Technology",
    "meaning": "αντιγράφω / αντίγραφο",
    "distractors": [
      "αναζητώ, ψάχνω / αναζήτηση",
      "συνδέω, ενώνω",
      "επικολλούν, κάνω επικόλληση"
    ]
  },
  {
    "id": 11,
    "unit": 1,
    "word": "earthquake",
    "pos": "(n)",
    "category": "Nature & Disasters",
    "meaning": "σεισμός, δόνηση της γης",
    "distractors": [
      "μονοξείδιο του άνθρακα",
      "φυσική καταστροφή",
      "αναπνοή, ανάσα"
    ]
  },
  {
    "id": 12,
    "unit": 1,
    "word": "flow",
    "pos": "(v, n)",
    "category": "Geography",
    "meaning": "ρέω, κυλώ / ροή",
    "distractors": [
      "προκαλώ / αιτία, αφορμή",
      "αντιγράφω / αντίγραφο",
      "πνίγομαι (στο νερό)"
    ]
  },
  {
    "id": 13,
    "unit": 1,
    "word": "golden fleece",
    "pos": "(n)",
    "category": "History & Culture",
    "meaning": "το χρυσόμαλλο δέρας",
    "distractors": [
      "κατεύθυνση",
      "πείραμα",
      "πολυκατάστημα"
    ]
  },
  {
    "id": 14,
    "unit": 1,
    "word": "instrument",
    "pos": "(n)",
    "category": "Science & Lab",
    "meaning": "επιστημονικό όργανο, μουσικό όργανο",
    "distractors": [
      "μόριο (στη χημεία/φυσική)",
      "εισπράκτορας",
      "ενήλικας"
    ]
  },
  {
    "id": 15,
    "unit": 1,
    "word": "landmark",
    "pos": "(n)",
    "category": "Geography & Travel",
    "meaning": "αξιοθέατο, ορόσημο",
    "distractors": [
      "υποσύνολο",
      "ποικιλία",
      "εργοστάσιο χημικών"
    ]
  },
  {
    "id": 16,
    "unit": 1,
    "word": "landscape",
    "pos": "(n)",
    "category": "Geography",
    "meaning": "τοπίο, φυσική θέα",
    "distractors": [
      "χερσόνησος",
      "ποταμός, ποτάμι",
      "βουνό, όρος"
    ]
  },
  {
    "id": 17,
    "unit": 1,
    "word": "mild",
    "pos": "(adj)",
    "category": "Weather & Climate",
    "meaning": "ήπιος, γλυκός (για καιρό)",
    "distractors": [
      "πολυτελής",
      "νόστιμος",
      "μοχθηρός, μοχθηρός/άγριος"
    ]
  },
  {
    "id": 18,
    "unit": 1,
    "word": "molecule",
    "pos": "(n)",
    "category": "Science & Lab",
    "meaning": "μόριο (στη χημεία/φυσική)",
    "distractors": [
      "επιστημονικό όργανο, μουσικό όργανο",
      "άκρη, χείλος",
      "ξεναγός, οδηγός"
    ]
  },
  {
    "id": 19,
    "unit": 1,
    "word": "mountain",
    "pos": "(n)",
    "category": "Geography",
    "meaning": "βουνό, όρος",
    "distractors": [
      "ακτή, παράλια",
      "χερσόνησος",
      "πεδιάδα, κάμπος"
    ]
  },
  {
    "id": 20,
    "unit": 1,
    "word": "multicultural",
    "pos": "(adj)",
    "category": "Society & People",
    "meaning": "πολυπολιτισμικός",
    "distractors": [
      "τραχύς / αγριεμένος (για θάλασσα)",
      "παιχνιδιάρικος",
      "πονηρός, πανούργος"
    ]
  },
  {
    "id": 21,
    "unit": 1,
    "word": "natural disaster",
    "pos": "(n)",
    "category": "Nature & Disasters",
    "meaning": "φυσική καταστροφή",
    "distractors": [
      "σχέδιο, σκίτσο",
      "βάρδια εργασίας",
      "σεισμός, δόνηση της γης"
    ]
  },
  {
    "id": 22,
    "unit": 1,
    "word": "nuclear power plant",
    "pos": "(n)",
    "category": "Industry & Resources",
    "meaning": "πυρηνικός σταθμός παραγωγής ενέργειας",
    "distractors": [
      "πουλερικά",
      "δράκος, καλικάντζαρος, ανθρωποφάγος γίγαντας",
      "πετρελαιοπηγή, φρέαρ πετρελαίου"
    ]
  },
  {
    "id": 23,
    "unit": 1,
    "word": "oil well",
    "pos": "(n)",
    "category": "Industry & Resources",
    "meaning": "πετρελαιοπηγή, φρέαρ πετρελαίου",
    "distractors": [
      "πυρηνικός σταθμός παραγωγής ενέργειας",
      "χερσόνησος",
      "εξειδικευμένη γνώση, πείρα"
    ]
  },
  {
    "id": 24,
    "unit": 1,
    "word": "outgoing",
    "pos": "(adj)",
    "category": "Personality",
    "meaning": "εξωστρεφής, κοινωνικός",
    "distractors": [
      "καλά εκπαιδευμένος",
      "χαλαρός, μη σφιχτός",
      "γενναίος, θαρραλέος"
    ]
  },
  {
    "id": 25,
    "unit": 1,
    "word": "paste",
    "pos": "(v, n)",
    "category": "Technology",
    "meaning": "επικολλούν, κάνω επικόλληση",
    "distractors": [
      "εκτυπώνω / εκτύπωση",
      "αναζητώ, ψάχνω / αναζήτηση",
      "συνδέω, ενώνω"
    ]
  },
  {
    "id": 26,
    "unit": 1,
    "word": "peninsula",
    "pos": "(n)",
    "category": "Geography",
    "meaning": "χερσόνησος",
    "distractors": [
      "ποταμός, ποτάμι",
      "σύνορο, μεθόριος / συνορεύω",
      "τοπίο, φυσική θέα"
    ]
  },
  {
    "id": 27,
    "unit": 1,
    "word": "plain",
    "pos": "(n)",
    "category": "Geography",
    "meaning": "πεδιάδα, κάμπος",
    "distractors": [
      "ποταμός, ποτάμι",
      "τοπίο, φυσική θέα",
      "σύνορο, μεθόριος / συνορεύω"
    ]
  },
  {
    "id": 28,
    "unit": 1,
    "word": "print",
    "pos": "(v, n)",
    "category": "Technology",
    "meaning": "εκτυπώνω / εκτύπωση",
    "distractors": [
      "επικολλούν, κάνω επικόλληση",
      "αντιγράφω / αντίγραφο",
      "συνδέω, ενώνω"
    ]
  },
  {
    "id": 29,
    "unit": 1,
    "word": "race",
    "pos": "(n)",
    "category": "Society & People",
    "meaning": "φυλή (ανθρώπινη) / αγώνας ταχύτητας",
    "distractors": [
      "ηθοποιός",
      "σύνορο, μεθόριος / συνορεύω",
      "συρμός του μετρό (υπόγειος)"
    ]
  },
  {
    "id": 30,
    "unit": 1,
    "word": "river",
    "pos": "(n)",
    "category": "Geography",
    "meaning": "ποταμός, ποτάμι",
    "distractors": [
      "χερσόνησος",
      "σύνορο, μεθόριος / συνορεύω",
      "τοπίο, φυσική θέα"
    ]
  },
  {
    "id": 31,
    "unit": 1,
    "word": "search",
    "pos": "(v, n)",
    "category": "Technology",
    "meaning": "αναζητώ, ψάχνω / αναζήτηση",
    "distractors": [
      "αντιγράφω / αντίγραφο",
      "συνδέω, ενώνω",
      "εκτυπώνω / εκτύπωση"
    ]
  },
  {
    "id": 32,
    "unit": 1,
    "word": "split (in two)",
    "pos": "(phr v)",
    "category": "General",
    "meaning": "χωρίζω σε, διασπώ σε μέρη",
    "distractors": [
      "ερωτεύομαι",
      "ξεφορτώνομαι, απαλλάσσομαι από",
      "κάνω φάρσες, ξεγελάω"
    ]
  },
  {
    "id": 33,
    "unit": 1,
    "word": "temperature",
    "pos": "(n)",
    "category": "Weather & Climate",
    "meaning": "θερμοκρασία",
    "distractors": [
      "γεύση",
      "επιβάτης",
      "τραπεζίτης"
    ]
  },
  {
    "id": 34,
    "unit": 1,
    "word": "underwater",
    "pos": "(adj, adv)",
    "category": "Nature & Sea",
    "meaning": "υποβρύχιος / κάτω από το νερό",
    "distractors": [
      "κομψός",
      "κομψός, καλοντυμένος",
      "απαγορευμένος"
    ]
  },
  {
    "id": 35,
    "unit": 1,
    "word": "water supplies",
    "pos": "(n pl)",
    "category": "Nature & Resources",
    "meaning": "αποθέματα νερού, παροχή νερού",
    "distractors": [
      "απειλούμενα είδη",
      "σκουλαρίκια",
      "ψηλοτάκουνα παπούτσια"
    ]
  },
  {
    "id": 36,
    "unit": 2,
    "word": "baggy",
    "pos": "(adj)",
    "category": "Clothes",
    "meaning": "χαλαρός, φαρδύς",
    "distractors": [
      "χαλαρός, μη σφιχτός",
      "περιβαλλοντικός",
      "σφιχτός, στενός"
    ]
  },
  {
    "id": 37,
    "unit": 2,
    "word": "bakery",
    "pos": "(n)",
    "category": "Shops",
    "meaning": "φούρνος, αρτοποιείο",
    "distractors": [
      "διαφημιστικό φυλλάδιο",
      "μενού, κατάλογος φαγητού",
      "πολυκατάστημα"
    ]
  },
  {
    "id": 38,
    "unit": 2,
    "word": "beef",
    "pos": "(n)",
    "category": "Food",
    "meaning": "βόειο κρέας",
    "distractors": [
      "γαλοπούλα",
      "γαλακτοκομικά προϊόντα, γαλακτοπωλείο",
      "γλυκό, επιδόρπιο"
    ]
  },
  {
    "id": 39,
    "unit": 2,
    "word": "budget",
    "pos": "(n)",
    "category": "Shopping",
    "meaning": "προϋπολογισμός",
    "distractors": [
      "ποσότητα",
      "είδος, αντικείμενο",
      "απόδειξη"
    ]
  },
  {
    "id": 40,
    "unit": 2,
    "word": "catwalk",
    "pos": "(n)",
    "category": "Fashion",
    "meaning": "πασαρέλα",
    "distractors": [
      "δεξιότητα",
      "μοντέλο μόδας",
      "το χρυσόμαλλο δέρας"
    ]
  },
  {
    "id": 41,
    "unit": 2,
    "word": "cotton",
    "pos": "(n)",
    "category": "Materials",
    "meaning": "βαμβάκι",
    "distractors": [
      "τζιν, ύφασμα τζιν",
      "μετάξι",
      "δέρμα"
    ]
  },
  {
    "id": 42,
    "unit": 2,
    "word": "cute",
    "pos": "(adj)",
    "category": "Describing",
    "meaning": "χαριτωμένος, γλυκός",
    "distractors": [
      "κομψός",
      "νόστιμος",
      "κομψός, καλοντυμένος"
    ]
  },
  {
    "id": 43,
    "unit": 2,
    "word": "dairy",
    "pos": "(n)",
    "category": "Food",
    "meaning": "γαλακτοκομικά προϊόντα, γαλακτοπωλείο",
    "distractors": [
      "πουλερικά",
      "βόειο κρέας",
      "ζύμη, γλυκό"
    ]
  },
  {
    "id": 44,
    "unit": 2,
    "word": "delicious",
    "pos": "(adj)",
    "category": "Describing",
    "meaning": "νόστιμος",
    "distractors": [
      "κομψός",
      "δελεαστικός, ελκυστικός",
      "κομψός, καλοντυμένος"
    ]
  },
  {
    "id": 45,
    "unit": 2,
    "word": "denim",
    "pos": "(n)",
    "category": "Materials",
    "meaning": "τζιν, ύφασμα τζιν",
    "distractors": [
      "βαμβάκι",
      "μετάξι",
      "δέρμα"
    ]
  },
  {
    "id": 46,
    "unit": 2,
    "word": "department store",
    "pos": "(n)",
    "category": "Shops",
    "meaning": "πολυκατάστημα",
    "distractors": [
      "φούρνος, αρτοποιείο",
      "διαφημιστικό φυλλάδιο",
      "μενού, κατάλογος φαγητού"
    ]
  },
  {
    "id": 47,
    "unit": 2,
    "word": "dessert",
    "pos": "(n)",
    "category": "Food",
    "meaning": "γλυκό, επιδόρπιο",
    "distractors": [
      "κιμάς",
      "βόειο κρέας",
      "κέρασμα, λιχουδιά"
    ]
  },
  {
    "id": 48,
    "unit": 2,
    "word": "elegant",
    "pos": "(adj)",
    "category": "Describing",
    "meaning": "κομψός",
    "distractors": [
      "δελεαστικός, ελκυστικός",
      "νόστιμος",
      "κομψός, καλοντυμένος"
    ]
  },
  {
    "id": 49,
    "unit": 2,
    "word": "fashion model",
    "pos": "(n)",
    "category": "Fashion",
    "meaning": "μοντέλο μόδας",
    "distractors": [
      "φορτηγάκι, κλούβα",
      "πασαρέλα",
      "λινό ύφασμα"
    ]
  },
  {
    "id": 50,
    "unit": 2,
    "word": "flavour",
    "pos": "(n)",
    "category": "Food",
    "meaning": "γεύση",
    "distractors": [
      "βόειο κρέας",
      "κιμάς",
      "πουλερικά"
    ]
  },
  {
    "id": 51,
    "unit": 2,
    "word": "flyer",
    "pos": "(n)",
    "category": "Shops",
    "meaning": "διαφημιστικό φυλλάδιο",
    "distractors": [
      "πολυκατάστημα",
      "φούρνος, αρτοποιείο",
      "μενού, κατάλογος φαγητού"
    ]
  },
  {
    "id": 52,
    "unit": 2,
    "word": "fruit flans",
    "pos": "(n pl)",
    "category": "Food",
    "meaning": "τάρτα φρούτων",
    "distractors": [
      "μάφιν",
      "αρνίσια παϊδάκια",
      "χοιρινές μπριζόλες"
    ]
  },
  {
    "id": 53,
    "unit": 2,
    "word": "item",
    "pos": "(n)",
    "category": "Shopping",
    "meaning": "είδος, αντικείμενο",
    "distractors": [
      "ποσότητα",
      "επιλογή",
      "τιμή μονάδας"
    ]
  },
  {
    "id": 54,
    "unit": 2,
    "word": "lamb ribs",
    "pos": "(n pl)",
    "category": "Food",
    "meaning": "αρνίσια παϊδάκια",
    "distractors": [
      "βιολογικά προϊόντα",
      "μάφιν",
      "τάρτα φρούτων"
    ]
  },
  {
    "id": 55,
    "unit": 2,
    "word": "leather",
    "pos": "(n)",
    "category": "Materials",
    "meaning": "δέρμα",
    "distractors": [
      "βαμβάκι",
      "τζιν, ύφασμα τζιν",
      "μετάξι"
    ]
  },
  {
    "id": 56,
    "unit": 2,
    "word": "loose",
    "pos": "(adj)",
    "category": "Clothes",
    "meaning": "χαλαρός, μη σφιχτός",
    "distractors": [
      "χαριτωμένος, γλυκός",
      "χαλαρός, φαρδύς",
      "σφιχτός, στενός"
    ]
  },
  {
    "id": 57,
    "unit": 2,
    "word": "match",
    "pos": "(v)",
    "category": "Clothes",
    "meaning": "ταιριάζει, συνδυάζεται",
    "distractors": [
      "ταιριάζει",
      "ζητώ, κάνω αίτηση / αίτημα",
      "επιτρέπω"
    ]
  },
  {
    "id": 58,
    "unit": 2,
    "word": "menu",
    "pos": "(n)",
    "category": "Shops",
    "meaning": "μενού, κατάλογος φαγητού",
    "distractors": [
      "πολυκατάστημα",
      "διαφημιστικό φυλλάδιο",
      "φούρνος, αρτοποιείο"
    ]
  },
  {
    "id": 59,
    "unit": 2,
    "word": "mince",
    "pos": "(n)",
    "category": "Food",
    "meaning": "κιμάς",
    "distractors": [
      "κέρασμα, λιχουδιά",
      "βόειο κρέας",
      "γαλακτοκομικά προϊόντα, γαλακτοπωλείο"
    ]
  },
  {
    "id": 60,
    "unit": 2,
    "word": "muffins",
    "pos": "(n pl)",
    "category": "Food",
    "meaning": "μάφιν",
    "distractors": [
      "χοιρινές μπριζόλες",
      "τάρτα φρούτων",
      "αρνίσια παϊδάκια"
    ]
  },
  {
    "id": 61,
    "unit": 2,
    "word": "organic products",
    "pos": "(n pl)",
    "category": "Food",
    "meaning": "βιολογικά προϊόντα",
    "distractors": [
      "μάφιν",
      "αρνίσια παϊδάκια",
      "χοιρινές μπριζόλες"
    ]
  },
  {
    "id": 62,
    "unit": 2,
    "word": "pair of snickers",
    "pos": "(n)",
    "category": "Clothes",
    "meaning": "αθλητικά παπούτσια, σνίκερς",
    "distractors": [
      "πουλόβερ",
      "αθλητική φόρμα",
      "φούστα"
    ]
  },
  {
    "id": 63,
    "unit": 2,
    "word": "pastry",
    "pos": "(n)",
    "category": "Food",
    "meaning": "ζύμη, γλυκό",
    "distractors": [
      "γεύση",
      "γλυκό, επιδόρπιο",
      "γαλακτοκομικά προϊόντα, γαλακτοπωλείο"
    ]
  },
  {
    "id": 64,
    "unit": 2,
    "word": "pork chops",
    "pos": "(n pl)",
    "category": "Food",
    "meaning": "χοιρινές μπριζόλες",
    "distractors": [
      "τάρτα φρούτων",
      "μάφιν",
      "βιολογικά προϊόντα"
    ]
  },
  {
    "id": 65,
    "unit": 2,
    "word": "poultry",
    "pos": "(n)",
    "category": "Food",
    "meaning": "πουλερικά",
    "distractors": [
      "ζύμη, γλυκό",
      "βόειο κρέας",
      "κέρασμα, λιχουδιά"
    ]
  },
  {
    "id": 66,
    "unit": 2,
    "word": "quantity",
    "pos": "(n)",
    "category": "Shopping",
    "meaning": "ποσότητα",
    "distractors": [
      "υποσύνολο",
      "επιλογή",
      "τιμή μονάδας"
    ]
  },
  {
    "id": 67,
    "unit": 2,
    "word": "receipt",
    "pos": "(n)",
    "category": "Shopping",
    "meaning": "απόδειξη",
    "distractors": [
      "τιμή μονάδας",
      "υποσύνολο",
      "είδος, αντικείμενο"
    ]
  },
  {
    "id": 68,
    "unit": 2,
    "word": "selection",
    "pos": "(n)",
    "category": "Shopping",
    "meaning": "επιλογή",
    "distractors": [
      "προϋπολογισμός",
      "υποσύνολο",
      "τιμή μονάδας"
    ]
  },
  {
    "id": 69,
    "unit": 2,
    "word": "silk",
    "pos": "(n)",
    "category": "Materials",
    "meaning": "μετάξι",
    "distractors": [
      "βαμβάκι",
      "δέρμα",
      "τζιν, ύφασμα τζιν"
    ]
  },
  {
    "id": 70,
    "unit": 2,
    "word": "skirt",
    "pos": "(n)",
    "category": "Clothes",
    "meaning": "φούστα",
    "distractors": [
      "αθλητική φόρμα",
      "αθλητικά παπούτσια, σνίκερς",
      "πουλόβερ"
    ]
  },
  {
    "id": 71,
    "unit": 2,
    "word": "smart",
    "pos": "(adj)",
    "category": "Describing",
    "meaning": "κομψός, καλοντυμένος",
    "distractors": [
      "χαριτωμένος, γλυκός",
      "κομψός",
      "δελεαστικός, ελκυστικός"
    ]
  },
  {
    "id": 72,
    "unit": 2,
    "word": "space shuttle",
    "pos": "(n)",
    "category": "Toys",
    "meaning": "διαστημικό σκάφος",
    "distractors": [
      "βουνό, όρος",
      "χρονοδιάγραμμα, πρόγραμμα",
      "ομιλία"
    ]
  },
  {
    "id": 73,
    "unit": 2,
    "word": "subtotal",
    "pos": "(n)",
    "category": "Shopping",
    "meaning": "υποσύνολο",
    "distractors": [
      "σύνολο, συνολικός",
      "επιλογή",
      "τιμή μονάδας"
    ]
  },
  {
    "id": 74,
    "unit": 2,
    "word": "suit",
    "pos": "(v)",
    "category": "Clothes",
    "meaning": "ταιριάζει",
    "distractors": [
      "απαιτώ, χρειάζομαι",
      "ταιριάζει, συνδυάζεται",
      "ιδρώνω"
    ]
  },
  {
    "id": 75,
    "unit": 2,
    "word": "sweater",
    "pos": "(n)",
    "category": "Clothes",
    "meaning": "πουλόβερ",
    "distractors": [
      "αθλητικά παπούτσια, σνίκερς",
      "φούστα",
      "αθλητική φόρμα"
    ]
  },
  {
    "id": 76,
    "unit": 2,
    "word": "tempting",
    "pos": "(adj)",
    "category": "Describing",
    "meaning": "δελεαστικός, ελκυστικός",
    "distractors": [
      "νόστιμος",
      "κομψός",
      "κομψός, καλοντυμένος"
    ]
  },
  {
    "id": 77,
    "unit": 2,
    "word": "tight",
    "pos": "(adj)",
    "category": "Clothes",
    "meaning": "σφιχτός, στενός",
    "distractors": [
      "χαλαρός, μη σφιχτός",
      "χαλαρός, φαρδύς",
      "στραβός, παραμορφωμένος"
    ]
  },
  {
    "id": 78,
    "unit": 2,
    "word": "total",
    "pos": "(n, adj)",
    "category": "Shopping",
    "meaning": "σύνολο, συνολικός",
    "distractors": [
      "απόδειξη",
      "επιλογή",
      "υποσύνολο"
    ]
  },
  {
    "id": 79,
    "unit": 2,
    "word": "track suit",
    "pos": "(n)",
    "category": "Clothes",
    "meaning": "αθλητική φόρμα",
    "distractors": [
      "αθλητικά παπούτσια, σνίκερς",
      "πουλόβερ",
      "φούστα"
    ]
  },
  {
    "id": 80,
    "unit": 2,
    "word": "treat",
    "pos": "(n, v)",
    "category": "Food",
    "meaning": "κέρασμα, λιχουδιά",
    "distractors": [
      "κιμάς",
      "γαλακτοκομικά προϊόντα, γαλακτοπωλείο",
      "γλυκό, επιδόρπιο"
    ]
  },
  {
    "id": 81,
    "unit": 2,
    "word": "turkey",
    "pos": "(n)",
    "category": "Food",
    "meaning": "γαλοπούλα",
    "distractors": [
      "γαλακτοκομικά προϊόντα, γαλακτοπωλείο",
      "κέρασμα, λιχουδιά",
      "γλυκό, επιδόρπιο"
    ]
  },
  {
    "id": 82,
    "unit": 2,
    "word": "unit pice",
    "pos": "(n)",
    "category": "Shopping",
    "meaning": "τιμή μονάδας",
    "distractors": [
      "ποσότητα",
      "είδος, αντικείμενο",
      "απόδειξη"
    ]
  },
  {
    "id": 83,
    "unit": 2,
    "word": "woolen",
    "pos": "(adj)",
    "category": "Materials",
    "meaning": "μάλλινος",
    "distractors": [
      "γενναίος, θαρραλέος",
      "εξαντλημένος (για εισιτήρια)",
      "μικροσκοπικός"
    ]
  },
  {
    "id": 84,
    "unit": 3,
    "word": "active",
    "pos": "(adj)",
    "category": "Character",
    "meaning": "δραστήριος, ενεργητικός",
    "distractors": [
      "πιστός, αφοσιωμένος",
      "κακός, δυσάρεστος",
      "άγριος, τρομερός"
    ]
  },
  {
    "id": 85,
    "unit": 3,
    "word": "anxious",
    "pos": "(adj)",
    "category": "Feelings",
    "meaning": "ανήσυχος, αγχωμένος",
    "distractors": [
      "ευχάριστος, απολαυστικός",
      "βαριεστημένος, που πλήττει",
      "συγκινητικός"
    ]
  },
  {
    "id": 86,
    "unit": 3,
    "word": "argue",
    "pos": "(v)",
    "category": "Actions",
    "meaning": "μαλώνω, διαφωνώ",
    "distractors": [
      "φτύνω, εκτοξεύω",
      "επισκευάζω",
      "διαφεύγω, τρέπομαι σε φυγή"
    ]
  },
  {
    "id": 87,
    "unit": 3,
    "word": "attractive",
    "pos": "(adj)",
    "category": "Appearance",
    "meaning": "ελκυστικός, όμορφος",
    "distractors": [
      "απεριποίητος, ατημέλητος",
      "υπερμεγέθης, πολύ μεγάλος",
      "απεχθής, απαίσιος, φρικτός"
    ]
  },
  {
    "id": 88,
    "unit": 3,
    "word": "cave",
    "pos": "(n)",
    "category": "Places",
    "meaning": "σπηλιά",
    "distractors": [
      "πιλοτήριο, θάλαμος διακυβέρνησης",
      "εργοστάσιο χημικών",
      "ακτή, αιγιαλός"
    ]
  },
  {
    "id": 89,
    "unit": 3,
    "word": "coin",
    "pos": "(n)",
    "category": "Objects",
    "meaning": "νόμισμα, κέρμα",
    "distractors": [
      "βαμβάκι",
      "εργοστάσιο χημικών",
      "πετρελαιοπηγή, φρέαρ πετρελαίου"
    ]
  },
  {
    "id": 90,
    "unit": 3,
    "word": "cosy",
    "pos": "(adj)",
    "category": "Places",
    "meaning": "άνετος, ζεστός",
    "distractors": [
      "πολυτελής",
      "αρχαίος, πανάρχαιος",
      "άγριος"
    ]
  },
  {
    "id": 91,
    "unit": 3,
    "word": "cunning",
    "pos": "(adj)",
    "category": "Character",
    "meaning": "πονηρός, πανούργος",
    "distractors": [
      "μοχθηρός, κακός",
      "άγριος, βάναυσος",
      "ομιλητικός, πολυλογάς"
    ]
  },
  {
    "id": 92,
    "unit": 3,
    "word": "delicate",
    "pos": "(adj)",
    "category": "Appearance",
    "meaning": "ευαίσθητος, λεπτός",
    "distractors": [
      "απεριποίητος, ατημέλητος",
      "μικροσκοπικός",
      "φτερωτός"
    ]
  },
  {
    "id": 93,
    "unit": 3,
    "word": "delightful",
    "pos": "(adj)",
    "category": "Feelings",
    "meaning": "ευχάριστος, απολαυστικός",
    "distractors": [
      "ανήσυχος, αγχωμένος",
      "συγκινητικός",
      "βαριεστημένος, που πλήττει"
    ]
  },
  {
    "id": 94,
    "unit": 3,
    "word": "disgusting",
    "pos": "(adj)",
    "category": "Appearance",
    "meaning": "αηδιαστικός",
    "distractors": [
      "απεριποίητος, ατημέλητος",
      "όμορφος, ευπαρουσίαστος (για άντρα)",
      "φτερωτός"
    ]
  },
  {
    "id": 95,
    "unit": 3,
    "word": "dive",
    "pos": "(v)",
    "category": "Actions",
    "meaning": "βουτώ",
    "distractors": [
      "μαλώνω, διαφωνώ",
      "φτύνω, εκτοξεύω",
      "διαφεύγω, τρέπομαι σε φυγή"
    ]
  },
  {
    "id": 96,
    "unit": 3,
    "word": "dragon",
    "pos": "(n)",
    "category": "Creatures",
    "meaning": "δράκος",
    "distractors": [
      "ξωτικό, πνεύμα",
      "τέρας",
      "νεράιδα"
    ]
  },
  {
    "id": 97,
    "unit": 3,
    "word": "fairy",
    "pos": "(n)",
    "category": "Creatures",
    "meaning": "νεράιδα",
    "distractors": [
      "δράκος, καλικάντζαρος, ανθρωποφάγος γίγαντας",
      "μάγισσα",
      "δράκος"
    ]
  },
  {
    "id": 98,
    "unit": 3,
    "word": "fall in love",
    "pos": "(phr v)",
    "category": "Feelings",
    "meaning": "ερωτεύομαι",
    "distractors": [
      "κατευθύνομαι προς",
      "ανάβω / σβήνω (διακόπτη)",
      "μεγαλώνω, γίνομαι ενήλικας"
    ]
  },
  {
    "id": 99,
    "unit": 3,
    "word": "fierce",
    "pos": "(adj)",
    "category": "Character",
    "meaning": "άγριος, τρομερός",
    "distractors": [
      "κακός, μοχθηρός / το κακό",
      "ομιλητικός, πολυλογάς",
      "παιχνιδιάρικος"
    ]
  },
  {
    "id": 100,
    "unit": 3,
    "word": "flames",
    "pos": "(n pl)",
    "category": "Objects",
    "meaning": "φλόγες",
    "distractors": [
      "χιτώνες",
      "μάφιν",
      "ξένες γλώσσες"
    ]
  },
  {
    "id": 101,
    "unit": 3,
    "word": "flee",
    "pos": "(v)",
    "category": "Actions",
    "meaning": "διαφεύγω, τρέπομαι σε φυγή",
    "distractors": [
      "επιδιορθώνω, φτιάχνω",
      "μαλώνω, διαφωνώ",
      "βουτώ"
    ]
  },
  {
    "id": 102,
    "unit": 3,
    "word": "frightening",
    "pos": "(adj)",
    "category": "Feelings",
    "meaning": "τρομακτικός",
    "distractors": [
      "βαριεστημένος, που πλήττει",
      "ευχάριστος, απολαυστικός",
      "ανήσυχος, αγχωμένος"
    ]
  },
  {
    "id": 103,
    "unit": 3,
    "word": "goat",
    "pos": "(n)",
    "category": "Animals",
    "meaning": "κατσίκα, γίδα",
    "distractors": [
      "αστερίας",
      "οπισθέλκουσα (δύναμη αντίστασης αέρα)",
      "χελώνα (θαλάσσια)"
    ]
  },
  {
    "id": 104,
    "unit": 3,
    "word": "handsome",
    "pos": "(adj)",
    "category": "Appearance",
    "meaning": "όμορφος, ευπαρουσίαστος (για άντρα)",
    "distractors": [
      "ελκυστικός, όμορφος",
      "άσχημος",
      "απεχθής, απαίσιος, φρικτός"
    ]
  },
  {
    "id": 105,
    "unit": 3,
    "word": "hideous",
    "pos": "(adj)",
    "category": "Appearance",
    "meaning": "απεχθής, απαίσιος, φρικτός",
    "distractors": [
      "όμορφος, ευπαρουσίαστος (για άντρα)",
      "άσχημος",
      "υπερμεγέθης, πολύ μεγάλος"
    ]
  },
  {
    "id": 106,
    "unit": 3,
    "word": "huge",
    "pos": "(adj)",
    "category": "Appearance",
    "meaning": "τεράστιος",
    "distractors": [
      "απεχθής, απαίσιος, φρικτός",
      "όμορφος, ευπαρουσίαστος (για άντρα)",
      "ακατάστατος, βρώμικος"
    ]
  },
  {
    "id": 107,
    "unit": 3,
    "word": "humans",
    "pos": "(n pl)",
    "category": "Creatures",
    "meaning": "άνθρωποι",
    "distractors": [
      "σκουλαρίκια",
      "χοιρινές μπριζόλες",
      "ανθρακωρυχεία"
    ]
  },
  {
    "id": 108,
    "unit": 3,
    "word": "keep vigil",
    "pos": "(phr v)",
    "category": "Actions",
    "meaning": "αγρυπνώ, φυλάω σκοπιά",
    "distractors": [
      "κάνω φάρσες, ξεγελάω",
      "μεγαλώνω, γίνομαι ενήλικας",
      "ανάβω / σβήνω (διακόπτη)"
    ]
  },
  {
    "id": 109,
    "unit": 3,
    "word": "knight",
    "pos": "(n)",
    "category": "Character",
    "meaning": "ιππότης",
    "distractors": [
      "ασθένεια, νόσος",
      "κατάσκοπος / κατασκοπεύω",
      "πριγκίπισσα"
    ]
  },
  {
    "id": 110,
    "unit": 3,
    "word": "loyal",
    "pos": "(adj)",
    "category": "Character",
    "meaning": "πιστός, αφοσιωμένος",
    "distractors": [
      "δραστήριος, ενεργητικός",
      "πονηρός, πανούργος",
      "κακός, δυσάρεστος"
    ]
  },
  {
    "id": 111,
    "unit": 3,
    "word": "luxurious",
    "pos": "(adj)",
    "category": "Places",
    "meaning": "πολυτελής",
    "distractors": [
      "άνετος, ζεστός",
      "άγριος, βάναυσος",
      "άγριος, τρομερός"
    ]
  },
  {
    "id": 112,
    "unit": 3,
    "word": "monster",
    "pos": "(n)",
    "category": "Creatures",
    "meaning": "τέρας",
    "distractors": [
      "δράκος, καλικάντζαρος, ανθρωποφάγος γίγαντας",
      "μάγισσα",
      "νεράιδα"
    ]
  },
  {
    "id": 113,
    "unit": 3,
    "word": "moody",
    "pos": "(adj)",
    "category": "Character",
    "meaning": "κυκλοθυμικός, κακόκεφος",
    "distractors": [
      "απρόβλεπτος",
      "ομιλητικός, πολυλογάς",
      "πονηρός, πανούργος"
    ]
  },
  {
    "id": 114,
    "unit": 3,
    "word": "nasty",
    "pos": "(adj)",
    "category": "Character",
    "meaning": "κακός, δυσάρεστος",
    "distractors": [
      "παιχνιδιάρικος",
      "απρόβλεπτος",
      "πιστός, αφοσιωμένος"
    ]
  },
  {
    "id": 115,
    "unit": 3,
    "word": "naughty",
    "pos": "(adj)",
    "category": "Character",
    "meaning": "άτακτος",
    "distractors": [
      "κυκλοθυμικός, κακόκεφος",
      "δραστήριος, ενεργητικός",
      "μοχθηρός, κακός"
    ]
  },
  {
    "id": 116,
    "unit": 3,
    "word": "orge",
    "pos": "(n)",
    "category": "Creatures",
    "meaning": "δράκος, καλικάντζαρος, ανθρωποφάγος γίγαντας",
    "distractors": [
      "ξωτικό, πνεύμα",
      "δράκος",
      "τέρας"
    ]
  },
  {
    "id": 117,
    "unit": 3,
    "word": "oversized",
    "pos": "(adj)",
    "category": "Appearance",
    "meaning": "υπερμεγέθης, πολύ μεγάλος",
    "distractors": [
      "φτερωτός",
      "ακατάστατος, βρώμικος",
      "όμορφος, ευπαρουσίαστος (για άντρα)"
    ]
  },
  {
    "id": 118,
    "unit": 3,
    "word": "play tricks",
    "pos": "(phr v)",
    "category": "Actions",
    "meaning": "κάνω φάρσες, ξεγελάω",
    "distractors": [
      "μεγαλώνω, γίνομαι ενήλικας",
      "αγρυπνώ, φυλάω σκοπιά",
      "ξεφορτώνομαι, απαλλάσσομαι από"
    ]
  },
  {
    "id": 119,
    "unit": 3,
    "word": "playful",
    "pos": "(adj)",
    "category": "Character",
    "meaning": "παιχνιδιάρικος",
    "distractors": [
      "απρόβλεπτος",
      "κακός, δυσάρεστος",
      "μοχθηρός, μοχθηρός/άγριος"
    ]
  },
  {
    "id": 120,
    "unit": 3,
    "word": "princess",
    "pos": "(n)",
    "category": "Character",
    "meaning": "πριγκίπισσα",
    "distractors": [
      "είδος, αντικείμενο",
      "κατάσκοπος / κατασκοπεύω",
      "ιππότης"
    ]
  },
  {
    "id": 121,
    "unit": 3,
    "word": "ruins",
    "pos": "(n pl)",
    "category": "Places",
    "meaning": "ερείπια",
    "distractors": [
      "κουμπιά",
      "χαρταετοί",
      "σκουλαρίκια"
    ]
  },
  {
    "id": 122,
    "unit": 3,
    "word": "savage",
    "pos": "(adj)",
    "category": "Character",
    "meaning": "άγριος, βάναυσος",
    "distractors": [
      "πιστός, αφοσιωμένος",
      "άτακτος",
      "μοχθηρός, μοχθηρός/άγριος"
    ]
  },
  {
    "id": 123,
    "unit": 3,
    "word": "shipwrecked",
    "pos": "(adj)",
    "category": "Myth & Stories",
    "meaning": "ναυαγός",
    "distractors": [
      "αηδιαστικός",
      "χαρούμενος, πρόσχαρος",
      "υπερφυσικός"
    ]
  },
  {
    "id": 124,
    "unit": 3,
    "word": "spit",
    "pos": "(v)",
    "category": "Actions",
    "meaning": "φτύνω, εκτοξεύω",
    "distractors": [
      "πετώ",
      "μαλώνω, διαφωνώ",
      "διαφεύγω, τρέπομαι σε φυγή"
    ]
  },
  {
    "id": 125,
    "unit": 3,
    "word": "sprite",
    "pos": "(n)",
    "category": "Creatures",
    "meaning": "ξωτικό, πνεύμα",
    "distractors": [
      "τέρας",
      "νεράιδα",
      "δράκος, καλικάντζαρος, ανθρωποφάγος γίγαντας"
    ]
  },
  {
    "id": 126,
    "unit": 3,
    "word": "storm",
    "pos": "(n)",
    "category": "Nature",
    "meaning": "καταιγίδα",
    "distractors": [
      "παλίρροια (άμπωτη και πλημμυρίδα)",
      "ωκεανός",
      "φυσικός βιότοπος, φυσικό περιβάλλον"
    ]
  },
  {
    "id": 127,
    "unit": 3,
    "word": "supernatural",
    "pos": "(adj)",
    "category": "Myth & Stories",
    "meaning": "υπερφυσικός",
    "distractors": [
      "τεράστιος",
      "βιομηχανικός",
      "ναυαγός"
    ]
  },
  {
    "id": 128,
    "unit": 3,
    "word": "power",
    "pos": "(n)",
    "category": "Myth & Stories",
    "meaning": "δύναμη, εξουσία",
    "distractors": [
      "χωράφι, αγρός",
      "προϋπολογισμός",
      "καύσιμο"
    ]
  },
  {
    "id": 129,
    "unit": 3,
    "word": "talkative",
    "pos": "(adj)",
    "category": "Character",
    "meaning": "ομιλητικός, πολυλογάς",
    "distractors": [
      "κακός, δυσάρεστος, μοχθηρός",
      "κακός, μοχθηρός / το κακό",
      "πιστός, αφοσιωμένος"
    ]
  },
  {
    "id": 130,
    "unit": 3,
    "word": "tiny",
    "pos": "(adj)",
    "category": "Appearance",
    "meaning": "μικροσκοπικός",
    "distractors": [
      "ακατάστατος, βρώμικος",
      "απεχθής, απαίσιος, φρικτός",
      "όμορφος, ευπαρουσίαστος (για άντρα)"
    ]
  },
  {
    "id": 131,
    "unit": 3,
    "word": "ugly",
    "pos": "(adj)",
    "category": "Appearance",
    "meaning": "άσχημος",
    "distractors": [
      "όμορφος, ευπαρουσίαστος (για άντρα)",
      "αηδιαστικός",
      "ελκυστικός, όμορφος"
    ]
  },
  {
    "id": 132,
    "unit": 3,
    "word": "unpredictable",
    "pos": "(adj)",
    "category": "Character",
    "meaning": "απρόβλεπτος",
    "distractors": [
      "δραστήριος, ενεργητικός",
      "πιστός, αφοσιωμένος",
      "παιχνιδιάρικος"
    ]
  },
  {
    "id": 133,
    "unit": 3,
    "word": "vicious",
    "pos": "(adj)",
    "category": "Character",
    "meaning": "μοχθηρός, μοχθηρός/άγριος",
    "distractors": [
      "ομιλητικός, πολυλογάς",
      "κακός, μοχθηρός / το κακό",
      "πονηρός, πανούργος"
    ]
  },
  {
    "id": 134,
    "unit": 3,
    "word": "wicked",
    "pos": "(adj)",
    "category": "Character",
    "meaning": "μοχθηρός, κακός",
    "distractors": [
      "παιχνιδιάρικος",
      "άτακτος",
      "απρόβλεπτος"
    ]
  },
  {
    "id": 135,
    "unit": 3,
    "word": "wild",
    "pos": "(adj)",
    "category": "Animals",
    "meaning": "άγριος",
    "distractors": [
      "χαρούμενος, πρόσχαρος",
      "τρομακτικός",
      "ακατάστατος, βρώμικος"
    ]
  },
  {
    "id": 136,
    "unit": 3,
    "word": "winged",
    "pos": "(adj)",
    "category": "Appearance",
    "meaning": "φτερωτός",
    "distractors": [
      "ακατάστατος, βρώμικος",
      "ελκυστικός, όμορφος",
      "ευαίσθητος, λεπτός"
    ]
  },
  {
    "id": 137,
    "unit": 3,
    "word": "witch",
    "pos": "(n)",
    "category": "Creatures",
    "meaning": "μάγισσα",
    "distractors": [
      "δράκος, καλικάντζαρος, ανθρωποφάγος γίγαντας",
      "νεράιδα",
      "δράκος"
    ]
  },
  {
    "id": 138,
    "unit": 4,
    "word": "accident",
    "pos": "(n)",
    "category": "Travel and Safety",
    "meaning": "ατύχημα",
    "distractors": [
      "τοξικά απόβλητα",
      "επιβάτης",
      "επιδεξιότητα (χεριών/δακτύλων)"
    ]
  },
  {
    "id": 139,
    "unit": 4,
    "word": "admire",
    "pos": "(v)",
    "category": "Feelings and Actions",
    "meaning": "θαυμάζω",
    "distractors": [
      "επιτρέπω / άδεια",
      "ταιριάζει, συνδυάζεται",
      "φορώ"
    ]
  },
  {
    "id": 140,
    "unit": 4,
    "word": "airhostess",
    "pos": "(n)",
    "category": "People and Jobs",
    "meaning": "αεροσυνοδός",
    "distractors": [
      "μεταφορά, συγκοινωνία",
      "εξειδικευμένη γνώση, πείρα",
      "καπετάνιος, κυβερνήτης"
    ]
  },
  {
    "id": 141,
    "unit": 4,
    "word": "attached files",
    "pos": "(n pl)",
    "category": "Technology",
    "meaning": "συνημμένα αρχεία",
    "distractors": [
      "βιολογικά προϊόντα",
      "ξένες γλώσσες",
      "κανόνες ασφαλείας"
    ]
  },
  {
    "id": 142,
    "unit": 4,
    "word": "captain",
    "pos": "(n)",
    "category": "People and Jobs",
    "meaning": "καπετάνιος, κυβερνήτης",
    "distractors": [
      "μάγισσα",
      "πείραμα / πειραματίζομαι",
      "αεροσυνοδός"
    ]
  },
  {
    "id": 143,
    "unit": 4,
    "word": "cargo",
    "pos": "(n)",
    "category": "Transport",
    "meaning": "φορτίο, εμπορεύματα",
    "distractors": [
      "καταιγίδα",
      "καρκίνος",
      "κινητήρας, μηχανή"
    ]
  },
  {
    "id": 144,
    "unit": 4,
    "word": "cockpit",
    "pos": "(n)",
    "category": "Parts of a Plane",
    "meaning": "πιλοτήριο, θάλαμος διακυβέρνησης",
    "distractors": [
      "ρύγχος (αεροπλάνου), μύτη",
      "φτερό (πτηνού ή αεροπλάνου)",
      "ουρά (αεροπλάνου)"
    ]
  },
  {
    "id": 145,
    "unit": 4,
    "word": "design",
    "pos": "(v)",
    "category": "Science and Invention",
    "meaning": "σχεδιάζω",
    "distractors": [
      "εφευρίσκω",
      "ισιώνω",
      "ιδρώνω"
    ]
  },
  {
    "id": 146,
    "unit": 4,
    "word": "drag",
    "pos": "(n)",
    "category": "Forces of Flight",
    "meaning": "οπισθέλκουσα (δύναμη αντίστασης αέρα)",
    "distractors": [
      "άνωση (ανυψωτική δύναμη)",
      "ώση (προωθητική δύναμη)",
      "βαρύτητα"
    ]
  },
  {
    "id": 147,
    "unit": 4,
    "word": "drown",
    "pos": "(v)",
    "category": "The Myth and Art",
    "meaning": "πνίγομαι (στο νερό)",
    "distractors": [
      "λιώνω",
      "σώζω, διασώζω",
      "ιδρώνω"
    ]
  },
  {
    "id": 148,
    "unit": 4,
    "word": "edge",
    "pos": "(n)",
    "category": "Places and Nature",
    "meaning": "άκρη, χείλος",
    "distractors": [
      "ουρά (αεροπλάνου)",
      "οδηγία",
      "χωράφι, αγρός"
    ]
  },
  {
    "id": 149,
    "unit": 4,
    "word": "engine",
    "pos": "(n)",
    "category": "Parts of a Plane",
    "meaning": "κινητήρας, μηχανή",
    "distractors": [
      "πιλοτήριο, θάλαμος διακυβέρνησης",
      "φτερό (πτηνού ή αεροπλάνου)",
      "ρύγχος (αεροπλάνου), μύτη"
    ]
  },
  {
    "id": 150,
    "unit": 4,
    "word": "experiment",
    "pos": "(n)",
    "category": "Science and Invention",
    "meaning": "πείραμα",
    "distractors": [
      "μυθιστόρημα",
      "ήχος",
      "φρουτοποτό, παντς φρούτων"
    ]
  },
  {
    "id": 151,
    "unit": 4,
    "word": "field",
    "pos": "(n)",
    "category": "Places and Nature",
    "meaning": "χωράφι, αγρός",
    "distractors": [
      "περιοχή, χώρος",
      "εσπεριδοειδή (πορτοκάλια, λεμόνια κλπ)",
      "άκρη, χείλος"
    ]
  },
  {
    "id": 152,
    "unit": 4,
    "word": "fix",
    "pos": "(v)",
    "category": "Actions",
    "meaning": "επιδιορθώνω, φτιάχνω",
    "distractors": [
      "φτύνω, εκτοξεύω",
      "πετώ",
      "βουτώ"
    ]
  },
  {
    "id": 153,
    "unit": 4,
    "word": "flight",
    "pos": "(n)",
    "category": "Aviation",
    "meaning": "πτήση",
    "distractors": [
      "βιολογία",
      "ιππότης",
      "προσομοιωτής"
    ]
  },
  {
    "id": 154,
    "unit": 4,
    "word": "fly",
    "pos": "(v)",
    "category": "Actions",
    "meaning": "πετώ",
    "distractors": [
      "μαλώνω, διαφωνώ",
      "φτύνω, εκτοξεύω",
      "διαφεύγω, τρέπομαι σε φυγή"
    ]
  },
  {
    "id": 155,
    "unit": 4,
    "word": "gravity",
    "pos": "(n)",
    "category": "Forces of Flight",
    "meaning": "βαρύτητα",
    "distractors": [
      "ώση (προωθητική δύναμη)",
      "ταχύτητα",
      "οπισθέλκουσα (δύναμη αντίστασης αέρα)"
    ]
  },
  {
    "id": 156,
    "unit": 4,
    "word": "grow up",
    "pos": "(phr v)",
    "category": "Actions",
    "meaning": "μεγαλώνω, γίνομαι ενήλικας",
    "distractors": [
      "κάνω φάρσες, ξεγελάω",
      "αγρυπνώ, φυλάω σκοπιά",
      "ανάβω / σβήνω (διακόπτη)"
    ]
  },
  {
    "id": 157,
    "unit": 4,
    "word": "invent",
    "pos": "(v)",
    "category": "Science and Invention",
    "meaning": "εφευρίσκω",
    "distractors": [
      "καλύπτω, σκεπάζω",
      "σχεδιάζω",
      "επιβάλλω, φορτώνω υποχρέωση"
    ]
  },
  {
    "id": 158,
    "unit": 4,
    "word": "kites",
    "pos": "(n pl)",
    "category": "Aviation",
    "meaning": "χαρταετοί",
    "distractors": [
      "κουμπιά",
      "διάδρομοι (μεταξύ ραφιών ή καθισμάτων)",
      "μάφιν"
    ]
  },
  {
    "id": 159,
    "unit": 4,
    "word": "land",
    "pos": "(v)",
    "category": "Aviation",
    "meaning": "προσγειώνομαι",
    "distractors": [
      "επιδιορθώνω, φτιάχνω",
      "καταναλώνω, τρώω ή πίνω",
      "επισκευάζω"
    ]
  },
  {
    "id": 160,
    "unit": 4,
    "word": "landscape",
    "pos": "(n)",
    "category": "The Myth and Art",
    "meaning": "τοπίο",
    "distractors": [
      "πλατσούρισμα, πιτσίλισμα",
      "βοσκός",
      "κερί (υλικό)"
    ]
  },
  {
    "id": 161,
    "unit": 4,
    "word": "lift",
    "pos": "(n)",
    "category": "Forces of Flight",
    "meaning": "άνωση (ανυψωτική δύναμη)",
    "distractors": [
      "ώση (προωθητική δύναμη)",
      "βαρύτητα",
      "οπισθέλκουσα (δύναμη αντίστασης αέρα)"
    ]
  },
  {
    "id": 162,
    "unit": 4,
    "word": "melt",
    "pos": "(v)",
    "category": "The Myth and Art",
    "meaning": "λιώνω",
    "distractors": [
      "πνίγομαι (στο νερό)",
      "χειρίζομαι, διαχειρίζομαι",
      "ιδρώνω"
    ]
  },
  {
    "id": 163,
    "unit": 4,
    "word": "nose",
    "pos": "(n)",
    "category": "Parts of a Plane",
    "meaning": "ρύγχος (αεροπλάνου), μύτη",
    "distractors": [
      "κινητήρας, μηχανή",
      "ουρά (αεροπλάνου)",
      "πιλοτήριο, θάλαμος διακυβέρνησης"
    ]
  },
  {
    "id": 164,
    "unit": 4,
    "word": "passenger",
    "pos": "(n)",
    "category": "Travel and Safety",
    "meaning": "επιβάτης",
    "distractors": [
      "ατύχημα",
      "περιβάλλον",
      "πλοκή (έργου, ταινίας)"
    ]
  },
  {
    "id": 165,
    "unit": 4,
    "word": "poem",
    "pos": "(n)",
    "category": "The Myth and Art",
    "meaning": "ποίημα",
    "distractors": [
      "βοσκός",
      "τοπίο",
      "πλατσούρισμα, πιτσίλισμα"
    ]
  },
  {
    "id": 166,
    "unit": 4,
    "word": "repair",
    "pos": "(v)",
    "category": "Actions",
    "meaning": "επισκευάζω",
    "distractors": [
      "βουτώ",
      "πετώ",
      "φτύνω, εκτοξεύω"
    ]
  },
  {
    "id": 167,
    "unit": 4,
    "word": "shepherd",
    "pos": "(n)",
    "category": "The Myth and Art",
    "meaning": "βοσκός",
    "distractors": [
      "τοπίο",
      "πλατσούρισμα, πιτσίλισμα",
      "κερί (υλικό)"
    ]
  },
  {
    "id": 168,
    "unit": 4,
    "word": "simulator",
    "pos": "(n)",
    "category": "Aviation",
    "meaning": "προσομοιωτής",
    "distractors": [
      "φορτηγάκι, κλούβα",
      "τοξίνη, δηλητήριο",
      "πτήση"
    ]
  },
  {
    "id": 169,
    "unit": 4,
    "word": "sound",
    "pos": "(n)",
    "category": "Science and Invention",
    "meaning": "ήχος",
    "distractors": [
      "σχέδιο, σκίτσο",
      "πείραμα",
      "εθελοντής, προσφέρω εθελοντικά"
    ]
  },
  {
    "id": 170,
    "unit": 4,
    "word": "speed",
    "pos": "(n)",
    "category": "Forces of Flight",
    "meaning": "ταχύτητα",
    "distractors": [
      "άνωση (ανυψωτική δύναμη)",
      "οπισθέλκουσα (δύναμη αντίστασης αέρα)",
      "ώση (προωθητική δύναμη)"
    ]
  },
  {
    "id": 171,
    "unit": 4,
    "word": "splash",
    "pos": "(n)",
    "category": "The Myth and Art",
    "meaning": "πλατσούρισμα, πιτσίλισμα",
    "distractors": [
      "βοσκός",
      "κερί (υλικό)",
      "ποίημα"
    ]
  },
  {
    "id": 172,
    "unit": 4,
    "word": "sweat",
    "pos": "(v)",
    "category": "The Myth and Art",
    "meaning": "ιδρώνω",
    "distractors": [
      "προσέχω",
      "πνίγομαι (στο νερό)",
      "λιώνω"
    ]
  },
  {
    "id": 173,
    "unit": 4,
    "word": "tail",
    "pos": "(n)",
    "category": "Parts of a Plane",
    "meaning": "ουρά (αεροπλάνου)",
    "distractors": [
      "κινητήρας, μηχανή",
      "πιλοτήριο, θάλαμος διακυβέρνησης",
      "φτερό (πτηνού ή αεροπλάνου)"
    ]
  },
  {
    "id": 174,
    "unit": 4,
    "word": "thrust",
    "pos": "(n)",
    "category": "Forces of Flight",
    "meaning": "ώση (προωθητική δύναμη)",
    "distractors": [
      "οπισθέλκουσα (δύναμη αντίστασης αέρα)",
      "άνωση (ανυψωτική δύναμη)",
      "ταχύτητα"
    ]
  },
  {
    "id": 175,
    "unit": 4,
    "word": "unnoticed",
    "pos": "(adj)",
    "category": "The Myth and Art",
    "meaning": "απαρατήρητος",
    "distractors": [
      "αγχωτικός, κουραστικός",
      "εκλεπτυσμένος, εξελιγμένος",
      "άγριος"
    ]
  },
  {
    "id": 176,
    "unit": 4,
    "word": "wax",
    "pos": "(n)",
    "category": "The Myth and Art",
    "meaning": "κερί (υλικό)",
    "distractors": [
      "βοσκός",
      "τοπίο",
      "ποίημα"
    ]
  },
  {
    "id": 177,
    "unit": 4,
    "word": "wing",
    "pos": "(n)",
    "category": "Parts of a Plane",
    "meaning": "φτερό (πτηνού ή αεροπλάνου)",
    "distractors": [
      "ουρά (αεροπλάνου)",
      "πιλοτήριο, θάλαμος διακυβέρνησης",
      "κινητήρας, μηχανή"
    ]
  },
  {
    "id": 178,
    "unit": 4,
    "word": "worksheet",
    "pos": "(n)",
    "category": "School and Study",
    "meaning": "φύλλο εργασίας",
    "distractors": [
      "στροφή (δρόμου)",
      "τραπεζίτης",
      "εργοστάσιο χημικών"
    ]
  },
  {
    "id": 179,
    "unit": 5,
    "word": "accompany",
    "pos": "(v)",
    "category": "Actions and Habits",
    "meaning": "συνοδεύω",
    "distractors": [
      "μπουσουλάω, σέρνομαι",
      "επιβάλλω, φορτώνω υποχρέωση",
      "τραβώ"
    ]
  },
  {
    "id": 180,
    "unit": 5,
    "word": "admission",
    "pos": "(n)",
    "category": "Museum and Culture",
    "meaning": "είσοδος, αντίτιμο εισόδου",
    "distractors": [
      "θησαυρός",
      "κατάστημα αναμνηστικών δώρων",
      "κυνήγι θησαυρού"
    ]
  },
  {
    "id": 181,
    "unit": 5,
    "word": "adult",
    "pos": "(n)",
    "category": "People and Roles",
    "meaning": "ενήλικας",
    "distractors": [
      "γυναίκα, θηλυκός",
      "εισπράκτορας",
      "τραπεζίτης"
    ]
  },
  {
    "id": 182,
    "unit": 5,
    "word": "alight",
    "pos": "(v)",
    "category": "Travel and Transport",
    "meaning": "αποβιβάζομαι, κατεβαίνω από όχημα",
    "distractors": [
      "επιτρέπω / άδεια",
      "εκτυπώνω / εκτύπωση",
      "προσέχω"
    ]
  },
  {
    "id": 183,
    "unit": 5,
    "word": "banker",
    "pos": "(n)",
    "category": "People and Roles",
    "meaning": "τραπεζίτης",
    "distractors": [
      "ξεναγός, οδηγός",
      "γυναίκα, θηλυκός",
      "εισπράκτορας"
    ]
  },
  {
    "id": 184,
    "unit": 5,
    "word": "beard",
    "pos": "(n)",
    "category": "Clothes and Appearance",
    "meaning": "μούσι, γενειάδα",
    "distractors": [
      "αλογοουρά (χτένισμα)",
      "λινό ύφασμα",
      "άρωμα"
    ]
  },
  {
    "id": 185,
    "unit": 5,
    "word": "behind",
    "pos": "(prep)",
    "category": "Directions and Places",
    "meaning": "πίσω από",
    "distractors": [
      "απέναντι από",
      "προκαλώ / αιτία, αφορμή",
      "βοσκός"
    ]
  },
  {
    "id": 186,
    "unit": 5,
    "word": "bell-bottomed pants",
    "pos": "(n pl)",
    "category": "Clothes and Appearance",
    "meaning": "παντελόνια καμπάνα",
    "distractors": [
      "τήβεννοι (ενδύματα)",
      "ψηλοτάκουνα παπούτσια",
      "χιτώνες"
    ]
  },
  {
    "id": 187,
    "unit": 5,
    "word": "bite one's nails",
    "pos": "(phr)",
    "category": "Actions and Habits",
    "meaning": "τρώω τα νύχια μου",
    "distractors": [
      "πιλοτήριο, θάλαμος διακυβέρνησης",
      "κυκλοφορεί στα καταστήματα/βιβλιοπωλεία",
      "κρατώ ελεύθερο, μένω μακριά"
    ]
  },
  {
    "id": 188,
    "unit": 5,
    "word": "braids",
    "pos": "(n pl)",
    "category": "Clothes and Appearance",
    "meaning": "πλεξούδες",
    "distractors": [
      "ψηλοτάκουνα παπούτσια",
      "παντελόνια καμπάνα",
      "τήβεννοι (ενδύματα)"
    ]
  },
  {
    "id": 189,
    "unit": 5,
    "word": "buttons",
    "pos": "(n pl)",
    "category": "Travel and Transport",
    "meaning": "κουμπιά",
    "distractors": [
      "ράγες, σιδηροτροχιές",
      "σωρός, πλήθος, πολλά",
      "μοχλοί"
    ]
  },
  {
    "id": 190,
    "unit": 5,
    "word": "canapes",
    "pos": "(n pl)",
    "category": "Food and Celebration",
    "meaning": "καναπεδάκια",
    "distractors": [
      "διάδρομοι (μεταξύ ραφιών ή καθισμάτων)",
      "ψηλοτάκουνα παπούτσια",
      "εγκαταστάσεις, διευκολύνσεις"
    ]
  },
  {
    "id": 191,
    "unit": 5,
    "word": "change",
    "pos": "(n)",
    "category": "Travel and Transport",
    "meaning": "ρέστα, ψιλά",
    "distractors": [
      "διώροφο λεωφορείο",
      "κενό, διάκενο",
      "σήμα, σηματοδότης"
    ]
  },
  {
    "id": 192,
    "unit": 5,
    "word": "conductor",
    "pos": "(n)",
    "category": "People and Roles",
    "meaning": "εισπράκτορας",
    "distractors": [
      "τραπεζίτης",
      "ξεναγός, οδηγός",
      "ενήλικας"
    ]
  },
  {
    "id": 193,
    "unit": 5,
    "word": "consume",
    "pos": "(v)",
    "category": "Actions and Habits",
    "meaning": "καταναλώνω, τρώω ή πίνω",
    "distractors": [
      "επιβάλλω, φορτώνω υποχρέωση",
      "φορώ",
      "μπουσουλάω, σέρνομαι"
    ]
  },
  {
    "id": 194,
    "unit": 5,
    "word": "crawl",
    "pos": "(v)",
    "category": "Actions and Habits",
    "meaning": "μπουσουλάω, σέρνομαι",
    "distractors": [
      "φορώ",
      "επιβάλλω, φορτώνω υποχρέωση",
      "καταναλώνω, τρώω ή πίνω"
    ]
  },
  {
    "id": 195,
    "unit": 5,
    "word": "diary",
    "pos": "(n)",
    "category": "Museum and Culture",
    "meaning": "ημερολόγιο",
    "distractors": [
      "κυνήγι θησαυρού",
      "κατάστημα αναμνηστικών δώρων",
      "θησαυρός"
    ]
  },
  {
    "id": 196,
    "unit": 5,
    "word": "direction",
    "pos": "(n)",
    "category": "Directions and Places",
    "meaning": "κατεύθυνση",
    "distractors": [
      "στροφή (δρόμου)",
      "οπισθέλκουσα (δύναμη αντίστασης αέρα)",
      "οδηγία"
    ]
  },
  {
    "id": 197,
    "unit": 5,
    "word": "double-decker bus",
    "pos": "(n)",
    "category": "Travel and Transport",
    "meaning": "διώροφο λεωφορείο",
    "distractors": [
      "κενό, διάκενο",
      "δέμα",
      "άχυρο"
    ]
  },
  {
    "id": 198,
    "unit": 5,
    "word": "female",
    "pos": "(n, adj)",
    "category": "People and Roles",
    "meaning": "γυναίκα, θηλυκός",
    "distractors": [
      "ενήλικας",
      "εισπράκτορας",
      "ξεναγός, οδηγός"
    ]
  },
  {
    "id": 199,
    "unit": 5,
    "word": "fruit punch",
    "pos": "(n)",
    "category": "Food and Celebration",
    "meaning": "φρουτοποτό, παντς φρούτων",
    "distractors": [
      "κατσίκα, γίδα",
      "χαρακτήρας, ήρωας (βιβλίου, έργου)",
      "γαλοπούλα"
    ]
  },
  {
    "id": 200,
    "unit": 5,
    "word": "gap",
    "pos": "(n)",
    "category": "Travel and Transport",
    "meaning": "κενό, διάκενο",
    "distractors": [
      "διώροφο λεωφορείο",
      "δέμα",
      "σήμα, σηματοδότης"
    ]
  },
  {
    "id": 201,
    "unit": 5,
    "word": "gift shop",
    "pos": "(n)",
    "category": "Museum and Culture",
    "meaning": "κατάστημα αναμνηστικών δώρων",
    "distractors": [
      "ημερολόγιο",
      "θησαυρός",
      "είσοδος, αντίτιμο εισόδου"
    ]
  },
  {
    "id": 202,
    "unit": 5,
    "word": "guide",
    "pos": "(n)",
    "category": "People and Roles",
    "meaning": "ξεναγός, οδηγός",
    "distractors": [
      "εισπράκτορας",
      "ενήλικας",
      "γυναίκα, θηλυκός"
    ]
  },
  {
    "id": 203,
    "unit": 5,
    "word": "high heeled shoes",
    "pos": "(n pl)",
    "category": "Clothes and Appearance",
    "meaning": "ψηλοτάκουνα παπούτσια",
    "distractors": [
      "τήβεννοι (ενδύματα)",
      "παντελόνια καμπάνα",
      "χιτώνες"
    ]
  },
  {
    "id": 204,
    "unit": 5,
    "word": "hunt game",
    "pos": "(n)",
    "category": "Museum and Culture",
    "meaning": "κυνήγι θησαυρού",
    "distractors": [
      "κατάστημα αναμνηστικών δώρων",
      "θησαυρός",
      "είσοδος, αντίτιμο εισόδου"
    ]
  },
  {
    "id": 205,
    "unit": 5,
    "word": "impose",
    "pos": "(v)",
    "category": "Actions and Habits",
    "meaning": "επιβάλλω, φορτώνω υποχρέωση",
    "distractors": [
      "τραβώ",
      "συνοδεύω",
      "φορώ"
    ]
  },
  {
    "id": 206,
    "unit": 5,
    "word": "instruction",
    "pos": "(n)",
    "category": "Directions and Places",
    "meaning": "οδηγία",
    "distractors": [
      "στροφή (δρόμου)",
      "χρονοδιάγραμμα, πρόγραμμα",
      "κατεύθυνση"
    ]
  },
  {
    "id": 207,
    "unit": 5,
    "word": "keep clear",
    "pos": "(phr)",
    "category": "Travel and Transport",
    "meaning": "κρατώ ελεύθερο, μένω μακριά",
    "distractors": [
      "κυκλοφορεί στα καταστήματα/βιβλιοπωλεία",
      "τρώω τα νύχια μου",
      "συρμός του μετρό (υπόγειος)"
    ]
  },
  {
    "id": 208,
    "unit": 5,
    "word": "lean against",
    "pos": "(v phr)",
    "category": "Actions and Habits",
    "meaning": "ακουμπώ πάνω σε, στηρίζομαι",
    "distractors": [
      "εξαφανίζομαι, εκλείπω (για είδος)",
      "παραποιώ, πειράζω απρόσεκτα",
      "φροντίζω, νοιάζομαι για"
    ]
  },
  {
    "id": 209,
    "unit": 5,
    "word": "levers",
    "pos": "(n pl)",
    "category": "Travel and Transport",
    "meaning": "μοχλοί",
    "distractors": [
      "τάρτα φρούτων",
      "κουμπιά",
      "ράγες, σιδηροτροχιές"
    ]
  },
  {
    "id": 210,
    "unit": 5,
    "word": "linen",
    "pos": "(n)",
    "category": "Clothes and Appearance",
    "meaning": "λινό ύφασμα",
    "distractors": [
      "άρωμα",
      "αλογοουρά (χτένισμα)",
      "μούσι, γενειάδα"
    ]
  },
  {
    "id": 211,
    "unit": 5,
    "word": "mind",
    "pos": "(v)",
    "category": "Travel and Transport",
    "meaning": "προσέχω",
    "distractors": [
      "ταιριάζει, συνδυάζεται",
      "πνίγομαι (στο νερό)",
      "αποβιβάζομαι, κατεβαίνω από όχημα"
    ]
  },
  {
    "id": 212,
    "unit": 5,
    "word": "omnibus",
    "pos": "(n)",
    "category": "Travel and Transport",
    "meaning": "παλιό δημόσιο λεωφορείο (ιππήλατο)",
    "distractors": [
      "υπόγειος σιδηρόδρομος, μετρό",
      "μεταφορά, συγκοινωνία",
      "συρμός του μετρό (υπόγειος)"
    ]
  },
  {
    "id": 213,
    "unit": 5,
    "word": "opposite",
    "pos": "(prep, adj)",
    "category": "Directions and Places",
    "meaning": "απέναντι από",
    "distractors": [
      "ξεβράζω, εκβράζω (στην ακτή)",
      "χιτώνες",
      "πίσω από"
    ]
  },
  {
    "id": 214,
    "unit": 5,
    "word": "parcel",
    "pos": "(n)",
    "category": "Travel and Transport",
    "meaning": "δέμα",
    "distractors": [
      "φορτηγάκι, κλούβα",
      "ρέστα, ψιλά",
      "διώροφο λεωφορείο"
    ]
  },
  {
    "id": 215,
    "unit": 5,
    "word": "perfume",
    "pos": "(n)",
    "category": "Clothes and Appearance",
    "meaning": "άρωμα",
    "distractors": [
      "λινό ύφασμα",
      "στολή (μαθητική, επαγγελματική)",
      "φούστα"
    ]
  },
  {
    "id": 216,
    "unit": 5,
    "word": "ponytail",
    "pos": "(n)",
    "category": "Clothes and Appearance",
    "meaning": "αλογοουρά (χτένισμα)",
    "distractors": [
      "μούσι, γενειάδα",
      "λινό ύφασμα",
      "στολή (μαθητική, επαγγελματική)"
    ]
  },
  {
    "id": 217,
    "unit": 5,
    "word": "pull",
    "pos": "(v)",
    "category": "Actions and Habits",
    "meaning": "τραβώ",
    "distractors": [
      "καταναλώνω, τρώω ή πίνω",
      "συνοδεύω",
      "επιβάλλω, φορτώνω υποχρέωση"
    ]
  },
  {
    "id": 218,
    "unit": 5,
    "word": "respectfully",
    "pos": "(adv)",
    "category": "Actions and Habits",
    "meaning": "με σεβασμό",
    "distractors": [
      "ελαφρώς, λίγο",
      "σύνορο, μεθόριος / συνορεύω",
      "ανεξάρτητα, αυτόνομα"
    ]
  },
  {
    "id": 219,
    "unit": 5,
    "word": "shy",
    "pos": "(adj)",
    "category": "People and Roles",
    "meaning": "ντροπαλός",
    "distractors": [
      "εξωστρεφής, κοινωνικός",
      "πολυτελής",
      "υπερφυσικός"
    ]
  },
  {
    "id": 220,
    "unit": 5,
    "word": "signal",
    "pos": "(n)",
    "category": "Travel and Transport",
    "meaning": "σήμα, σηματοδότης",
    "distractors": [
      "διώροφο λεωφορείο",
      "παλιό δημόσιο λεωφορείο (ιππήλατο)",
      "δέμα"
    ]
  },
  {
    "id": 221,
    "unit": 5,
    "word": "skirt",
    "pos": "(n)",
    "category": "Clothes and Appearance",
    "meaning": "φούστα",
    "distractors": [
      "στολή (μαθητική, επαγγελματική)",
      "λινό ύφασμα",
      "αλογοουρά (χτένισμα)"
    ]
  },
  {
    "id": 222,
    "unit": 5,
    "word": "stank",
    "pos": "(v past)",
    "category": "Actions and Habits",
    "meaning": "μύριζε άσχημα, βρωμούσε",
    "distractors": [
      "δράκος, καλικάντζαρος, ανθρωποφάγος γίγαντας",
      "κιμάς",
      "πολύτιμοι λίθοι"
    ]
  },
  {
    "id": 223,
    "unit": 5,
    "word": "straw",
    "pos": "(n)",
    "category": "Travel and Transport",
    "meaning": "άχυρο",
    "distractors": [
      "κενό, διάκενο",
      "διώροφο λεωφορείο",
      "ρέστα, ψιλά"
    ]
  },
  {
    "id": 224,
    "unit": 5,
    "word": "togas",
    "pos": "(n pl)",
    "category": "Clothes and Appearance",
    "meaning": "τήβεννοι (ενδύματα)",
    "distractors": [
      "πλεξούδες",
      "χιτώνες",
      "ψηλοτάκουνα παπούτσια"
    ]
  },
  {
    "id": 225,
    "unit": 5,
    "word": "tracks",
    "pos": "(n pl)",
    "category": "Travel and Transport",
    "meaning": "ράγες, σιδηροτροχιές",
    "distractors": [
      "κουμπιά",
      "μοχλοί",
      "καναπεδάκια"
    ]
  },
  {
    "id": 226,
    "unit": 5,
    "word": "transportation",
    "pos": "(n)",
    "category": "Travel and Transport",
    "meaning": "μεταφορά, συγκοινωνία",
    "distractors": [
      "άχυρο",
      "δέμα",
      "συρμός του μετρό (υπόγειος)"
    ]
  },
  {
    "id": 227,
    "unit": 5,
    "word": "treasure",
    "pos": "(n)",
    "category": "Museum and Culture",
    "meaning": "θησαυρός",
    "distractors": [
      "κυνήγι θησαυρού",
      "είσοδος, αντίτιμο εισόδου",
      "κατάστημα αναμνηστικών δώρων"
    ]
  },
  {
    "id": 228,
    "unit": 5,
    "word": "tube train",
    "pos": "(n)",
    "category": "Travel and Transport",
    "meaning": "συρμός του μετρό (υπόγειος)",
    "distractors": [
      "άχυρο",
      "σήμα, σηματοδότης",
      "δέμα"
    ]
  },
  {
    "id": 229,
    "unit": 5,
    "word": "tunics",
    "pos": "(n pl)",
    "category": "Clothes and Appearance",
    "meaning": "χιτώνες",
    "distractors": [
      "παντελόνια καμπάνα",
      "τήβεννοι (ενδύματα)",
      "ψηλοτάκουνα παπούτσια"
    ]
  },
  {
    "id": 230,
    "unit": 5,
    "word": "turning",
    "pos": "(n)",
    "category": "Directions and Places",
    "meaning": "στροφή (δρόμου)",
    "distractors": [
      "σκουπίδια, απορρίμματα",
      "κατεύθυνση",
      "οδηγία"
    ]
  },
  {
    "id": 231,
    "unit": 5,
    "word": "underground",
    "pos": "(n, adj)",
    "category": "Travel and Transport",
    "meaning": "υπόγειος σιδηρόδρομος, μετρό",
    "distractors": [
      "φορτηγάκι, κλούβα",
      "ρέστα, ψιλά",
      "κενό, διάκενο"
    ]
  },
  {
    "id": 232,
    "unit": 5,
    "word": "uniform",
    "pos": "(n)",
    "category": "Clothes and Appearance",
    "meaning": "στολή (μαθητική, επαγγελματική)",
    "distractors": [
      "αλογοουρά (χτένισμα)",
      "φούστα",
      "λινό ύφασμα"
    ]
  },
  {
    "id": 233,
    "unit": 5,
    "word": "van",
    "pos": "(n)",
    "category": "Travel and Transport",
    "meaning": "φορτηγάκι, κλούβα",
    "distractors": [
      "κενό, διάκενο",
      "άχυρο",
      "μεταφορά, συγκοινωνία"
    ]
  },
  {
    "id": 234,
    "unit": 5,
    "word": "wear",
    "pos": "(v)",
    "category": "Actions and Habits",
    "meaning": "φορώ",
    "distractors": [
      "συνοδεύω",
      "επιβάλλω, φορτώνω υποχρέωση",
      "καταναλώνω, τρώω ή πίνω"
    ]
  },
  {
    "id": 235,
    "unit": 6,
    "word": "ability",
    "pos": "(n)",
    "category": "Skills and Abilities",
    "meaning": "ικανότητα",
    "distractors": [
      "επιδεξιότητα (χεριών/δακτύλων)",
      "συντονισμός (ματιού-χεριού κ.λπ.)",
      "δεξιότητα"
    ]
  },
  {
    "id": 236,
    "unit": 6,
    "word": "air traffic controller",
    "pos": "(n)",
    "category": "Professions and Careers",
    "meaning": "ελεγκτής εναέριας κυκλοφορίας",
    "distractors": [
      "εθελοντής, προσφέρω εθελοντικά",
      "μηχανικός αυτοκινήτων",
      "σταδιοδρομία, καριέρα"
    ]
  },
  {
    "id": 237,
    "unit": 6,
    "word": "aisles",
    "pos": "(n pl)",
    "category": "Workplace and Environment",
    "meaning": "διάδρομοι (μεταξύ ραφιών ή καθισμάτων)",
    "distractors": [
      "σωρός, πλήθος, πολλά",
      "κανόνες ασφαλείας",
      "εγκαταστάσεις, διευκολύνσεις"
    ]
  },
  {
    "id": 238,
    "unit": 6,
    "word": "area",
    "pos": "(n)",
    "category": "Workplace and Environment",
    "meaning": "περιοχή, χώρος",
    "distractors": [
      "ασθενής",
      "ομάδα",
      "χρονοδιάγραμμα, πρόγραμμα"
    ]
  },
  {
    "id": 239,
    "unit": 6,
    "word": "artistic",
    "pos": "(adj)",
    "category": "Skills and Abilities",
    "meaning": "καλλιτεχνικός",
    "distractors": [
      "καλά εκπαιδευμένος",
      "εξωστρεφής, κοινωνικός",
      "βαριεστημένος, που πλήττει"
    ]
  },
  {
    "id": 240,
    "unit": 6,
    "word": "attention",
    "pos": "(n)",
    "category": "Skills and Abilities",
    "meaning": "προσοχή",
    "distractors": [
      "συντονισμός (ματιού-χεριού κ.λπ.)",
      "ικανότητα",
      "επιδεξιότητα (χεριών/δακτύλων)"
    ]
  },
  {
    "id": 241,
    "unit": 6,
    "word": "biology",
    "pos": "(n)",
    "category": "School Subjects and Knowledge",
    "meaning": "βιολογία",
    "distractors": [
      "οικιακή οικονομία",
      "χημεία",
      "επιδεξιότητα (χεριών/δακτύλων)"
    ]
  },
  {
    "id": 242,
    "unit": 6,
    "word": "brave",
    "pos": "(adj)",
    "category": "Personal Traits",
    "meaning": "γενναίος",
    "distractors": [
      "χαρούμενος, πρόσχαρος",
      "συμπονετικός",
      "δημιουργικός"
    ]
  },
  {
    "id": 243,
    "unit": 6,
    "word": "candidate",
    "pos": "(n)",
    "category": "Professions and Careers",
    "meaning": "υποψήφιος",
    "distractors": [
      "επάγγελμα (επιστημονικό/ειδικευμένο)",
      "νοσοκόμος, νοσηλευτής",
      "εθελοντής, προσφέρω εθελοντικά"
    ]
  },
  {
    "id": 244,
    "unit": 6,
    "word": "car mechanic",
    "pos": "(n)",
    "category": "Professions and Careers",
    "meaning": "μηχανικός αυτοκινήτων",
    "distractors": [
      "ελεγκτής εναέριας κυκλοφορίας",
      "οικολόγος",
      "κομμωτής, κομμώτρια"
    ]
  },
  {
    "id": 245,
    "unit": 6,
    "word": "care for",
    "pos": "(v phr)",
    "category": "Actions and Responsibilities",
    "meaning": "φροντίζω, νοιάζομαι για",
    "distractors": [
      "γεννώ αυγά",
      "ακουμπώ πάνω σε, στηρίζομαι",
      "παραποιώ, πειράζω απρόσεκτα"
    ]
  },
  {
    "id": 246,
    "unit": 6,
    "word": "career",
    "pos": "(n)",
    "category": "Professions and Careers",
    "meaning": "σταδιοδρομία, καριέρα",
    "distractors": [
      "υποψήφιος",
      "ελεγκτής εναέριας κυκλοφορίας",
      "επάγγελμα (επιστημονικό/ειδικευμένο)"
    ]
  },
  {
    "id": 247,
    "unit": 6,
    "word": "cheerful",
    "pos": "(adj)",
    "category": "Personal Traits",
    "meaning": "χαρούμενος, πρόσχαρος",
    "distractors": [
      "συμπονετικός",
      "αγχωτικός, κουραστικός",
      "δημιουργικός"
    ]
  },
  {
    "id": 248,
    "unit": 6,
    "word": "home economics",
    "pos": "(n)",
    "category": "School Subjects and Knowledge",
    "meaning": "οικιακή οικονομία",
    "distractors": [
      "βιολογία",
      "χημεία",
      "επάγγελμα"
    ]
  },
  {
    "id": 249,
    "unit": 6,
    "word": "chemistry",
    "pos": "(n)",
    "category": "School Subjects and Knowledge",
    "meaning": "χημεία",
    "distractors": [
      "βιολογία",
      "οικιακή οικονομία",
      "τέρας"
    ]
  },
  {
    "id": 250,
    "unit": 6,
    "word": "communication",
    "pos": "(n)",
    "category": "Skills and Abilities",
    "meaning": "επικοινωνία",
    "distractors": [
      "δεξιότητα",
      "προσοχή",
      "επιδεξιότητα (χεριών/δακτύλων)"
    ]
  },
  {
    "id": 251,
    "unit": 6,
    "word": "compassionate",
    "pos": "(adj)",
    "category": "Personal Traits",
    "meaning": "συμπονετικός",
    "distractors": [
      "αγχωτικός, κουραστικός",
      "δημιουργικός",
      "με αυτοπεποίθηση"
    ]
  },
  {
    "id": 252,
    "unit": 6,
    "word": "construct",
    "pos": "(v)",
    "category": "Actions and Responsibilities",
    "meaning": "κατασκευάζω, χτίζω",
    "distractors": [
      "απαιτώ, χρειάζομαι",
      "ισιώνω",
      "χειρίζομαι, διαχειρίζομαι"
    ]
  },
  {
    "id": 253,
    "unit": 6,
    "word": "co-ordination",
    "pos": "(n)",
    "category": "Skills and Abilities",
    "meaning": "συντονισμός (ματιού-χεριού κ.λπ.)",
    "distractors": [
      "προσοχή",
      "επιδεξιότητα (χεριών/δακτύλων)",
      "αυτοαξιολόγηση"
    ]
  },
  {
    "id": 254,
    "unit": 6,
    "word": "create",
    "pos": "(v)",
    "category": "Actions and Responsibilities",
    "meaning": "δημιουργώ",
    "distractors": [
      "χειρίζομαι, διαχειρίζομαι",
      "απαιτώ, χρειάζομαι",
      "κατασκευάζω, χτίζω"
    ]
  },
  {
    "id": 255,
    "unit": 6,
    "word": "creative",
    "pos": "(adj)",
    "category": "Personal Traits",
    "meaning": "δημιουργικός",
    "distractors": [
      "με αυτοπεποίθηση",
      "αγχωτικός, κουραστικός",
      "χαρούμενος, πρόσχαρος"
    ]
  },
  {
    "id": 256,
    "unit": 6,
    "word": "dexterity",
    "pos": "(n)",
    "category": "Skills and Abilities",
    "meaning": "επιδεξιότητα (χεριών/δακτύλων)",
    "distractors": [
      "ομιλία",
      "ικανότητα",
      "επικοινωνία"
    ]
  },
  {
    "id": 257,
    "unit": 6,
    "word": "dryer",
    "pos": "(n)",
    "category": "Tools and Equipment",
    "meaning": "σεσουάρ, στεγνωτήρας",
    "distractors": [
      "εργαλείο",
      "περμανάντ",
      "δαχτυλίδι"
    ]
  },
  {
    "id": 258,
    "unit": 6,
    "word": "earrings",
    "pos": "(n pl)",
    "category": "Tools and Equipment",
    "meaning": "σκουλαρίκια",
    "distractors": [
      "προστατευτικά γυαλιά",
      "πολύτιμοι λίθοι",
      "ξυράφια"
    ]
  },
  {
    "id": 259,
    "unit": 6,
    "word": "ecologist",
    "pos": "(n)",
    "category": "Professions and Careers",
    "meaning": "οικολόγος",
    "distractors": [
      "επάγγελμα (επιστημονικό/ειδικευμένο)",
      "μετεωρολόγος, προγνώστης καιρού",
      "νοσοκόμος, νοσηλευτής"
    ]
  },
  {
    "id": 260,
    "unit": 6,
    "word": "equipment",
    "pos": "(n unc)",
    "category": "Tools and Equipment",
    "meaning": "εξοπλισμός",
    "distractors": [
      "διατροφή",
      "γνώση",
      "μηχανήματα"
    ]
  },
  {
    "id": 261,
    "unit": 6,
    "word": "facilities",
    "pos": "(n pl)",
    "category": "Workplace and Environment",
    "meaning": "εγκαταστάσεις, διευκολύνσεις",
    "distractors": [
      "σωρός, πλήθος, πολλά",
      "κανόνες ασφαλείας",
      "διάδρομοι (μεταξύ ραφιών ή καθισμάτων)"
    ]
  },
  {
    "id": 262,
    "unit": 6,
    "word": "foreign languages",
    "pos": "(n pl)",
    "category": "School Subjects and Knowledge",
    "meaning": "ξένες γλώσσες",
    "distractors": [
      "ψαλίδι",
      "ξυράφια",
      "συνημμένα αρχεία"
    ]
  },
  {
    "id": 263,
    "unit": 6,
    "word": "goggles",
    "pos": "(n pl)",
    "category": "Tools and Equipment",
    "meaning": "προστατευτικά γυαλιά",
    "distractors": [
      "πολύτιμοι λίθοι",
      "ψαλίδι",
      "σκουλαρίκια"
    ]
  },
  {
    "id": 264,
    "unit": 6,
    "word": "hairdresser",
    "pos": "(n)",
    "category": "Professions and Careers",
    "meaning": "κομμωτής, κομμώτρια",
    "distractors": [
      "σχεδιαστής κοσμημάτων",
      "νοσοκόμος, νοσηλευτής",
      "ναυαγοσώστης"
    ]
  },
  {
    "id": 265,
    "unit": 6,
    "word": "handle",
    "pos": "(v)",
    "category": "Actions and Responsibilities",
    "meaning": "χειρίζομαι, διαχειρίζομαι",
    "distractors": [
      "απαιτώ, χρειάζομαι",
      "δημιουργώ",
      "ισιώνω"
    ]
  },
  {
    "id": 266,
    "unit": 6,
    "word": "independently",
    "pos": "(adv)",
    "category": "Actions and Responsibilities",
    "meaning": "ανεξάρτητα, αυτόνομα",
    "distractors": [
      "με σεβασμό",
      "σφουγγαρίστρα / σφουγγαρίζω",
      "ελαφρώς, λίγο"
    ]
  },
  {
    "id": 267,
    "unit": 6,
    "word": "jewellery designer",
    "pos": "(n)",
    "category": "Professions and Careers",
    "meaning": "σχεδιαστής κοσμημάτων",
    "distractors": [
      "υποψήφιος",
      "νοσοκόμος, νοσηλευτής",
      "μετεωρολόγος, προγνώστης καιρού"
    ]
  },
  {
    "id": 268,
    "unit": 6,
    "word": "knowledge",
    "pos": "(n unc)",
    "category": "School Subjects and Knowledge",
    "meaning": "γνώση",
    "distractors": [
      "εξοπλισμός",
      "διατροφή",
      "μηχανήματα"
    ]
  },
  {
    "id": 269,
    "unit": 6,
    "word": "lab",
    "pos": "(n)",
    "category": "Workplace and Environment",
    "meaning": "εργαστήριο",
    "distractors": [
      "ποικιλία",
      "ομάδα",
      "τοποθεσία"
    ]
  },
  {
    "id": 270,
    "unit": 6,
    "word": "lifeguard",
    "pos": "(n)",
    "category": "Professions and Careers",
    "meaning": "ναυαγοσώστης",
    "distractors": [
      "υποψήφιος",
      "νοσοκόμος, νοσηλευτής",
      "οικολόγος"
    ]
  },
  {
    "id": 271,
    "unit": 6,
    "word": "loads",
    "pos": "(n pl)",
    "category": "Workplace and Environment",
    "meaning": "σωρός, πλήθος, πολλά",
    "distractors": [
      "εγκαταστάσεις, διευκολύνσεις",
      "κανόνες ασφαλείας",
      "διάδρομοι (μεταξύ ραφιών ή καθισμάτων)"
    ]
  },
  {
    "id": 272,
    "unit": 6,
    "word": "location",
    "pos": "(n)",
    "category": "Workplace and Environment",
    "meaning": "τοποθεσία",
    "distractors": [
      "ποικιλία",
      "ασθενής",
      "βάρδια εργασίας"
    ]
  },
  {
    "id": 273,
    "unit": 6,
    "word": "machinery",
    "pos": "(n unc)",
    "category": "Tools and Equipment",
    "meaning": "μηχανήματα",
    "distractors": [
      "γνώση",
      "διατροφή",
      "εξοπλισμός"
    ]
  },
  {
    "id": 274,
    "unit": 6,
    "word": "necklace",
    "pos": "(n)",
    "category": "Tools and Equipment",
    "meaning": "κολιέ, περιδέραιο",
    "distractors": [
      "σεσουάρ, στεγνωτήρας",
      "εργαλείο",
      "περμανάντ"
    ]
  },
  {
    "id": 275,
    "unit": 6,
    "word": "nurse",
    "pos": "(n)",
    "category": "Professions and Careers",
    "meaning": "νοσοκόμος, νοσηλευτής",
    "distractors": [
      "σταδιοδρομία, καριέρα",
      "υποψήφιος",
      "σχεδιαστής κοσμημάτων"
    ]
  },
  {
    "id": 276,
    "unit": 6,
    "word": "nutrition",
    "pos": "(n unc)",
    "category": "School Subjects and Knowledge",
    "meaning": "διατροφή",
    "distractors": [
      "εξοπλισμός",
      "γνώση",
      "μηχανήματα"
    ]
  },
  {
    "id": 277,
    "unit": 6,
    "word": "occupation",
    "pos": "(n)",
    "category": "Professions and Careers",
    "meaning": "επάγγελμα",
    "distractors": [
      "ελεγκτής εναέριας κυκλοφορίας",
      "μετεωρολόγος, προγνώστης καιρού",
      "κομμωτής, κομμώτρια"
    ]
  },
  {
    "id": 278,
    "unit": 6,
    "word": "patient",
    "pos": "(n)",
    "category": "Workplace and Environment",
    "meaning": "ασθενής",
    "distractors": [
      "ποικιλία",
      "περιοχή, χώρος",
      "τοποθεσία"
    ]
  },
  {
    "id": 279,
    "unit": 6,
    "word": "perm",
    "pos": "(n, v)",
    "category": "Tools and Equipment",
    "meaning": "περμανάντ",
    "distractors": [
      "δαχτυλίδι",
      "κολιέ, περιδέραιο",
      "εργαλείο"
    ]
  },
  {
    "id": 280,
    "unit": 6,
    "word": "precious stones",
    "pos": "(n pl)",
    "category": "Tools and Equipment",
    "meaning": "πολύτιμοι λίθοι",
    "distractors": [
      "προστατευτικά γυαλιά",
      "σκουλαρίκια",
      "ψαλίδι"
    ]
  },
  {
    "id": 281,
    "unit": 6,
    "word": "prevent",
    "pos": "(v)",
    "category": "Actions and Responsibilities",
    "meaning": "προλαμβάνω, εμποδίζω",
    "distractors": [
      "ισιώνω",
      "δημιουργώ",
      "κατασκευάζω, χτίζω"
    ]
  },
  {
    "id": 282,
    "unit": 6,
    "word": "profession",
    "pos": "(n)",
    "category": "Professions and Careers",
    "meaning": "επάγγελμα (επιστημονικό/ειδικευμένο)",
    "distractors": [
      "μηχανικός αυτοκινήτων",
      "υποψήφιος",
      "επάγγελμα"
    ]
  },
  {
    "id": 283,
    "unit": 6,
    "word": "razors",
    "pos": "(n pl)",
    "category": "Tools and Equipment",
    "meaning": "ξυράφια",
    "distractors": [
      "ψαλίδι",
      "πολύτιμοι λίθοι",
      "σκουλαρίκια"
    ]
  },
  {
    "id": 284,
    "unit": 6,
    "word": "require",
    "pos": "(v)",
    "category": "Actions and Responsibilities",
    "meaning": "απαιτώ, χρειάζομαι",
    "distractors": [
      "προλαμβάνω, εμποδίζω",
      "δημιουργώ",
      "κατασκευάζω, χτίζω"
    ]
  },
  {
    "id": 285,
    "unit": 6,
    "word": "responsible",
    "pos": "(adj)",
    "category": "Personal Traits",
    "meaning": "υπεύθυνος",
    "distractors": [
      "δημιουργικός",
      "συμπονετικός",
      "αγχωτικός, κουραστικός"
    ]
  },
  {
    "id": 286,
    "unit": 6,
    "word": "ring",
    "pos": "(n)",
    "category": "Tools and Equipment",
    "meaning": "δαχτυλίδι",
    "distractors": [
      "περμανάντ",
      "εργαλείο",
      "σεσουάρ, στεγνωτήρας"
    ]
  },
  {
    "id": 287,
    "unit": 6,
    "word": "safety rules",
    "pos": "(n pl)",
    "category": "Workplace and Environment",
    "meaning": "κανόνες ασφαλείας",
    "distractors": [
      "εγκαταστάσεις, διευκολύνσεις",
      "σωρός, πλήθος, πολλά",
      "διάδρομοι (μεταξύ ραφιών ή καθισμάτων)"
    ]
  },
  {
    "id": 288,
    "unit": 6,
    "word": "schedule",
    "pos": "(n)",
    "category": "Workplace and Environment",
    "meaning": "χρονοδιάγραμμα, πρόγραμμα",
    "distractors": [
      "περιοχή, χώρος",
      "ασθενής",
      "τοποθεσία"
    ]
  },
  {
    "id": 289,
    "unit": 6,
    "word": "scissors",
    "pos": "(n pl)",
    "category": "Tools and Equipment",
    "meaning": "ψαλίδι",
    "distractors": [
      "πολύτιμοι λίθοι",
      "ξυράφια",
      "προστατευτικά γυαλιά"
    ]
  },
  {
    "id": 290,
    "unit": 6,
    "word": "self-assessment",
    "pos": "(n)",
    "category": "Skills and Abilities",
    "meaning": "αυτοαξιολόγηση",
    "distractors": [
      "δεξιότητα",
      "επικοινωνία",
      "συντονισμός (ματιού-χεριού κ.λπ.)"
    ]
  },
  {
    "id": 291,
    "unit": 6,
    "word": "self-confident",
    "pos": "(adj)",
    "category": "Personal Traits",
    "meaning": "με αυτοπεποίθηση",
    "distractors": [
      "συμπονετικός",
      "χαρούμενος, πρόσχαρος",
      "δημιουργικός"
    ]
  },
  {
    "id": 292,
    "unit": 6,
    "word": "shift",
    "pos": "(n)",
    "category": "Workplace and Environment",
    "meaning": "βάρδια εργασίας",
    "distractors": [
      "ποικιλία",
      "ασθενής",
      "περιοχή, χώρος"
    ]
  },
  {
    "id": 293,
    "unit": 6,
    "word": "skill",
    "pos": "(n)",
    "category": "Skills and Abilities",
    "meaning": "δεξιότητα",
    "distractors": [
      "προσοχή",
      "συντονισμός (ματιού-χεριού κ.λπ.)",
      "επιδεξιότητα (χεριών/δακτύλων)"
    ]
  },
  {
    "id": 294,
    "unit": 6,
    "word": "speech",
    "pos": "(n)",
    "category": "Skills and Abilities",
    "meaning": "ομιλία",
    "distractors": [
      "επικοινωνία",
      "επιδεξιότητα (χεριών/δακτύλων)",
      "δεξιότητα"
    ]
  },
  {
    "id": 295,
    "unit": 6,
    "word": "straighten",
    "pos": "(v)",
    "category": "Actions and Responsibilities",
    "meaning": "ισιώνω",
    "distractors": [
      "χειρίζομαι, διαχειρίζομαι",
      "κατασκευάζω, χτίζω",
      "απαιτώ, χρειάζομαι"
    ]
  },
  {
    "id": 296,
    "unit": 6,
    "word": "stressful",
    "pos": "(adj)",
    "category": "Personal Traits",
    "meaning": "αγχωτικός, κουραστικός",
    "distractors": [
      "δημιουργικός",
      "συμπονετικός",
      "γενναίος"
    ]
  },
  {
    "id": 297,
    "unit": 6,
    "word": "tamper",
    "pos": "(v phr)",
    "category": "Actions and Responsibilities",
    "meaning": "παραποιώ, πειράζω απρόσεκτα",
    "distractors": [
      "ακουμπώ πάνω σε, στηρίζομαι",
      "γεννώ αυγά",
      "φροντίζω, νοιάζομαι για"
    ]
  },
  {
    "id": 298,
    "unit": 6,
    "word": "team",
    "pos": "(n)",
    "category": "Workplace and Environment",
    "meaning": "ομάδα",
    "distractors": [
      "ποικιλία",
      "εργαστήριο",
      "χρονοδιάγραμμα, πρόγραμμα"
    ]
  },
  {
    "id": 299,
    "unit": 6,
    "word": "tool",
    "pos": "(n)",
    "category": "Tools and Equipment",
    "meaning": "εργαλείο",
    "distractors": [
      "περμανάντ",
      "σεσουάρ, στεγνωτήρας",
      "δαχτυλίδι"
    ]
  },
  {
    "id": 300,
    "unit": 6,
    "word": "variety",
    "pos": "(n)",
    "category": "Workplace and Environment",
    "meaning": "ποικιλία",
    "distractors": [
      "χρονοδιάγραμμα, πρόγραμμα",
      "τοποθεσία",
      "εργαστήριο"
    ]
  },
  {
    "id": 301,
    "unit": 6,
    "word": "volunteer",
    "pos": "(n, v)",
    "category": "Professions and Careers",
    "meaning": "εθελοντής, προσφέρω εθελοντικά",
    "distractors": [
      "επάγγελμα (επιστημονικό/ειδικευμένο)",
      "υποψήφιος",
      "ελεγκτής εναέριας κυκλοφορίας"
    ]
  },
  {
    "id": 302,
    "unit": 6,
    "word": "weather forecaster",
    "pos": "(n)",
    "category": "Professions and Careers",
    "meaning": "μετεωρολόγος, προγνώστης καιρού",
    "distractors": [
      "οικολόγος",
      "ναυαγοσώστης",
      "ελεγκτής εναέριας κυκλοφορίας"
    ]
  },
  {
    "id": 303,
    "unit": 6,
    "word": "well trained",
    "pos": "(adj)",
    "category": "Skills and Abilities",
    "meaning": "καλά εκπαιδευμένος",
    "distractors": [
      "καλλιτεχνικός",
      "απαρατήρητος",
      "ανήσυχος, αγχωμένος"
    ]
  },
  {
    "id": 304,
    "unit": 7,
    "word": "accomplishment",
    "pos": "",
    "category": "",
    "meaning": "επίτευγμα, κατόρθωμα",
    "distractors": [
      "χαρτζιλίκι",
      "περίπου",
      "αγώνισμα, εκδήλωση"
    ]
  },
  {
    "id": 305,
    "unit": 7,
    "word": "achievement",
    "pos": "",
    "category": "",
    "meaning": "επίτευγμα",
    "distractors": [
      "κουνάβι (ως κατοικίδιο)",
      "διαγωνισμός",
      "ρυθμός"
    ]
  },
  {
    "id": 306,
    "unit": 7,
    "word": "among",
    "pos": "",
    "category": "",
    "meaning": "ανάμεσα σε",
    "distractors": [
      "παραδοσιακή μουσική",
      "σπαταλώ",
      "καταφύγιο (άγριας ζωής)"
    ]
  },
  {
    "id": 307,
    "unit": 7,
    "word": "antiquity",
    "pos": "",
    "category": "",
    "meaning": "αρχαιότητα",
    "distractors": [
      "εκπαιδευτικός",
      "εκθαμβωτικός, λαμπερός",
      "λύκος"
    ]
  },
  {
    "id": 308,
    "unit": 7,
    "word": "backstroke",
    "pos": "",
    "category": "",
    "meaning": "ύπτιο (κολύμβηση)",
    "distractors": [
      "μιούζικαλ (μουσικό θέατρο)",
      "τρομπέτα",
      "ψυχαγωγία, διασκέδαση"
    ]
  },
  {
    "id": 309,
    "unit": 7,
    "word": "beat",
    "pos": "",
    "category": "",
    "meaning": "νικώ, ξεπερνώ (ρεκόρ)",
    "distractors": [
      "μακροχρόνιος, που παίζεται καιρό",
      "λύκος",
      "είδη ατομικής υγιεινής / καθαριότητας"
    ]
  },
  {
    "id": 310,
    "unit": 7,
    "word": "billion",
    "pos": "",
    "category": "",
    "meaning": "δισεκατομμύριο",
    "distractors": [
      "δουλειά του σπιτιού, αγγαρεία",
      "σκηνή θεάτρου",
      "κατάμεστο κοινό"
    ]
  },
  {
    "id": 311,
    "unit": 7,
    "word": "board",
    "pos": "",
    "category": "",
    "meaning": "επιβιβάζομαι",
    "distractors": [
      "χαρτζιλίκι",
      "φωνητικός",
      "ομάδα σκυταλοδρομίας"
    ]
  },
  {
    "id": 312,
    "unit": 7,
    "word": "breaststroke",
    "pos": "",
    "category": "",
    "meaning": "πρόσθιο (κολύμβηση)",
    "distractors": [
      "πηγή",
      "διαγωνισμός, αγώνας",
      "διαφημιστικό φυλλάδιο"
    ]
  },
  {
    "id": 313,
    "unit": 7,
    "word": "butterfly",
    "pos": "",
    "category": "",
    "meaning": "πεταλούδα (κολύμβηση)",
    "distractors": [
      "αιχμαλωτίζω, γοητεύω",
      "κυριαρχώ",
      "παρέχω, προσφέρω"
    ]
  },
  {
    "id": 314,
    "unit": 7,
    "word": "captivate",
    "pos": "",
    "category": "",
    "meaning": "αιχμαλωτίζω, γοητεύω",
    "distractors": [
      "συνήθεια",
      "βιολί",
      "όμποε"
    ]
  },
  {
    "id": 315,
    "unit": 7,
    "word": "champion",
    "pos": "",
    "category": "",
    "meaning": "πρωταθλητής",
    "distractors": [
      "δίνω παράσταση, ερμηνεύω",
      "όμποε",
      "γίνομαι μάρτυρας, βλέπω με τα μάτια μου"
    ]
  },
  {
    "id": 316,
    "unit": 7,
    "word": "comedy",
    "pos": "",
    "category": "",
    "meaning": "κωμωδία",
    "distractors": [
      "χώρος εκδήλωσης",
      "πηγή",
      "γενιά"
    ]
  },
  {
    "id": 317,
    "unit": 7,
    "word": "compare",
    "pos": "",
    "category": "",
    "meaning": "συγκρίνω",
    "distractors": [
      "καταφύγιο (άγριας ζωής)",
      "πρωταθλητής",
      "απλά, απλώς"
    ]
  },
  {
    "id": 318,
    "unit": 7,
    "word": "compete",
    "pos": "",
    "category": "",
    "meaning": "διαγωνίζομαι, συναγωνίζομαι",
    "distractors": [
      "γίνομαι μάρτυρας, βλέπω με τα μάτια μου",
      "επίτευγμα",
      "ταινία, κινηματογραφικό έργο"
    ]
  },
  {
    "id": 319,
    "unit": 7,
    "word": "competition",
    "pos": "",
    "category": "",
    "meaning": "διαγωνισμός, αγώνας",
    "distractors": [
      "παραμύθι",
      "συνθέτης",
      "λογαριασμός"
    ]
  },
  {
    "id": 320,
    "unit": 7,
    "word": "composer",
    "pos": "",
    "category": "",
    "meaning": "συνθέτης",
    "distractors": [
      "ταυτόχρονα",
      "όμποε",
      "χαρτζιλίκι"
    ]
  },
  {
    "id": 321,
    "unit": 7,
    "word": "contest",
    "pos": "",
    "category": "",
    "meaning": "διαγωνισμός",
    "distractors": [
      "όμποε",
      "ταινία, κινηματογραφικό έργο",
      "αρμονία"
    ]
  },
  {
    "id": 322,
    "unit": 7,
    "word": "destination",
    "pos": "",
    "category": "",
    "meaning": "προορισμός",
    "distractors": [
      "σουβλάκι (ξυλάκι / καλαμάκι)",
      "είδη ατομικής υγιεινής / καθαριότητας",
      "μήκος, διάρκεια"
    ]
  },
  {
    "id": 323,
    "unit": 7,
    "word": "dominate",
    "pos": "",
    "category": "",
    "meaning": "κυριαρχώ",
    "distractors": [
      "ταυτόχρονα",
      "συγκρίνω",
      "όμποε"
    ]
  },
  {
    "id": 324,
    "unit": 7,
    "word": "drama",
    "pos": "",
    "category": "",
    "meaning": "δράμα, θεατρικό έργο",
    "distractors": [
      "κάτοχος (ρεκόρ)",
      "συνοδοί (σε σχολική εκδρομή / εκδήλωση)",
      "αρχαιότητα"
    ]
  },
  {
    "id": 325,
    "unit": 7,
    "word": "earn",
    "pos": "",
    "category": "",
    "meaning": "κερδίζω επάξια, αποκτώ",
    "distractors": [
      "οργανικός (μουσική μόνο με όργανα)",
      "πλούσιος, εύπορος",
      "γενιά"
    ]
  },
  {
    "id": 326,
    "unit": 7,
    "word": "entertainment",
    "pos": "",
    "category": "",
    "meaning": "ψυχαγωγία, διασκέδαση",
    "distractors": [
      "παραγωγή, θεατρικό ανέβασμα",
      "μουσικό όργανο",
      "συνήθεια"
    ]
  },
  {
    "id": 327,
    "unit": 7,
    "word": "event",
    "pos": "",
    "category": "",
    "meaning": "αγώνισμα, εκδήλωση",
    "distractors": [
      "ανυπομονώ για",
      "πρόσθιο (κολύμβηση)",
      "μήκος, διάρκεια"
    ]
  },
  {
    "id": 328,
    "unit": 7,
    "word": "exceptional",
    "pos": "",
    "category": "",
    "meaning": "εξαιρετικός, σπάνιος",
    "distractors": [
      "είδη ατομικής υγιεινής / καθαριότητας",
      "διαφημιστικό φυλλάδιο",
      "λύκος"
    ]
  },
  {
    "id": 329,
    "unit": 7,
    "word": "freestyle",
    "pos": "",
    "category": "",
    "meaning": "ελεύθερο (κολύμβηση)",
    "distractors": [
      "παθιασμένος, γεμάτος πάθος",
      "Παραολυμπιακοί Αγώνες",
      "στίχοι τραγουδιού"
    ]
  },
  {
    "id": 330,
    "unit": 7,
    "word": "ferret",
    "pos": "",
    "category": "",
    "meaning": "κουνάβι (ως κατοικίδιο)",
    "distractors": [
      "χαρτζιλίκι, επίδομα",
      "διαγωνίζομαι, συναγωνίζομαι",
      "διαγωνισμός"
    ]
  },
  {
    "id": 331,
    "unit": 7,
    "word": "figure",
    "pos": "",
    "category": "",
    "meaning": "αριθμός, νούμερο",
    "distractors": [
      "νικώ, ξεπερνώ (ρεκόρ)",
      "ύπτιο (κολύμβηση)",
      "Παραολυμπιακοί Αγώνες"
    ]
  },
  {
    "id": 332,
    "unit": 7,
    "word": "gold medal",
    "pos": "",
    "category": "",
    "meaning": "χρυσό μετάλλιο",
    "distractors": [
      "καταναλωτής",
      "διαγωνίζομαι, συναγωνίζομαι",
      "κωμωδία"
    ]
  },
  {
    "id": 333,
    "unit": 7,
    "word": "habit",
    "pos": "",
    "category": "",
    "meaning": "συνήθεια",
    "distractors": [
      "αερόστατο θερμού αέρα",
      "πλούσιος, εύπορος",
      "παραμύθι"
    ]
  },
  {
    "id": 334,
    "unit": 7,
    "word": "holder",
    "pos": "",
    "category": "",
    "meaning": "κάτοχος (ρεκόρ)",
    "distractors": [
      "διαγωνισμός",
      "επιτυχία",
      "λογαριασμός"
    ]
  },
  {
    "id": 335,
    "unit": 7,
    "word": "hot-air balloon",
    "pos": "",
    "category": "",
    "meaning": "αερόστατο θερμού αέρα",
    "distractors": [
      "ταυτόχρονα",
      "εκατομμυριούχος",
      "χαρτζιλίκι"
    ]
  },
  {
    "id": 336,
    "unit": 7,
    "word": "imagination",
    "pos": "",
    "category": "",
    "meaning": "φαντασία",
    "distractors": [
      "παθιασμένος, γεμάτος πάθος",
      "παραδοσιακή μουσική",
      "περίπου"
    ]
  },
  {
    "id": 337,
    "unit": 7,
    "word": "long-running",
    "pos": "",
    "category": "",
    "meaning": "μακροχρόνιος, που παίζεται καιρό",
    "distractors": [
      "εισόδημα",
      "χαρτζιλίκι",
      "πείθω"
    ]
  },
  {
    "id": 338,
    "unit": 7,
    "word": "movie",
    "pos": "",
    "category": "",
    "meaning": "ταινία, κινηματογραφικό έργο",
    "distractors": [
      "κυριαρχώ",
      "πλούσιος, εύπορος",
      "περίπου"
    ]
  },
  {
    "id": 339,
    "unit": 7,
    "word": "musical",
    "pos": "",
    "category": "",
    "meaning": "μιούζικαλ (μουσικό θέατρο)",
    "distractors": [
      "στίχοι τραγουδιού",
      "κωμωδία",
      "τρομπέτα"
    ]
  },
  {
    "id": 340,
    "unit": 7,
    "word": "nickname",
    "pos": "",
    "category": "",
    "meaning": "παρατσούκλι",
    "distractors": [
      "ρεφρέν, χορωδία",
      "μουσικό όργανο",
      "χαρτζιλίκι, επίδομα"
    ]
  },
  {
    "id": 341,
    "unit": 7,
    "word": "originally",
    "pos": "",
    "category": "",
    "meaning": "αρχικά",
    "distractors": [
      "μιούζικαλ (μουσικό θέατρο)",
      "ύπτιο (κολύμβηση)",
      "χρωστώ"
    ]
  },
  {
    "id": 342,
    "unit": 7,
    "word": "packed audience",
    "pos": "",
    "category": "",
    "meaning": "κατάμεστο κοινό",
    "distractors": [
      "ταυτόχρονα",
      "αριθμός, νούμερο",
      "παρασκήνιο, υπόβαθρο, φόντο"
    ]
  },
  {
    "id": 343,
    "unit": 7,
    "word": "Paralympics",
    "pos": "",
    "category": "",
    "meaning": "Παραολυμπιακοί Αγώνες",
    "distractors": [
      "παρασκήνιο, υπόβαθρο, φόντο",
      "κάτοχος (ρεκόρ)",
      "στροφή (τραγουδιού / ποιήματος)"
    ]
  },
  {
    "id": 344,
    "unit": 7,
    "word": "pet",
    "pos": "",
    "category": "",
    "meaning": "κατοικίδιο ζώο",
    "distractors": [
      "καταφύγιο (άγριας ζωής)",
      "κωμωδία",
      "προέρχομαι, κατάγομαι"
    ]
  },
  {
    "id": 345,
    "unit": 7,
    "word": "post-show",
    "pos": "",
    "category": "",
    "meaning": "μετά την παράσταση",
    "distractors": [
      "ταυτόχρονα",
      "παραδοσιακή μουσική",
      "πνευστά (μουσικά όργανα)"
    ]
  },
  {
    "id": 346,
    "unit": 7,
    "word": "production",
    "pos": "",
    "category": "",
    "meaning": "παραγωγή, θεατρικό ανέβασμα",
    "distractors": [
      "ανυπομονώ για",
      "αναβιώνω, ξαναζωντανεύω",
      "επιβιβάζομαι"
    ]
  },
  {
    "id": 347,
    "unit": 7,
    "word": "recycling bank",
    "pos": "",
    "category": "",
    "meaning": "κάδος / σταθμός ανακύκλωσης",
    "distractors": [
      "γίνομαι μάρτυρας, βλέπω με τα μάτια μου",
      "μιούζικαλ (μουσικό θέατρο)",
      "εξαιρετικός, σπάνιος"
    ]
  },
  {
    "id": 348,
    "unit": 7,
    "word": "relay team",
    "pos": "",
    "category": "",
    "meaning": "ομάδα σκυταλοδρομίας",
    "distractors": [
      "διαγωνισμός, αγώνας",
      "χώρος εκδήλωσης",
      "είδη ατομικής υγιεινής / καθαριότητας"
    ]
  },
  {
    "id": 349,
    "unit": 7,
    "word": "review",
    "pos": "",
    "category": "",
    "meaning": "κριτική (θεάτρου, βιβλίου)",
    "distractors": [
      "λογαριασμός",
      "πρωταθλητής",
      "μελωδία"
    ]
  },
  {
    "id": 350,
    "unit": 7,
    "word": "revive",
    "pos": "",
    "category": "",
    "meaning": "αναβιώνω, ξαναζωντανεύω",
    "distractors": [
      "αριθμός, νούμερο",
      "ανυπομονώ για",
      "μήκος, διάρκεια"
    ]
  },
  {
    "id": 351,
    "unit": 7,
    "word": "sanctuary",
    "pos": "",
    "category": "",
    "meaning": "καταφύγιο (άγριας ζωής)",
    "distractors": [
      "εμπνέω",
      "ανάμεσα σε",
      "δισεκατομμύριο"
    ]
  },
  {
    "id": 352,
    "unit": 7,
    "word": "simultaneously",
    "pos": "",
    "category": "",
    "meaning": "ταυτόχρονα",
    "distractors": [
      "ρυθμός",
      "παραγωγή, θεατρικό ανέβασμα",
      "αερόστατο θερμού αέρα"
    ]
  },
  {
    "id": 353,
    "unit": 7,
    "word": "skewer",
    "pos": "",
    "category": "",
    "meaning": "σουβλάκι (ξυλάκι / καλαμάκι)",
    "distractors": [
      "συνθέτης",
      "ρυθμός",
      "κιθάρα"
    ]
  },
  {
    "id": 354,
    "unit": 7,
    "word": "success",
    "pos": "",
    "category": "",
    "meaning": "επιτυχία",
    "distractors": [
      "κουνάβι (ως κατοικίδιο)",
      "πρόσθιο (κολύμβηση)",
      "τρομπέτα"
    ]
  },
  {
    "id": 355,
    "unit": 7,
    "word": "witness",
    "pos": "",
    "category": "",
    "meaning": "γίνομαι μάρτυρας, βλέπω με τα μάτια μου",
    "distractors": [
      "εγγράφομαι, καταγράφω",
      "συγχωρώ",
      "κουνάβι (ως κατοικίδιο)"
    ]
  },
  {
    "id": 356,
    "unit": 8,
    "word": "adaptation",
    "pos": "",
    "category": "",
    "meaning": "διασκευή (έργου / ιστορίας)",
    "distractors": [
      "εισόδημα",
      "αριθμός, νούμερο",
      "χορδή (οργάνου)"
    ]
  },
  {
    "id": 357,
    "unit": 8,
    "word": "allowance",
    "pos": "",
    "category": "",
    "meaning": "χαρτζιλίκι, επίδομα",
    "distractors": [
      "φωνητικός",
      "συνήθεια",
      "παραγωγή, θεατρικό ανέβασμα"
    ]
  },
  {
    "id": 358,
    "unit": 8,
    "word": "approximately",
    "pos": "",
    "category": "",
    "meaning": "περίπου",
    "distractors": [
      "κράτηση (θέσης)",
      "προορισμός",
      "ρυθμός"
    ]
  },
  {
    "id": 359,
    "unit": 8,
    "word": "artist",
    "pos": "",
    "category": "",
    "meaning": "καλλιτέχνης",
    "distractors": [
      "πνευστά (μουσικά όργανα)",
      "εμπνέω",
      "επίτευγμα, κατόρθωμα"
    ]
  },
  {
    "id": 360,
    "unit": 8,
    "word": "attend",
    "pos": "",
    "category": "",
    "meaning": "παρακολουθώ, πηγαίνω σε",
    "distractors": [
      "μιούζικαλ (μουσικό θέατρο)",
      "στροφή (τραγουδιού / ποιήματος)",
      "προορισμός"
    ]
  },
  {
    "id": 361,
    "unit": 8,
    "word": "background",
    "pos": "",
    "category": "",
    "meaning": "παρασκήνιο, υπόβαθρο, φόντο",
    "distractors": [
      "συνθέτης",
      "παραδοσιακή μουσική",
      "φαντασία"
    ]
  },
  {
    "id": 362,
    "unit": 8,
    "word": "band",
    "pos": "",
    "category": "",
    "meaning": "μουσικό συγκρότημα",
    "distractors": [
      "πηγή",
      "ψυχαγωγία, διασκέδαση",
      "διαγωνίζομαι, συναγωνίζομαι"
    ]
  },
  {
    "id": 363,
    "unit": 8,
    "word": "bill",
    "pos": "",
    "category": "",
    "meaning": "λογαριασμός",
    "distractors": [
      "μελωδία",
      "βιολί",
      "αρχαιότητα"
    ]
  },
  {
    "id": 364,
    "unit": 8,
    "word": "brochure",
    "pos": "",
    "category": "",
    "meaning": "διαφημιστικό φυλλάδιο",
    "distractors": [
      "συνθέτης",
      "επίτευγμα",
      "κριτική (θεάτρου, βιβλίου)"
    ]
  },
  {
    "id": 365,
    "unit": 8,
    "word": "chaperones",
    "pos": "",
    "category": "",
    "meaning": "συνοδοί (σε σχολική εκδρομή / εκδήλωση)",
    "distractors": [
      "απλά, απλώς",
      "ρυθμός",
      "κάτοχος (ρεκόρ)"
    ]
  },
  {
    "id": 366,
    "unit": 8,
    "word": "chore",
    "pos": "",
    "category": "",
    "meaning": "δουλειά του σπιτιού, αγγαρεία",
    "distractors": [
      "εισόδημα",
      "μετά την παράσταση",
      "ανάμεσα σε"
    ]
  },
  {
    "id": 367,
    "unit": 8,
    "word": "chorus",
    "pos": "",
    "category": "",
    "meaning": "ρεφρέν, χορωδία",
    "distractors": [
      "ψυχαγωγία, διασκέδαση",
      "μακροχρόνιος, που παίζεται καιρό",
      "δισεκατομμύριο"
    ]
  },
  {
    "id": 368,
    "unit": 8,
    "word": "consumer",
    "pos": "",
    "category": "",
    "meaning": "καταναλωτής",
    "distractors": [
      "συνθέτης",
      "ενοχλώ, ζαλίζω (με απαιτήσεις)",
      "χαρτζιλίκι, επίδομα"
    ]
  },
  {
    "id": 369,
    "unit": 8,
    "word": "dazzling",
    "pos": "",
    "category": "",
    "meaning": "εκθαμβωτικός, λαμπερός",
    "distractors": [
      "εκπαιδευτικός",
      "διαγωνίζομαι, συναγωνίζομαι",
      "χαρτζιλίκι"
    ]
  },
  {
    "id": 370,
    "unit": 8,
    "word": "downtown",
    "pos": "",
    "category": "",
    "meaning": "κέντρο της πόλης",
    "distractors": [
      "πρόσθιο (κολύμβηση)",
      "διαφημιστικό φυλλάδιο",
      "παρασκήνιο, υπόβαθρο, φόντο"
    ]
  },
  {
    "id": 371,
    "unit": 8,
    "word": "drum",
    "pos": "",
    "category": "",
    "meaning": "τύμπανο",
    "distractors": [
      "κράτηση (θέσης)",
      "αναβιώνω, ξαναζωντανεύω",
      "εκθαμβωτικός, λαμπερός"
    ]
  },
  {
    "id": 372,
    "unit": 8,
    "word": "educational",
    "pos": "",
    "category": "",
    "meaning": "εκπαιδευτικός",
    "distractors": [
      "εισόδημα",
      "συγκρίνω",
      "παρασκήνιο, υπόβαθρο, φόντο"
    ]
  },
  {
    "id": 373,
    "unit": 8,
    "word": "fairy tale",
    "pos": "",
    "category": "",
    "meaning": "παραμύθι",
    "distractors": [
      "καταναλωτής",
      "χρυσό μετάλλιο",
      "μουσικό όργανο"
    ]
  },
  {
    "id": 374,
    "unit": 8,
    "word": "folk music",
    "pos": "",
    "category": "",
    "meaning": "παραδοσιακή μουσική",
    "distractors": [
      "νικώ, ξεπερνώ (ρεκόρ)",
      "πείθω",
      "ρυθμός"
    ]
  },
  {
    "id": 375,
    "unit": 8,
    "word": "forgive",
    "pos": "",
    "category": "",
    "meaning": "συγχωρώ",
    "distractors": [
      "λύκος",
      "βιολί",
      "μελωδία"
    ]
  },
  {
    "id": 376,
    "unit": 8,
    "word": "generation",
    "pos": "",
    "category": "",
    "meaning": "γενιά",
    "distractors": [
      "κέντρο της πόλης",
      "κατάμεστο κοινό",
      "μουσικό συγκρότημα"
    ]
  },
  {
    "id": 377,
    "unit": 8,
    "word": "guitar",
    "pos": "",
    "category": "",
    "meaning": "κιθάρα",
    "distractors": [
      "ανυπομονώ για",
      "αρχαιότητα",
      "επιβιβάζομαι"
    ]
  },
  {
    "id": 378,
    "unit": 8,
    "word": "handouts",
    "pos": "",
    "category": "",
    "meaning": "φυλλάδια σημειώσεων",
    "distractors": [
      "συνοδοί (σε σχολική εκδρομή / εκδήλωση)",
      "χώρος εκδήλωσης",
      "γίνομαι μάρτυρας, βλέπω με τα μάτια μου"
    ]
  },
  {
    "id": 379,
    "unit": 8,
    "word": "harmony",
    "pos": "",
    "category": "",
    "meaning": "αρμονία",
    "distractors": [
      "περίπου",
      "προέρχομαι, κατάγομαι",
      "συγκρίνω"
    ]
  },
  {
    "id": 380,
    "unit": 8,
    "word": "income",
    "pos": "",
    "category": "",
    "meaning": "εισόδημα",
    "distractors": [
      "δουλειά του σπιτιού, αγγαρεία",
      "παράσταση, εκτέλεση",
      "λύκος"
    ]
  },
  {
    "id": 381,
    "unit": 8,
    "word": "inspire",
    "pos": "",
    "category": "",
    "meaning": "εμπνέω",
    "distractors": [
      "παρακολουθώ, πηγαίνω σε",
      "πεταλούδα (κολύμβηση)",
      "πνευστά (μουσικά όργανα)"
    ]
  },
  {
    "id": 382,
    "unit": 8,
    "word": "instructor",
    "pos": "",
    "category": "",
    "meaning": "εκπαιδευτής, δάσκαλος",
    "distractors": [
      "αιχμαλωτίζω, γοητεύω",
      "μετά την παράσταση",
      "εμπνέω"
    ]
  },
  {
    "id": 383,
    "unit": 8,
    "word": "instrument",
    "pos": "",
    "category": "",
    "meaning": "μουσικό όργανο",
    "distractors": [
      "προορισμός",
      "πρόσθιο (κολύμβηση)",
      "συνθέτης"
    ]
  },
  {
    "id": 384,
    "unit": 8,
    "word": "instrumental",
    "pos": "",
    "category": "",
    "meaning": "οργανικός (μουσική μόνο με όργανα)",
    "distractors": [
      "μιούζικαλ (μουσικό θέατρο)",
      "μουσικό όργανο",
      "μήκος, διάρκεια"
    ]
  },
  {
    "id": 385,
    "unit": 8,
    "word": "intelligent",
    "pos": "",
    "category": "",
    "meaning": "έξυπνος, ευφυής",
    "distractors": [
      "φυλλάδια σημειώσεων",
      "παραδοσιακή μουσική",
      "παράσταση, εκτέλεση"
    ]
  },
  {
    "id": 386,
    "unit": 8,
    "word": "length",
    "pos": "",
    "category": "",
    "meaning": "μήκος, διάρκεια",
    "distractors": [
      "μετά την παράσταση",
      "ταυτόχρονα",
      "εισόδημα"
    ]
  },
  {
    "id": 387,
    "unit": 8,
    "word": "look forward to",
    "pos": "",
    "category": "",
    "meaning": "ανυπομονώ για",
    "distractors": [
      "τύμπανο",
      "αρχικά",
      "μουσικό συγκρότημα"
    ]
  },
  {
    "id": 388,
    "unit": 8,
    "word": "lyrics",
    "pos": "",
    "category": "",
    "meaning": "στίχοι τραγουδιού",
    "distractors": [
      "καταναλωτής",
      "εμπνέω",
      "καλλιτέχνης"
    ]
  },
  {
    "id": 389,
    "unit": 8,
    "word": "melody",
    "pos": "",
    "category": "",
    "meaning": "μελωδία",
    "distractors": [
      "κωμωδία",
      "απλά, απλώς",
      "παθιασμένος, γεμάτος πάθος"
    ]
  },
  {
    "id": 390,
    "unit": 8,
    "word": "millionaire",
    "pos": "",
    "category": "",
    "meaning": "εκατομμυριούχος",
    "distractors": [
      "διαγωνίζομαι, συναγωνίζομαι",
      "στροφή (τραγουδιού / ποιήματος)",
      "ανυπομονώ για"
    ]
  },
  {
    "id": 391,
    "unit": 8,
    "word": "oboe",
    "pos": "",
    "category": "",
    "meaning": "όμποε",
    "distractors": [
      "ανυπομονώ για",
      "σπαταλώ",
      "έρευνα"
    ]
  },
  {
    "id": 392,
    "unit": 8,
    "word": "originate",
    "pos": "",
    "category": "",
    "meaning": "προέρχομαι, κατάγομαι",
    "distractors": [
      "παραδοσιακή μουσική",
      "δίνω παράσταση, ερμηνεύω",
      "βιολί"
    ]
  },
  {
    "id": 393,
    "unit": 8,
    "word": "owe",
    "pos": "",
    "category": "",
    "meaning": "χρωστώ",
    "distractors": [
      "αριθμός, νούμερο",
      "καλλιτέχνης",
      "παρασκήνιο, υπόβαθρο, φόντο"
    ]
  },
  {
    "id": 394,
    "unit": 8,
    "word": "passionate",
    "pos": "",
    "category": "",
    "meaning": "παθιασμένος, γεμάτος πάθος",
    "distractors": [
      "πλούσιος, εύπορος",
      "συνήθεια",
      "διασκευή (έργου / ιστορίας)"
    ]
  },
  {
    "id": 395,
    "unit": 8,
    "word": "percussion",
    "pos": "",
    "category": "",
    "meaning": "κρουστά (μουσικά όργανα)",
    "distractors": [
      "κάδος / σταθμός ανακύκλωσης",
      "είδη ατομικής υγιεινής / καθαριότητας",
      "μουσικό συγκρότημα"
    ]
  },
  {
    "id": 396,
    "unit": 8,
    "word": "performance",
    "pos": "",
    "category": "",
    "meaning": "παράσταση, εκτέλεση",
    "distractors": [
      "γίνομαι μάρτυρας, βλέπω με τα μάτια μου",
      "χαρτζιλίκι, επίδομα",
      "πείθω"
    ]
  },
  {
    "id": 397,
    "unit": 8,
    "word": "perform",
    "pos": "",
    "category": "",
    "meaning": "δίνω παράσταση, ερμηνεύω",
    "distractors": [
      "κωμωδία",
      "κατοικίδιο ζώο",
      "περίπου"
    ]
  },
  {
    "id": 398,
    "unit": 8,
    "word": "persuade",
    "pos": "",
    "category": "",
    "meaning": "πείθω",
    "distractors": [
      "κατοικίδιο ζώο",
      "μελωδία",
      "φαντασία"
    ]
  },
  {
    "id": 399,
    "unit": 8,
    "word": "pester",
    "pos": "",
    "category": "",
    "meaning": "ενοχλώ, ζαλίζω (με απαιτήσεις)",
    "distractors": [
      "καταφύγιο (άγριας ζωής)",
      "κυριαρχώ",
      "όμποε"
    ]
  },
  {
    "id": 400,
    "unit": 8,
    "word": "pocket money",
    "pos": "",
    "category": "",
    "meaning": "χαρτζιλίκι",
    "distractors": [
      "διαφημιστικό φυλλάδιο",
      "πρόσθιο (κολύμβηση)",
      "πρωταθλητής"
    ]
  },
  {
    "id": 401,
    "unit": 8,
    "word": "provide",
    "pos": "",
    "category": "",
    "meaning": "παρέχω, προσφέρω",
    "distractors": [
      "τρομπέτα",
      "αιχμαλωτίζω, γοητεύω",
      "πρωταθλητής"
    ]
  },
  {
    "id": 402,
    "unit": 8,
    "word": "register",
    "pos": "",
    "category": "",
    "meaning": "εγγράφομαι, καταγράφω",
    "distractors": [
      "καλλιτέχνης",
      "κωμωδία",
      "ενοχλώ, ζαλίζω (με απαιτήσεις)"
    ]
  },
  {
    "id": 403,
    "unit": 8,
    "word": "research",
    "pos": "",
    "category": "",
    "meaning": "έρευνα",
    "distractors": [
      "πείθω",
      "καταφύγιο (άγριας ζωής)",
      "σκηνή θεάτρου"
    ]
  },
  {
    "id": 404,
    "unit": 8,
    "word": "reservation",
    "pos": "",
    "category": "",
    "meaning": "κράτηση (θέσης)",
    "distractors": [
      "συνθέτης",
      "συγχωρώ",
      "επιβιβάζομαι"
    ]
  },
  {
    "id": 405,
    "unit": 8,
    "word": "rhythm",
    "pos": "",
    "category": "",
    "meaning": "ρυθμός",
    "distractors": [
      "αρμονία",
      "συγχωρώ",
      "παραγωγή, θεατρικό ανέβασμα"
    ]
  },
  {
    "id": 406,
    "unit": 8,
    "word": "simply",
    "pos": "",
    "category": "",
    "meaning": "απλά, απλώς",
    "distractors": [
      "μελωδία",
      "διαγωνισμός, αγώνας",
      "διασκευή (έργου / ιστορίας)"
    ]
  },
  {
    "id": 407,
    "unit": 8,
    "word": "source",
    "pos": "",
    "category": "",
    "meaning": "πηγή",
    "distractors": [
      "κριτική (θεάτρου, βιβλίου)",
      "φωνητικός",
      "μελωδία"
    ]
  },
  {
    "id": 408,
    "unit": 8,
    "word": "stage",
    "pos": "",
    "category": "",
    "meaning": "σκηνή θεάτρου",
    "distractors": [
      "χαρτζιλίκι",
      "περίπου",
      "φωνητικός"
    ]
  },
  {
    "id": 409,
    "unit": 8,
    "word": "string",
    "pos": "",
    "category": "",
    "meaning": "χορδή (οργάνου)",
    "distractors": [
      "παράσταση, εκτέλεση",
      "δισεκατομμύριο",
      "παρατσούκλι"
    ]
  },
  {
    "id": 410,
    "unit": 8,
    "word": "toiletries",
    "pos": "",
    "category": "",
    "meaning": "είδη ατομικής υγιεινής / καθαριότητας",
    "distractors": [
      "εισόδημα",
      "Παραολυμπιακοί Αγώνες",
      "κριτική (θεάτρου, βιβλίου)"
    ]
  },
  {
    "id": 411,
    "unit": 8,
    "word": "trumpet",
    "pos": "",
    "category": "",
    "meaning": "τρομπέτα",
    "distractors": [
      "συγκρίνω",
      "κιθάρα",
      "καταναλωτής"
    ]
  },
  {
    "id": 412,
    "unit": 8,
    "word": "trust",
    "pos": "",
    "category": "",
    "meaning": "εμπιστεύομαι",
    "distractors": [
      "αριθμός, νούμερο",
      "κυριαρχώ",
      "στίχοι τραγουδιού"
    ]
  },
  {
    "id": 413,
    "unit": 8,
    "word": "venue",
    "pos": "",
    "category": "",
    "meaning": "χώρος εκδήλωσης",
    "distractors": [
      "συνοδοί (σε σχολική εκδρομή / εκδήλωση)",
      "χρυσό μετάλλιο",
      "εμπιστεύομαι"
    ]
  },
  {
    "id": 414,
    "unit": 8,
    "word": "verse",
    "pos": "",
    "category": "",
    "meaning": "στροφή (τραγουδιού / ποιήματος)",
    "distractors": [
      "συγκρίνω",
      "ομάδα σκυταλοδρομίας",
      "εμπιστεύομαι"
    ]
  },
  {
    "id": 415,
    "unit": 8,
    "word": "violin",
    "pos": "",
    "category": "",
    "meaning": "βιολί",
    "distractors": [
      "συγχωρώ",
      "καταφύγιο (άγριας ζωής)",
      "διαγωνίζομαι, συναγωνίζομαι"
    ]
  },
  {
    "id": 416,
    "unit": 8,
    "word": "vocal",
    "pos": "",
    "category": "",
    "meaning": "φωνητικός",
    "distractors": [
      "παρέχω, προσφέρω",
      "μιούζικαλ (μουσικό θέατρο)",
      "κιθάρα"
    ]
  },
  {
    "id": 417,
    "unit": 8,
    "word": "waste",
    "pos": "",
    "category": "",
    "meaning": "σπαταλώ",
    "distractors": [
      "χρυσό μετάλλιο",
      "πηγή",
      "περίπου"
    ]
  },
  {
    "id": 418,
    "unit": 8,
    "word": "wealthy",
    "pos": "",
    "category": "",
    "meaning": "πλούσιος, εύπορος",
    "distractors": [
      "εμπιστεύομαι",
      "συγχωρώ",
      "εγγράφομαι, καταγράφω"
    ]
  },
  {
    "id": 419,
    "unit": 8,
    "word": "wedding",
    "pos": "",
    "category": "",
    "meaning": "γάμος (τελετή)",
    "distractors": [
      "σκηνή θεάτρου",
      "μουσικό όργανο",
      "εκπαιδευτής, δάσκαλος"
    ]
  },
  {
    "id": 420,
    "unit": 8,
    "word": "wind",
    "pos": "",
    "category": "",
    "meaning": "πνευστά (μουσικά όργανα)",
    "distractors": [
      "εκατομμυριούχος",
      "μήκος, διάρκεια",
      "συγχωρώ"
    ]
  },
  {
    "id": 421,
    "unit": 8,
    "word": "wolf",
    "pos": "",
    "category": "",
    "meaning": "λύκος",
    "distractors": [
      "αρχαιότητα",
      "εμπνέω",
      "στίχοι τραγουδιού"
    ]
  },
  {
    "id": 422,
    "unit": 9,
    "word": "acid rain",
    "pos": "(n)",
    "category": "pollution",
    "meaning": "όξινη βροχή",
    "distractors": [
      "ρύπος, μολυσματική ουσία",
      "μονοξείδιο του άνθρακα",
      "καμινάδα"
    ]
  },
  {
    "id": 423,
    "unit": 9,
    "word": "become extinct",
    "pos": "(v phr)",
    "category": "animals",
    "meaning": "εξαφανίζομαι, εκλείπω (για είδος)",
    "distractors": [
      "φροντίζω, νοιάζομαι για",
      "παραποιώ, πειράζω απρόσεκτα",
      "γεννώ αυγά"
    ]
  },
  {
    "id": 424,
    "unit": 9,
    "word": "bend",
    "pos": "(v)",
    "category": "action",
    "meaning": "λυγίζω, σκύβω",
    "distractors": [
      "εξαφανίζομαι",
      "αποκτώ, κερδίζω",
      "ζητώ, κάνω αίτηση / αίτημα"
    ]
  },
  {
    "id": 425,
    "unit": 9,
    "word": "breath",
    "pos": "(n)",
    "category": "health",
    "meaning": "αναπνοή, ανάσα",
    "distractors": [
      "ακμή, σπυράκια",
      "ασθένεια, νόσος",
      "καρκίνος"
    ]
  },
  {
    "id": 426,
    "unit": 9,
    "word": "cancer",
    "pos": "(n)",
    "category": "health",
    "meaning": "καρκίνος",
    "distractors": [
      "αναπνοή, ανάσα",
      "ακμή, σπυράκια",
      "ασθένεια, νόσος"
    ]
  },
  {
    "id": 427,
    "unit": 9,
    "word": "carbon monoxide",
    "pos": "(n)",
    "category": "pollution",
    "meaning": "μονοξείδιο του άνθρακα",
    "distractors": [
      "τοξικά απόβλητα",
      "δηλητήριο / δηλητηριάζω",
      "σκουπίδια, απορρίμματα"
    ]
  },
  {
    "id": 428,
    "unit": 9,
    "word": "celebrate",
    "pos": "(v)",
    "category": "action",
    "meaning": "γιορτάζω",
    "distractors": [
      "προστατεύω",
      "σταματώ, παρατώ",
      "γνέφω καταφατικά, κουνώ το κεφάλι"
    ]
  },
  {
    "id": 429,
    "unit": 9,
    "word": "chemical plant",
    "pos": "(n)",
    "category": "pollution",
    "meaning": "εργοστάσιο χημικών",
    "distractors": [
      "καμινάδα",
      "ρύπανση, μόλυνση",
      "ρύπος, μολυσματική ουσία"
    ]
  },
  {
    "id": 430,
    "unit": 9,
    "word": "chimney",
    "pos": "(n)",
    "category": "pollution",
    "meaning": "καμινάδα",
    "distractors": [
      "ρύπανση, μόλυνση",
      "μονοξείδιο του άνθρακα",
      "όξινη βροχή"
    ]
  },
  {
    "id": 431,
    "unit": 9,
    "word": "coal",
    "pos": "(n)",
    "category": "energy",
    "meaning": "κάρβουνο, γαιάνθρακας",
    "distractors": [
      "επιλογή",
      "καύσιμο",
      "απόδειξη"
    ]
  },
  {
    "id": 432,
    "unit": 9,
    "word": "cover",
    "pos": "(v)",
    "category": "nature",
    "meaning": "καλύπτω, σκεπάζω",
    "distractors": [
      "προσέχω",
      "προκαλώ / αιτία, αφορμή",
      "πετώ"
    ]
  },
  {
    "id": 433,
    "unit": 9,
    "word": "destroy",
    "pos": "(v)",
    "category": "action",
    "meaning": "καταστρέφω",
    "distractors": [
      "προστατεύω",
      "προκαλώ / αιτία, αφορμή",
      "ενοχλώ, διαταράσσω"
    ]
  },
  {
    "id": 434,
    "unit": 9,
    "word": "disappear",
    "pos": "(v)",
    "category": "action",
    "meaning": "εξαφανίζομαι",
    "distractors": [
      "αναπτύσσω, εξελίσσω",
      "σώζω, διασώζω",
      "γιορτάζω"
    ]
  },
  {
    "id": 435,
    "unit": 9,
    "word": "disease",
    "pos": "(n)",
    "category": "health",
    "meaning": "ασθένεια, νόσος",
    "distractors": [
      "καρκίνος",
      "ακμή, σπυράκια",
      "αναπνοή, ανάσα"
    ]
  },
  {
    "id": 436,
    "unit": 9,
    "word": "disturb",
    "pos": "(v)",
    "category": "action",
    "meaning": "ενοχλώ, διαταράσσω",
    "distractors": [
      "προκαλώ / αιτία, αφορμή",
      "επιτρέπω",
      "αποκτώ, κερδίζω"
    ]
  },
  {
    "id": 437,
    "unit": 9,
    "word": "dry cleaner",
    "pos": "(n)",
    "category": "work",
    "meaning": "καθαριστήριο ρούχων",
    "distractors": [
      "περιοχή, χώρος",
      "βάρδια εργασίας",
      "φορτηγό"
    ]
  },
  {
    "id": 438,
    "unit": 9,
    "word": "cause",
    "pos": "(v, n)",
    "category": "action",
    "meaning": "προκαλώ / αιτία, αφορμή",
    "distractors": [
      "εξαφανίζομαι",
      "προστατεύω",
      "ζυγίζω, έχω βάρος"
    ]
  },
  {
    "id": 439,
    "unit": 9,
    "word": "dump",
    "pos": "(v)",
    "category": "pollution",
    "meaning": "πετώ, ξεφορτώνομαι (μπάζα, σκουπίδια)",
    "distractors": [
      "περιλαμβάνω, αποτελούμαι από",
      "ρέω, κυλώ / ροή",
      "θαυμάζω"
    ]
  },
  {
    "id": 440,
    "unit": 9,
    "word": "endangered species",
    "pos": "(n pl)",
    "category": "animals",
    "meaning": "απειλούμενα είδη",
    "distractors": [
      "άνθρωποι",
      "ξένες γλώσσες",
      "ερείπια"
    ]
  },
  {
    "id": 441,
    "unit": 9,
    "word": "environment",
    "pos": "(n)",
    "category": "nature",
    "meaning": "περιβάλλον",
    "distractors": [
      "ακτή, αιγιαλός",
      "παλίρροια (άμπωτη και πλημμυρίδα)",
      "καταιγίδα"
    ]
  },
  {
    "id": 442,
    "unit": 9,
    "word": "environmental",
    "pos": "(adj)",
    "category": "nature",
    "meaning": "περιβαλλοντικός",
    "distractors": [
      "καλλιτεχνικός",
      "τραχύς / αγριεμένος (για θάλασσα)",
      "ανήσυχος, αγχωμένος"
    ]
  },
  {
    "id": 443,
    "unit": 9,
    "word": "fuel",
    "pos": "(n)",
    "category": "energy",
    "meaning": "καύσιμο",
    "distractors": [
      "φρουτοποτό, παντς φρούτων",
      "κάρβουνο, γαιάνθρακας",
      "θερμοκρασία"
    ]
  },
  {
    "id": 444,
    "unit": 9,
    "word": "get rid of",
    "pos": "(phr v)",
    "category": "action",
    "meaning": "ξεφορτώνομαι, απαλλάσσομαι από",
    "distractors": [
      "κατευθύνομαι προς",
      "κοιτάζω επίμονα",
      "ανάβω / σβήνω (διακόπτη)"
    ]
  },
  {
    "id": 445,
    "unit": 9,
    "word": "habitat",
    "pos": "(n)",
    "category": "nature",
    "meaning": "φυσικός βιότοπος, φυσικό περιβάλλον",
    "distractors": [
      "ωκεανός",
      "ακτή, αιγιαλός",
      "παλίρροια (άμπωτη και πλημμυρίδα)"
    ]
  },
  {
    "id": 446,
    "unit": 9,
    "word": "head for",
    "pos": "(phr v)",
    "category": "action",
    "meaning": "κατευθύνομαι προς",
    "distractors": [
      "κοιτάζω επίμονα",
      "ανάβω / σβήνω (διακόπτη)",
      "ξεφορτώνομαι, απαλλάσσομαι από"
    ]
  },
  {
    "id": 447,
    "unit": 9,
    "word": "industrial",
    "pos": "(adj)",
    "category": "work",
    "meaning": "βιομηχανικός",
    "distractors": [
      "συμπονετικός",
      "μάλλινος",
      "ήπιος, γλυκός (για καιρό)"
    ]
  },
  {
    "id": 448,
    "unit": 9,
    "word": "lay eggs",
    "pos": "(v phr)",
    "category": "animals",
    "meaning": "γεννώ αυγά",
    "distractors": [
      "εξαφανίζομαι, εκλείπω (για είδος)",
      "παραποιώ, πειράζω απρόσεκτα",
      "φροντίζω, νοιάζομαι για"
    ]
  },
  {
    "id": 449,
    "unit": 9,
    "word": "nod",
    "pos": "(v)",
    "category": "action",
    "meaning": "γνέφω καταφατικά, κουνώ το κεφάλι",
    "distractors": [
      "εξαφανίζομαι",
      "προστατεύω",
      "ζυγίζω, έχω βάρος"
    ]
  },
  {
    "id": 450,
    "unit": 9,
    "word": "ocean",
    "pos": "(n)",
    "category": "nature",
    "meaning": "ωκεανός",
    "distractors": [
      "ακτή, αιγιαλός",
      "καταιγίδα",
      "περιβάλλον"
    ]
  },
  {
    "id": 451,
    "unit": 9,
    "word": "poison",
    "pos": "(n, v)",
    "category": "pollution",
    "meaning": "δηλητήριο / δηλητηριάζω",
    "distractors": [
      "ρύπος, μολυσματική ουσία",
      "ρύπανση, μόλυνση",
      "καμινάδα"
    ]
  },
  {
    "id": 452,
    "unit": 9,
    "word": "pollutant",
    "pos": "(n)",
    "category": "pollution",
    "meaning": "ρύπος, μολυσματική ουσία",
    "distractors": [
      "ρύπανση, μόλυνση",
      "εργοστάσιο χημικών",
      "μονοξείδιο του άνθρακα"
    ]
  },
  {
    "id": 453,
    "unit": 9,
    "word": "pollution",
    "pos": "(n)",
    "category": "pollution",
    "meaning": "ρύπανση, μόλυνση",
    "distractors": [
      "τοξικά απόβλητα",
      "μονοξείδιο του άνθρακα",
      "καμινάδα"
    ]
  },
  {
    "id": 454,
    "unit": 9,
    "word": "protect",
    "pos": "(v)",
    "category": "action",
    "meaning": "προστατεύω",
    "distractors": [
      "ζητώ, κάνω αίτηση / αίτημα",
      "αναπτύσσω, εξελίσσω",
      "προκαλώ / αιτία, αφορμή"
    ]
  },
  {
    "id": 455,
    "unit": 9,
    "word": "quit",
    "pos": "(v)",
    "category": "action",
    "meaning": "σταματώ, παρατώ",
    "distractors": [
      "προκαλώ / αιτία, αφορμή",
      "εγκρίνω, επικροτώ",
      "επιτρέπω"
    ]
  },
  {
    "id": 456,
    "unit": 9,
    "word": "rough",
    "pos": "(adj)",
    "category": "nature",
    "meaning": "τραχύς / αγριεμένος (για θάλασσα)",
    "distractors": [
      "περιβαλλοντικός",
      "κυκλοθυμικός, κακόκεφος",
      "άνετος, ζεστός"
    ]
  },
  {
    "id": 457,
    "unit": 9,
    "word": "rubbish",
    "pos": "(n)",
    "category": "pollution",
    "meaning": "σκουπίδια, απορρίμματα",
    "distractors": [
      "καμινάδα",
      "εργοστάσιο χημικών",
      "τοξικά απόβλητα"
    ]
  },
  {
    "id": 458,
    "unit": 9,
    "word": "save",
    "pos": "(v)",
    "category": "action",
    "meaning": "σώζω, διασώζω",
    "distractors": [
      "αναπτύσσω, εξελίσσω",
      "ζητώ, κάνω αίτηση / αίτημα",
      "επιτρέπω"
    ]
  },
  {
    "id": 459,
    "unit": 9,
    "word": "shore",
    "pos": "(n)",
    "category": "nature",
    "meaning": "ακτή, αιγιαλός",
    "distractors": [
      "καταιγίδα",
      "περιβάλλον",
      "φυσικός βιότοπος, φυσικό περιβάλλον"
    ]
  },
  {
    "id": 460,
    "unit": 9,
    "word": "stare at",
    "pos": "(phr v)",
    "category": "action",
    "meaning": "κοιτάζω επίμονα",
    "distractors": [
      "κατευθύνομαι προς",
      "ανάβω / σβήνω (διακόπτη)",
      "ξεφορτώνομαι, απαλλάσσομαι από"
    ]
  },
  {
    "id": 461,
    "unit": 9,
    "word": "starfish",
    "pos": "(n)",
    "category": "animals",
    "meaning": "αστερίας",
    "distractors": [
      "σκουπίδια, απορρίμματα",
      "χελώνα (θαλάσσια)",
      "κατσίκα, γίδα"
    ]
  },
  {
    "id": 462,
    "unit": 9,
    "word": "sulphur dioxide",
    "pos": "(n)",
    "category": "pollution",
    "meaning": "διοξείδιο του θείου",
    "distractors": [
      "εργοστάσιο χημικών",
      "σκουπίδια, απορρίμματα",
      "μονοξείδιο του άνθρακα"
    ]
  },
  {
    "id": 463,
    "unit": 9,
    "word": "tide",
    "pos": "(n)",
    "category": "nature",
    "meaning": "παλίρροια (άμπωτη και πλημμυρίδα)",
    "distractors": [
      "ωκεανός",
      "ακτή, αιγιαλός",
      "φυσικός βιότοπος, φυσικό περιβάλλον"
    ]
  },
  {
    "id": 464,
    "unit": 9,
    "word": "toxic waste",
    "pos": "(n)",
    "category": "pollution",
    "meaning": "τοξικά απόβλητα",
    "distractors": [
      "δηλητήριο / δηλητηριάζω",
      "τοξίνη, δηλητήριο",
      "όξινη βροχή"
    ]
  },
  {
    "id": 465,
    "unit": 9,
    "word": "toxin",
    "pos": "(n)",
    "category": "pollution",
    "meaning": "τοξίνη, δηλητήριο",
    "distractors": [
      "ρύπος, μολυσματική ουσία",
      "διοξείδιο του θείου",
      "μονοξείδιο του άνθρακα"
    ]
  },
  {
    "id": 466,
    "unit": 9,
    "word": "truck",
    "pos": "(n)",
    "category": "work",
    "meaning": "φορτηγό",
    "distractors": [
      "επιβάτης",
      "καθαριστήριο ρούχων",
      "στροφή (δρόμου)"
    ]
  },
  {
    "id": 467,
    "unit": 9,
    "word": "turtle",
    "pos": "(n)",
    "category": "animals",
    "meaning": "χελώνα (θαλάσσια)",
    "distractors": [
      "αστερίας",
      "κατσίκα, γίδα",
      "ρέστα, ψιλά"
    ]
  },
  {
    "id": 468,
    "unit": 9,
    "word": "wash up",
    "pos": "(phr v)",
    "category": "nature",
    "meaning": "ξεβράζω, εκβράζω (στην ακτή)",
    "distractors": [
      "κάνω φάρσες, ξεγελάω",
      "ανάβω / σβήνω (διακόπτη)",
      "κατευθύνομαι προς"
    ]
  },
  {
    "id": 469,
    "unit": 9,
    "word": "weigh",
    "pos": "(v)",
    "category": "action",
    "meaning": "ζυγίζω, έχω βάρος",
    "distractors": [
      "ζητώ, κάνω αίτηση / αίτημα",
      "αναπτύσσω, εξελίσσω",
      "σώζω, διασώζω"
    ]
  },
  {
    "id": 470,
    "unit": 10,
    "word": "acne",
    "pos": "(n)",
    "category": "health",
    "meaning": "ακμή, σπυράκια",
    "distractors": [
      "ασθένεια, νόσος",
      "αναπνοή, ανάσα",
      "καρκίνος"
    ]
  },
  {
    "id": 471,
    "unit": 10,
    "word": "actor",
    "pos": "(n)",
    "category": "cinema",
    "meaning": "ηθοποιός",
    "distractors": [
      "σενάριο (ταινίας)",
      "λογοτεχνικό/κινηματογραφικό είδος",
      "βραβείο / απονέμω βραβείο"
    ]
  },
  {
    "id": 472,
    "unit": 10,
    "word": "allow",
    "pos": "(v)",
    "category": "action",
    "meaning": "επιτρέπω",
    "distractors": [
      "λυγίζω, σκύβω",
      "προστατεύω",
      "γιορτάζω"
    ]
  },
  {
    "id": 473,
    "unit": 10,
    "word": "approve",
    "pos": "(v)",
    "category": "action",
    "meaning": "εγκρίνω, επικροτώ",
    "distractors": [
      "αναπτύσσω, εξελίσσω",
      "αποκτώ, κερδίζω",
      "προκαλώ / αιτία, αφορμή"
    ]
  },
  {
    "id": 474,
    "unit": 10,
    "word": "award",
    "pos": "(n, v)",
    "category": "cinema",
    "meaning": "βραβείο / απονέμω βραβείο",
    "distractors": [
      "ηθοποιός",
      "λογοτεχνικό/κινηματογραφικό είδος",
      "σενάριο (ταινίας)"
    ]
  },
  {
    "id": 475,
    "unit": 10,
    "word": "bestseller",
    "pos": "(n)",
    "category": "books",
    "meaning": "μπεστ-σέλερ, ευπώλητο βιβλίο",
    "distractors": [
      "χαρακτήρας, ήρωας (βιβλίου, έργου)",
      "μυθιστόρημα",
      "πλοκή (έργου, ταινίας)"
    ]
  },
  {
    "id": 476,
    "unit": 10,
    "word": "bored",
    "pos": "(adj)",
    "category": "feelings",
    "meaning": "βαριεστημένος, που πλήττει",
    "distractors": [
      "συγκινητικός",
      "ευχάριστος, απολαυστικός",
      "ανήσυχος, αγχωμένος"
    ]
  },
  {
    "id": 477,
    "unit": 10,
    "word": "breaking news",
    "pos": "(n)",
    "category": "media",
    "meaning": "έκτακτες ειδήσεις, έκτακτο δελτίο",
    "distractors": [
      "θεατής, τηλεθεατής",
      "τραπεζίτης",
      "κριτικός (τέχνης, κινηματογράφου)"
    ]
  },
  {
    "id": 478,
    "unit": 10,
    "word": "chance",
    "pos": "(n)",
    "category": "general",
    "meaning": "ευκαιρία, πιθανότητα",
    "distractors": [
      "ξεναγός, οδηγός",
      "πείραμα / πειραματίζομαι",
      "μυθιστόρημα"
    ]
  },
  {
    "id": 479,
    "unit": 10,
    "word": "character",
    "pos": "(n)",
    "category": "books",
    "meaning": "χαρακτήρας, ήρωας (βιβλίου, έργου)",
    "distractors": [
      "μπεστ-σέλερ, ευπώλητο βιβλίο",
      "πλοκή (έργου, ταινίας)",
      "τίτλος (ταινίας, βιβλίου)"
    ]
  },
  {
    "id": 480,
    "unit": 10,
    "word": "creator",
    "pos": "(n)",
    "category": "cinema",
    "meaning": "δημιουργός",
    "distractors": [
      "σενάριο (ταινίας)",
      "βραβείο / απονέμω βραβείο",
      "λογοτεχνικό/κινηματογραφικό είδος"
    ]
  },
  {
    "id": 481,
    "unit": 10,
    "word": "critic",
    "pos": "(n)",
    "category": "media",
    "meaning": "κριτικός (τέχνης, κινηματογράφου)",
    "distractors": [
      "ηθοποιός",
      "έκτακτες ειδήσεις, έκτακτο δελτίο",
      "θεατής, τηλεθεατής"
    ]
  },
  {
    "id": 482,
    "unit": 10,
    "word": "crooked",
    "pos": "(adj)",
    "category": "appearance",
    "meaning": "στραβός, παραμορφωμένος",
    "distractors": [
      "ευαίσθητος, λεπτός",
      "φτερωτός",
      "αηδιαστικός"
    ]
  },
  {
    "id": 483,
    "unit": 10,
    "word": "develop",
    "pos": "(v)",
    "category": "action",
    "meaning": "αναπτύσσω, εξελίσσω",
    "distractors": [
      "ζητώ, κάνω αίτηση / αίτημα",
      "προκαλώ / αιτία, αφορμή",
      "ενοχλώ, διαταράσσω"
    ]
  },
  {
    "id": 484,
    "unit": 10,
    "word": "direct",
    "pos": "(v)",
    "category": "cinema",
    "meaning": "σκηνοθετώ",
    "distractors": [
      "πετώ, ξεφορτώνομαι (μπάζα, σκουπίδια)",
      "εξαφανίζομαι",
      "ενοχλώ, διαταράσσω"
    ]
  },
  {
    "id": 485,
    "unit": 10,
    "word": "drawing",
    "pos": "(n)",
    "category": "art",
    "meaning": "σχέδιο, σκίτσο",
    "distractors": [
      "επιβάτης",
      "νοσοκόμος, νοσηλευτής",
      "εικονογράφηση, σκίτσο"
    ]
  },
  {
    "id": 486,
    "unit": 10,
    "word": "evil",
    "pos": "(adj, n)",
    "category": "character",
    "meaning": "κακός, μοχθηρός / το κακό",
    "distractors": [
      "απρόβλεπτος",
      "μοχθηρός, μοχθηρός/άγριος",
      "μοχθηρός, κακός"
    ]
  },
  {
    "id": 487,
    "unit": 10,
    "word": "experiment",
    "pos": "(n, v)",
    "category": "general",
    "meaning": "πείραμα / πειραματίζομαι",
    "distractors": [
      "ευκαιρία, πιθανότητα",
      "ακτή, αιγιαλός",
      "σεσουάρ, στεγνωτήρας"
    ]
  },
  {
    "id": 488,
    "unit": 10,
    "word": "expertise",
    "pos": "(n)",
    "category": "skills",
    "meaning": "εξειδικευμένη γνώση, πείρα",
    "distractors": [
      "σεισμός, δόνηση της γης",
      "επιβάτης",
      "ενήλικας"
    ]
  },
  {
    "id": 489,
    "unit": 10,
    "word": "forbidden",
    "pos": "(adj)",
    "category": "rules",
    "meaning": "απαγορευμένος",
    "distractors": [
      "κακός, μοχθηρός / το κακό",
      "πιστός, αφοσιωμένος",
      "τρομακτικός"
    ]
  },
  {
    "id": 490,
    "unit": 10,
    "word": "gain",
    "pos": "(v)",
    "category": "action",
    "meaning": "αποκτώ, κερδίζω",
    "distractors": [
      "ενοχλώ, διαταράσσω",
      "αναπτύσσω, εξελίσσω",
      "εγκρίνω, επικροτώ"
    ]
  },
  {
    "id": 491,
    "unit": 10,
    "word": "genre",
    "pos": "(n)",
    "category": "cinema",
    "meaning": "λογοτεχνικό/κινηματογραφικό είδος",
    "distractors": [
      "ηθοποιός",
      "δημιουργός",
      "σενάριο (ταινίας)"
    ]
  },
  {
    "id": 492,
    "unit": 10,
    "word": "hit the shelves",
    "pos": "(phr)",
    "category": "books",
    "meaning": "κυκλοφορεί στα καταστήματα/βιβλιοπωλεία",
    "distractors": [
      "κρατώ ελεύθερο, μένω μακριά",
      "τρώω τα νύχια μου",
      "αρχικά"
    ]
  },
  {
    "id": 493,
    "unit": 10,
    "word": "illustration",
    "pos": "(n)",
    "category": "art",
    "meaning": "εικονογράφηση, σκίτσο",
    "distractors": [
      "σχέδιο, σκίτσο",
      "μετάξι",
      "απόδειξη"
    ]
  },
  {
    "id": 494,
    "unit": 10,
    "word": "messy",
    "pos": "(adj)",
    "category": "appearance",
    "meaning": "ακατάστατος, βρώμικος",
    "distractors": [
      "ελκυστικός, όμορφος",
      "υπερμεγέθης, πολύ μεγάλος",
      "τεράστιος"
    ]
  },
  {
    "id": 495,
    "unit": 10,
    "word": "mission",
    "pos": "(n)",
    "category": "action",
    "meaning": "αποστολή",
    "distractors": [
      "ακμή, σπυράκια",
      "ξωτικό, πνεύμα",
      "ρύπος, μολυσματική ουσία"
    ]
  },
  {
    "id": 496,
    "unit": 10,
    "word": "mop",
    "pos": "(n, v)",
    "category": "tools",
    "meaning": "σφουγγαρίστρα / σφουγγαρίζω",
    "distractors": [
      "οικολόγος",
      "καταιγίδα",
      "πριγκίπισσα"
    ]
  },
  {
    "id": 497,
    "unit": 10,
    "word": "moving",
    "pos": "(adj)",
    "category": "feelings",
    "meaning": "συγκινητικός",
    "distractors": [
      "τρομακτικός",
      "βαριεστημένος, που πλήττει",
      "ευχάριστος, απολαυστικός"
    ]
  },
  {
    "id": 498,
    "unit": 10,
    "word": "nasty",
    "pos": "(adj)",
    "category": "character",
    "meaning": "κακός, δυσάρεστος, μοχθηρός",
    "distractors": [
      "άγριος, βάναυσος",
      "κυκλοθυμικός, κακόκεφος",
      "παιχνιδιάρικος"
    ]
  },
  {
    "id": 499,
    "unit": 10,
    "word": "novel",
    "pos": "(n)",
    "category": "books",
    "meaning": "μυθιστόρημα",
    "distractors": [
      "τίτλος (ταινίας, βιβλίου)",
      "σκηνικό, πλαίσιο, τόπος και χρόνος",
      "μπεστ-σέλερ, ευπώλητο βιβλίο"
    ]
  },
  {
    "id": 500,
    "unit": 10,
    "word": "permit",
    "pos": "(v, n)",
    "category": "rules",
    "meaning": "επιτρέπω / άδεια",
    "distractors": [
      "εγκρίνω, επικροτώ",
      "αναπτύσσω, εξελίσσω",
      "φτύνω, εκτοξεύω"
    ]
  },
  {
    "id": 501,
    "unit": 10,
    "word": "plot",
    "pos": "(n)",
    "category": "books",
    "meaning": "πλοκή (έργου, ταινίας)",
    "distractors": [
      "μπεστ-σέλερ, ευπώλητο βιβλίο",
      "σκηνικό, πλαίσιο, τόπος και χρόνος",
      "χαρακτήρας, ήρωας (βιβλίου, έργου)"
    ]
  },
  {
    "id": 502,
    "unit": 10,
    "word": "request",
    "pos": "(v, n)",
    "category": "action",
    "meaning": "ζητώ, κάνω αίτηση / αίτημα",
    "distractors": [
      "σταματώ, παρατώ",
      "γιορτάζω",
      "επιτρέπω"
    ]
  },
  {
    "id": 503,
    "unit": 10,
    "word": "screenplay",
    "pos": "(n)",
    "category": "cinema",
    "meaning": "σενάριο (ταινίας)",
    "distractors": [
      "ηθοποιός",
      "βραβείο / απονέμω βραβείο",
      "λογοτεχνικό/κινηματογραφικό είδος"
    ]
  },
  {
    "id": 504,
    "unit": 10,
    "word": "scruffy",
    "pos": "(adj)",
    "category": "appearance",
    "meaning": "απεριποίητος, ατημέλητος",
    "distractors": [
      "αηδιαστικός",
      "απεχθής, απαίσιος, φρικτός",
      "μικροσκοπικός"
    ]
  },
  {
    "id": 505,
    "unit": 10,
    "word": "setting",
    "pos": "(n)",
    "category": "books",
    "meaning": "σκηνικό, πλαίσιο, τόπος και χρόνος",
    "distractors": [
      "τίτλος (ταινίας, βιβλίου)",
      "χαρακτήρας, ήρωας (βιβλίου, έργου)",
      "πλοκή (έργου, ταινίας)"
    ]
  },
  {
    "id": 506,
    "unit": 10,
    "word": "slightly",
    "pos": "(adv)",
    "category": "general",
    "meaning": "ελαφρώς, λίγο",
    "distractors": [
      "με σεβασμό",
      "ανεξάρτητα, αυτόνομα",
      "γλυκό, επιδόρπιο"
    ]
  },
  {
    "id": 507,
    "unit": 10,
    "word": "sold out",
    "pos": "(adj)",
    "category": "cinema",
    "meaning": "εξαντλημένος (για εισιτήρια)",
    "distractors": [
      "υπεύθυνος",
      "χαλαρός, φαρδύς",
      "πολυπολιτισμικός"
    ]
  },
  {
    "id": 508,
    "unit": 10,
    "word": "sophisticated",
    "pos": "(adj)",
    "category": "general",
    "meaning": "εκλεπτυσμένος, εξελιγμένος",
    "distractors": [
      "γενναίος",
      "ντροπαλός",
      "χαλαρός, μη σφιχτός"
    ]
  },
  {
    "id": 509,
    "unit": 10,
    "word": "spy",
    "pos": "(n, v)",
    "category": "character",
    "meaning": "κατάσκοπος / κατασκοπεύω",
    "distractors": [
      "τζιν, ύφασμα τζιν",
      "πριγκίπισσα",
      "ιππότης"
    ]
  },
  {
    "id": 510,
    "unit": 10,
    "word": "switch on/off",
    "pos": "(phr v)",
    "category": "action",
    "meaning": "ανάβω / σβήνω (διακόπτη)",
    "distractors": [
      "ξεφορτώνομαι, απαλλάσσομαι από",
      "κοιτάζω επίμονα",
      "κατευθύνομαι προς"
    ]
  },
  {
    "id": 511,
    "unit": 10,
    "word": "title",
    "pos": "(n)",
    "category": "books",
    "meaning": "τίτλος (ταινίας, βιβλίου)",
    "distractors": [
      "πλοκή (έργου, ταινίας)",
      "χαρακτήρας, ήρωας (βιβλίου, έργου)",
      "μυθιστόρημα"
    ]
  },
  {
    "id": 512,
    "unit": 10,
    "word": "viewer",
    "pos": "(n)",
    "category": "media",
    "meaning": "θεατής, τηλεθεατής",
    "distractors": [
      "κριτικός (τέχνης, κινηματογράφου)",
      "έκτακτες ειδήσεις, έκτακτο δελτίο",
      "στολή (μαθητική, επαγγελματική)"
    ]
  }
];
