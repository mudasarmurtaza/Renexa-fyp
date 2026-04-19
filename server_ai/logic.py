from ai_intent import detect_intent
import re
import os
from google import genai
from google.genai import types

# Initialize Gemini client if key is available
raw_key = os.getenv("GEMINI_API_KEY")
gemini_api_key = raw_key.strip() if raw_key else None

if gemini_api_key and gemini_api_key != "your_gemini_api_key_here":
    print(f"[AI] Gemini API key loaded (length: {len(gemini_api_key)}). Initializing client...")
    gemini_client = genai.Client(api_key=gemini_api_key)
    print("[AI] Gemini client initialized OK")
else:
    print(f"[AI] No valid Gemini API key found. Raw key: '{raw_key}'")
    gemini_client = None

GEMINI_SYSTEM = "You are Renexa AI Assistant, an expert in the Pakistani construction industry. You help users with general questions. Keep your answers concise, friendly, and properly formatted."

RATES = {
    "grey_structure": {
        "A":       4500,
        "A+":      5500,
        "Premium": 6500
    },
    "finishing": {
        "A":       3500,
        "A+":      4500,
        "Premium": 5500
    }
}

# Marla/Kanal to sqft conversions (Punjab standard)
AREA_UNITS = {
    "marla":  225,   # 1 marla = 225 sqft
    "kanal":  4500,  # 1 kanal = 20 marla = 4500 sqft
    "sqft":   1,
    "sqyard": 9,
}

def parse_area(text):
    """Extract area in sqft from user message."""
    text = text.lower()
    for unit, factor in AREA_UNITS.items():
        pattern = r"(\d+(?:\.\d+)?)\s*" + unit
        match = re.search(pattern, text)
        if match:
            return float(match.group(1)) * factor
    # plain number fallback (assume sqft)
    match = re.search(r"(\d+(?:\.\d+)?)", text)
    if match:
        return float(match.group(1))
    return None

def parse_quality(text):
    text = text.lower()
    if "premium" in text:
        return "Premium"
    if "a+" in text:
        return "A+"
    return "A"

def calculate_estimate(area_sqft, quality="A", include_finishing=True):
    try:
        area = float(area_sqft)
        grey_rate = RATES["grey_structure"].get(quality, RATES["grey_structure"]["A"])
        total_rate = grey_rate

        if include_finishing:
            finish_rate = RATES["finishing"].get(quality, RATES["finishing"]["A"])
            total_rate += finish_rate

        estimated_cost = area * total_rate
        return {
            "success": True,
            "area": area,
            "quality": quality,
            "include_finishing": include_finishing,
            "per_sqft_rate": total_rate,
            "estimated_total_pkr": round(estimated_cost, 2),
            "formatted_cost": f"{estimated_cost:,.0f} PKR"
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

def get_ai_response(user_message):
    msg = user_message.lower()
    intent = detect_intent(user_message)

    # 🟢 COST ESTIMATION
    if intent == "cost":
        area = parse_area(msg)
        quality = parse_quality(msg)
        include_finishing = "grey" not in msg

        if area:
            result = calculate_estimate(area, quality, include_finishing)
            return (
                f"🏗️ Construction Cost Estimate\n\n"
                f"📐 Area: {result['area']:,.0f} sqft\n"
                f"⭐ Quality: {quality}\n"
                f"💰 Rate: PKR {result['per_sqft_rate']:,}/sqft\n"
                f"━━━━━━━━━━━━━━━━━━\n"
                f"💵 Total: {result['formatted_cost']}"
            )
        else:
            return "Please tell area like 5 marla or 1000 sqft."

    # 🔵 AREA CONVERSION
    elif intent == "convert":
        area = parse_area(msg)
        if area:
            marla = area / 225
            kanal = area / 4500
            return (
                f"📐 Area Conversion:\n\n"
                f"{area:,.0f} sqft =\n"
                f"{marla:.2f} marla\n"
                f"{kanal:.2f} kanal"
            )
        return "Tell me area to convert."

    # 🟡 CONTRACTOR
    elif intent == "contractor":
        return (
            "👷 To hire a contractor:\n"
            "1. Go to Dashboard\n"
            "2. Browse Contractors\n"
            "3. Send bid request\n"
        )

    # 🟠 TIMELINE
    elif intent == "timeline":
        return (
            "⏳ Construction Time:\n"
            "• 5 Marla: 6–9 months\n"
            "• 10 Marla: 9–12 months\n"
            "• 1 Kanal: 12–18 months"
        )

    # 🟣 GREETING
    elif intent == "greeting":
        return "👋 Hello! Ask me about construction cost, area, or contractors."

    # 🔴 FALLBACK / GENERAL CHAT USING GEMINI
    else:
        if gemini_client:
            try:
                response = gemini_client.models.generate_content(
                    model="gemini-2.0-flash",
                    contents=user_message,
                    config=types.GenerateContentConfig(
                        system_instruction=GEMINI_SYSTEM,
                        max_output_tokens=200
                    )
                )
                return response.text.strip()
            except Exception as e:
                err = str(e)
                print("Gemini API error:", err)
                if "RESOURCE_EXHAUSTED" in err or "quota" in err.lower():
                    return (
                        "⚠️ AI quota exceeded for today. My local construction features still work perfectly!\n\n"
                        "Try asking:\n"
                        "• 'Estimate cost for 5 marla house'\n"
                        "• 'Convert 1 kanal to sqft'\n"
                        "• 'How long to build 10 marla?'"
                    )
                return "🤖 AI service temporarily unavailable. Ask me about construction costs, area conversions, or contractors!"
        else:
            return (
                "🤔 I can help with:\n"
                "• Cost estimation\n"
                "• Area conversion\n"
                "• Contractor guidance\n"
                "Try: 'Estimate cost for 5 marla house'"
            )