from .product_loader import get_product_by_id
from .ingredient_engine import analyze_ingredients
from .family_engine import evaluate_family
from .health_score import calculate_health_score


def analyze_product(product_id, family_members):
    """
    Run a complete NutriSaathi analysis for one product.

    Pipeline:
    Product Loader
        ↓
    Ingredient Engine
        ↓
    Health Score
        ↓
    Family Engine
    """

    # 1. Load product
    product = get_product_by_id(product_id)

    if product is None:
        return {
            "success": False,
            "error": "Product not found"
        }

    # 2. Analyze ingredients
    ingredient_analysis = analyze_ingredients(
        product["ingredients"]
    )

    # 3. Calculate deterministic health score
    health_score_result = calculate_health_score(
        product["nutrition"]
    )

    score_100 = health_score_result["score"]
    score_10 = round(score_100 / 10, 1)

    # 4. Analyze product for every family member
    family_results = evaluate_family(
        family_members,
        product["ingredients"],
        product["nutrition"]
    )

    # 5. Return complete analysis
    return {
        "success": True,
        "product": product,
        "health_score": {
            "score": score_10,
            "scale": 10,
            "label": health_score_result["label"],
            "details": health_score_result["deductions"]
        },
        "ingredient_analysis": ingredient_analysis,
        "family_results": family_results
    }


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

    result = analyze_product(
        "IND-0001",
        family
    )

    import json

    print(json.dumps(result, indent=2))

    