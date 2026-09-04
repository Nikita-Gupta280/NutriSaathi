import json
from pathlib import Path

from .ingredient_engine import analyze_ingredients
from .health_engine import evaluate_health

INGREDIENTS_FILE = Path(__file__).parent / "knowledge" / "ingredients.json"


VERDICT_PRIORITY = {
    "ALLERGY_CONCERN": 5,
    "NOT_SUITABLE": 4,
    "CAUTION": 3,
    "MODERATE": 2,
    "SUITABLE": 1,
    "UNKNOWN": 0
}


def load_ingredient_knowledge():
    """Load ingredient knowledge."""
    with open(INGREDIENTS_FILE, "r", encoding="utf-8") as file:
        data = json.load(file)

    return data.get("ingredients", {})


def evaluate_member(member, ingredients, nutrition):
    """
    Evaluate one product for one family member.
    """

    ingredient_results = analyze_ingredients(ingredients)
    knowledge = load_ingredient_knowledge()

    allergy_concerns = []
    dietary_concerns = []

    # Check allergies
    for result in ingredient_results:
        tags = result.get("tags", [])

        for allergy in member.get("allergies", []):
            allergy = allergy.lower().strip()

            if allergy in tags or allergy == result["matched_as"]:
                allergy_concerns.append(
                    f"{result['ingredient']} may conflict with {allergy} allergy"
                )

    # Check dietary preferences
    preferences = [
        preference.lower().strip()
        for preference in member.get("dietary_preferences", [])
    ]

    for result in ingredient_results:
        tags = result.get("tags", [])

        if "vegetarian" in preferences and "non_vegetarian" in tags:
            dietary_concerns.append(
                f"{result['ingredient']} is not vegetarian"
            )

        if "vegan" in preferences and (
            "non_vegetarian" in tags or "dairy" in tags
        ):
            dietary_concerns.append(
                f"{result['ingredient']} conflicts with vegan preference"
            )

        if "egg_free" in preferences and "egg" in tags:
            dietary_concerns.append(
                f"{result['ingredient']} contains egg"
            )

        if "gluten_free" in preferences and "gluten" in tags:
            dietary_concerns.append(
                f"{result['ingredient']} contains gluten"
            )

        if "jain" in preferences and "jain_conflict" in tags:
            dietary_concerns.append(
                f"{result['ingredient']} conflicts with Jain preference"
            )

    # Allergy has highest priority
    if allergy_concerns:
        return {
            "member_id": member["member_id"],
            "name": member["name"],
            "verdict": "ALLERGY_CONCERN",
            "severity": "high",
            "reasons": allergy_concerns
        }

    # Dietary conflict comes next
    if dietary_concerns:
        return {
            "member_id": member["member_id"],
            "name": member["name"],
            "verdict": "NOT_SUITABLE",
            "severity": "high",
            "reasons": dietary_concerns
        }

    # Health considerations
    health_results = []

    for health_consideration in member.get(
        "health_considerations", []
    ):
        result = evaluate_health(
            nutrition,
            health_consideration
        )
        health_results.append(result)

    health_concerns = []

    for result in health_results:
        health_concerns.extend(result.get("concerns", []))

    if health_concerns:
        has_high = any(
            concern["level"] == "HIGH"
            for concern in health_concerns
        )

        return {
            "member_id": member["member_id"],
            "name": member["name"],
            "verdict": "CAUTION" if has_high else "MODERATE",
            "severity": "medium",
            "reasons": [
                concern["reason"]
                for concern in health_concerns
            ]
        }

    return {
        "member_id": member["member_id"],
        "name": member["name"],
        "verdict": "SUITABLE",
        "severity": "low",
        "reasons": []
    }


def evaluate_family(family_members, ingredients, nutrition):
    """Evaluate one product for every family member."""

    return [
        evaluate_member(
            member,
            ingredients,
            nutrition
        )
        for member in family_members
    ]


if __name__ == "__main__":

    family = [
        {
            "member_id": "dad",
            "name": "Dad",
            "dietary_preferences": [],
            "allergies": [],
            "health_considerations": ["diabetes"]
        },
        {
            "member_id": "mom",
            "name": "Mom",
            "dietary_preferences": ["vegetarian"],
            "allergies": [],
            "health_considerations": []
        },
        {
            "member_id": "dadi",
            "name": "Dadi",
            "dietary_preferences": ["jain"],
            "allergies": [],
            "health_considerations": []
        },
        {
            "member_id": "child",
            "name": "Child",
            "dietary_preferences": [],
            "allergies": ["peanut"],
            "health_considerations": []
        }
    ]

    ingredients = [
        "wheat",
        "sugar",
        "peanut",
        "milk",
        "garlic"
    ]

    nutrition = {
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

    results = evaluate_family(
        family,
        ingredients,
        nutrition
    )

    print(json.dumps(results, indent=2))
