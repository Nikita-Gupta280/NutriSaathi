import json
from pathlib import Path


RULES_FILE = Path(__file__).parent / "knowledge" / "health_rules.json"


def load_health_rules():
    """Load health rules from the knowledge base."""
    with open(RULES_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    return data.get("rules", {})


def evaluate_health(nutrition, health_consideration):
    """
    Evaluate a product's nutrition against one health consideration.

    Returns structured nutrition concerns.
    """
    rules = load_health_rules()

    if health_consideration not in rules:
        return {
            "health_consideration": health_consideration,
            "status": "UNKNOWN",
            "concerns": []
        }

    health_rule = rules[health_consideration]
    concerns = []

    for nutrient, thresholds in health_rule.get("nutrients", {}).items():
        value = nutrition.get(nutrient)

        if value is None:
            continue

        # Higher value = worse
        if "high" in thresholds and value >= thresholds["high"]:
            concerns.append({
                "nutrient": nutrient,
                "value": value,
                "level": "HIGH",
                "reason": f"High {nutrient.replace('_', ' ')}"
            })

        elif "moderate" in thresholds and value >= thresholds["moderate"]:
            concerns.append({
                "nutrient": nutrient,
                "value": value,
                "level": "MODERATE",
                "reason": f"Moderate {nutrient.replace('_', ' ')}"
            })

        # Lower value = worse
        elif "low" in thresholds and value < thresholds["low"]:
            concerns.append({
                "nutrient": nutrient,
                "value": value,
                "level": "LOW",
                "reason": f"Low {nutrient.replace('_', ' ')}"
            })

    if any(c["level"] == "HIGH" for c in concerns):
        status = "CAUTION"
    elif concerns:
        status = "MODERATE"
    else:
        status = "SUITABLE"

    return {
        "health_consideration": health_consideration,
        "status": status,
        "concerns": concerns
    }


if __name__ == "__main__":
    test_nutrition = {
        "calories_kcal": 450,
        "carbohydrates_g": 40,
        "protein_g": 6,
        "total_fat_g": 20,
        "saturated_fat_g": 6,
        "trans_fat_g": 0.2,
        "sugar_g": 18,
        "sodium_mg": 500,
        "dietary_fiber_g": 1,
        "cholesterol_mg": 80
    }

    result = evaluate_health(test_nutrition, "diabetes")

    print(json.dumps(result, indent=2))