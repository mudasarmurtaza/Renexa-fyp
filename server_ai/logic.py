# Renexa AI Assistant - Logic Engine
# Construction cost estimation for Pakistani market (2024 rates, PKR per sqft)

import re

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
    msg = user_message.lower().strip()

    # ── Greetings ────────────────────────────────────────────────────────────
    if any(w in msg for w in ["hello", "hi", "hey", "salam", "assalam"]):
        return (
            "👋 Hello! I'm your Renexa AI Assistant.\n\n"
            "Here's what I can help you with:\n"
            "• 🏗️ Construction cost estimates\n"
            "• 📐 Area unit conversions (marla, kanal, sqft)\n"
            "• 📋 Project planning advice\n"
            "• 👷 Contractor & bidding guidance\n"
            "• ℹ️ Renexa platform help\n\n"
            "What would you like to know?"
        )

    # ── Cost Estimation (smart extraction) ───────────────────────────────────
    if any(w in msg for w in ["cost", "estimate", "price", "rate", "budget", "kitna", "laga"]):
        area = parse_area(msg)
        quality = parse_quality(msg)
        include_finishing = "grey" not in msg  # grey-only if user says "grey"

        if area:
            result = calculate_estimate(area, quality, include_finishing)
            quality_label = {"A": "Standard (A)", "A+": "Good (A+)", "Premium": "Premium"}[quality]
            structure = "Grey Structure + Finishing" if include_finishing else "Grey Structure Only"
            return (
                f"🏗️ **Construction Cost Estimate**\n\n"
                f"📐 Area: {result['area']:,.0f} sqft\n"
                f"⭐ Quality: {quality_label}\n"
                f"🏠 Scope: {structure}\n"
                f"💰 Rate: PKR {result['per_sqft_rate']:,}/sqft\n"
                f"━━━━━━━━━━━━━━━━━━━━\n"
                f"💵 **Total Estimate: {result['formatted_cost']}**\n\n"
                f"_Rates based on 2024 Pakistani market. Final cost may vary._"
            )
        else:
            return (
                "I can calculate your construction cost! Just tell me:\n\n"
                "• **Area** — e.g. *5 marla*, *10 kanal*, *1000 sqft*\n"
                "• **Quality** (optional) — Standard (A), Good (A+), or Premium\n"
                "• **Scope** (optional) — add 'grey only' for structure only\n\n"
                "Example: _'estimate for 5 marla A+ quality'_"
            )

    # ── Area Conversions ──────────────────────────────────────────────────────
    if any(w in msg for w in ["marla", "kanal", "convert", "sqft", "square feet", "sqyard"]):
        area = parse_area(msg)
        if area:
            marla = area / 225
            kanal = area / 4500
            return (
                f"📐 **Area Conversion**\n\n"
                f"{area:,.0f} sqft =\n"
                f"• {marla:.2f} Marla\n"
                f"• {kanal:.2f} Kanal"
            )
        # Static conversion table
        return (
            "📐 **Standard Area Conversions (Punjab)**\n\n"
            "• 1 Marla = 225 sqft\n"
            "• 1 Kanal = 20 Marla = 4,500 sqft\n"
            "• 1 Sq Yard = 9 sqft\n\n"
            "Tell me your area and I'll convert it for you!"
        )

    # ── Quality Tiers ─────────────────────────────────────────────────────────
    if any(w in msg for w in ["quality", "grade", "difference", "a+", "premium", "standard"]):
        return (
            "⭐ **Construction Quality Tiers (2024)**\n\n"
            "🔹 **Standard (A)** — PKR 8,000/sqft total\n"
            "   Basic materials, functional finishes\n\n"
            "🔸 **Good (A+)** — PKR 10,000/sqft total\n"
            "   Better materials, quality tiles & fittings\n\n"
            "💎 **Premium** — PKR 12,000/sqft total\n"
            "   Imported materials, luxury finishes\n\n"
            "_Rates include grey structure + finishing._"
        )

    # ── Grey Structure ────────────────────────────────────────────────────────
    if "grey" in msg:
        return (
            "🏗️ **Grey Structure**\n\n"
            "Grey structure includes:\n"
            "• Foundation & footings\n"
            "• Brick/block walls\n"
            "• Roof slab (RCC)\n"
            "• Stairs\n"
            "• Without plastering, tiles, or finishing\n\n"
            "**Grey Structure Rates (2024):**\n"
            "• Standard (A): PKR 4,500/sqft\n"
            "• Good (A+): PKR 5,500/sqft\n"
            "• Premium: PKR 6,500/sqft\n\n"
            "Want me to estimate the grey structure cost for your plot?"
        )

    # ── Timeline / Duration ───────────────────────────────────────────────────
    if any(w in msg for w in ["time", "duration", "how long", "months", "timeline", "complete"]):
        return (
            "⏳ **Typical Construction Timelines**\n\n"
            "• **5 Marla house**: 6–9 months\n"
            "• **10 Marla house**: 9–12 months\n"
            "• **1 Kanal house**: 12–18 months\n\n"
            "Factors that affect timeline:\n"
            "• Contractor availability\n"
            "• Weather conditions\n"
            "• Material supply\n"
            "• Design complexity\n\n"
            "Renexa helps you track project progress in real-time! 📊"
        )

    # ── Contractor Related ────────────────────────────────────────────────────
    if any(w in msg for w in ["contractor", "hire", "find", "worker", "labour", "labor"]):
        return (
            "👷 **Finding a Contractor on Renexa**\n\n"
            "1. Go to **Browse Contractors** in your dashboard\n"
            "2. Filter by city, specialty, or rating\n"
            "3. View their portfolio & past projects\n"
            "4. Send a project bid request\n\n"
            "**Tips for hiring:**\n"
            "• Check contractor ratings & reviews\n"
            "• Request at least 3 quotes\n"
            "• Verify their past work photos\n"
            "• Agree on milestone-based payments\n\n"
            "Need help posting a project on Renexa?"
        )

    # ── Bidding ───────────────────────────────────────────────────────────────
    if any(w in msg for w in ["bid", "bidding", "quote", "tender", "proposal"]):
        return (
            "📋 **How Bidding Works on Renexa**\n\n"
            "**As a Customer:**\n"
            "1. Post your project with details & budget\n"
            "2. Contractors submit bids\n"
            "3. Compare bids by price, timeline & rating\n"
            "4. Accept the best offer\n\n"
            "**As a Contractor:**\n"
            "1. Browse available projects\n"
            "2. Submit a competitive bid\n"
            "3. Include your timeline & scope of work\n"
            "4. Wait for customer approval\n\n"
            "Renexa ensures transparent & fair bidding for both sides. ⚖️"
        )

    # ── Project Tracking ──────────────────────────────────────────────────────
    if any(w in msg for w in ["track", "progress", "status", "update", "milestone"]):
        return (
            "📊 **Project Tracking on Renexa**\n\n"
            "You can monitor your project in real-time:\n"
            "• View completion **percentage**\n"
            "• See **milestone** updates from your contractor\n"
            "• Upload & view **progress photos**\n"
            "• Get **notifications** on key updates\n\n"
            "Go to **My Projects** in your dashboard to check status."
        )

    # ── Payment / Cost Related ────────────────────────────────────────────────
    if any(w in msg for w in ["payment", "pay", "installment", "advance", "paise", "rupee", "pkr"]):
        return (
            "💰 **Payment Advice for Construction**\n\n"
            "Recommended payment structure:\n"
            "• **20–30%** advance at project start\n"
            "• **Milestone-based** payments during construction\n"
            "• **10–15%** retention until final handover\n\n"
            "⚠️ Never pay 100% upfront. Always link payments to milestones!\n\n"
            "Renexa supports milestone-based tracking to protect your investment. 🔒"
        )

    # ── What can you do / help ────────────────────────────────────────────────
    if any(w in msg for w in ["help", "what can", "features", "use", "service", "do you"]):
        return (
            "🤖 **I can help you with:**\n\n"
            "💰 **Cost Estimation**\n"
            "   _'Estimate cost for 5 marla house'_\n\n"
            "📐 **Area Conversion**\n"
            "   _'How many sqft is 10 marla?'_\n\n"
            "⏳ **Construction Timeline**\n"
            "   _'How long to build a 10 marla house?'_\n\n"
            "⭐ **Quality Comparison**\n"
            "   _'What is the difference between A and Premium?'_\n\n"
            "👷 **Contractor Guidance**\n"
            "   _'How do I hire a contractor?'_\n\n"
            "📋 **Bidding Help**\n"
            "   _'How does bidding work?'_\n\n"
            "📊 **Project Tracking**\n"
            "   _'How do I track my project?'_"
        )

    # ── Fallback ──────────────────────────────────────────────────────────────
    return (
        "🤔 I'm not sure about that, but I can help with:\n\n"
        "• Construction cost estimates\n"
        "• Area conversions (marla, kanal, sqft)\n"
        "• Contractor & bidding advice\n"
        "• Project timelines\n\n"
        "Try asking: _'Estimate cost for 5 marla house A+ quality'_"
    )
