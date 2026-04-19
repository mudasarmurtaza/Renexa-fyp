from sentence_transformers import SentenceTransformer, util

# Load MiniLM model (local)
model = SentenceTransformer('all-MiniLM-L6-v2')

INTENTS = {
    "cost": [
        "estimate cost",
        "construction price",
        "house budget",
        "ghar banane ka kharcha",
        "kitna kharcha lagega"
    ],
    "convert": [
        "convert marla to sqft",
        "area conversion",
        "sqft to kanal",
        "marla kitna hota hai"
    ],
    "contractor": [
        "find contractor",
        "hire builder",
        "labour chahiye",
        "mistri kaise milega"
    ],
    "timeline": [
        "how long construction",
        "project duration",
        "kitna time lagega"
    ],
    "greeting": [
        "hello",
        "hi",
        "salam",
        "hey"
    ]
}

def detect_intent(user_input):
    user_vec = model.encode(user_input, convert_to_tensor=True)

    best_intent = "general"
    best_score = 0.50 # Threshold to prevent false positives

    for intent, examples in INTENTS.items():
        for ex in examples:
            ex_vec = model.encode(ex, convert_to_tensor=True)
            score = util.cos_sim(user_vec, ex_vec).item()

            if score > best_score:
                best_score = score
                best_intent = intent

    return best_intent