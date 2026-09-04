import json
import re
from pathlib import Path


KNOWLEDGE_FILE = Path(__file__).parent / "knowledge" / "ingredients.json"


def load_ingredient_knowledge():
    """Load ingredient rules from the JSON knowledge base."""
    with open(KNOWLEDGE_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    return data.get("ingredients", {})


def normalize_ingredient(ingredient):
    """Normalize an ingredient name for matching."""
    return (
        ingredient
        .strip()
        .lower()
        .replace("-", "_")
        .replace(" ", "_")
    )


def ingredient_matches(ingredient, knowledge_name, rule):
    """
    Check whether a product ingredient matches a knowledge-base rule.

    Supports:
    - Exact matches
    - Known aliases
    - Matching a known ingredient inside a longer phrase
    """

    ingredient_text = ingredient.strip().lower()
    normalized = normalize_ingredient(ingredient)

    # Exact normalized match
    if normalized == knowledge_name:
        return True

    # Optional aliases from the knowledge base
    aliases = rule.get("aliases", [])

    for alias in aliases:
        alias = alias.strip().lower()

        if alias and re.search(
            rf"\b{re.escape(alias)}\b",
            ingredient_text,
            re.IGNORECASE
        ):
            return True

    # Match the knowledge-base name inside a longer ingredient phrase
    searchable_name = knowledge_name.replace("_", " ")

    if re.search(
        rf"\b{re.escape(searchable_name)}\b",
        ingredient_text,
        re.IGNORECASE
    ):
        return True

    return False


def analyze_ingredients(ingredients):
    """
    Analyze a list of ingredients using the NutriSaathi knowledge base.

    Returns structured matches for recognized ingredients.
    """

    knowledge = load_ingredient_knowledge()
    results = []

    for ingredient in ingredients:

        matched_rule = None
        matched_name = None

        # Prefer the most specific/longest matching knowledge name.
        for knowledge_name, rule in knowledge.items():

            if ingredient_matches(
                ingredient,
                knowledge_name,
                rule
            ):
                if (
                    matched_name is None
                    or len(knowledge_name) > len(matched_name)
                ):
                    matched_name = knowledge_name
                    matched_rule = rule

        if matched_rule:
            results.append({
                "ingredient": ingredient,
                "matched_as": matched_name,
                "category": matched_rule["category"],
                "tags": matched_rule["tags"],
                "risk": matched_rule["risk"]
           })

    return results


if __name__ == "__main__":

    test_ingredients = [
        "wheat",
        "REFINED WHEAT FLOUR (MAIDA)",
        "SOY LECITHIN",
        "milk",
        "MILK SOLIDS",
        "garlic",
        "sugar"
    ]

    results = analyze_ingredients(test_ingredients)

    print(json.dumps(results, indent=2))