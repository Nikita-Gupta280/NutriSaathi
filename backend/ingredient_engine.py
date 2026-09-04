import json
from pathlib import Path


KNOWLEDGE_FILE = Path(__file__).parent / "knowledge" / "ingredients.json"


def load_ingredient_knowledge():
    """Load ingredient rules from the JSON knowledge base."""
    with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    return data.get("ingredients", {})


def normalize_ingredient(ingredient):
    """Normalize an ingredient name for matching."""
    return ingredient.strip().lower().replace("-", "_").replace(" ", "_")


def analyze_ingredients(ingredients):
    """
    Analyze a list of ingredients using the NutriSaathi knowledge base.

    Returns detected rules for each recognized ingredient.
    """
    knowledge = load_ingredient_knowledge()
    results = []

    for ingredient in ingredients:
        normalized = normalize_ingredient(ingredient)

        if normalized in knowledge:
            rule = knowledge[normalized]

            results.append({
                "ingredient": ingredient,
                "matched_as": normalized,
                "category": rule["category"],
                "tags": rule["tags"],
                "risk": rule["risk"]
            })

    return results


if __name__ == "__main__":
    test_ingredients = [
        "wheat",
        "sugar",
        "peanut",
        "milk",
        "garlic"
    ]

    results = analyze_ingredients(test_ingredients)

    print(json.dumps(results, indent=2))