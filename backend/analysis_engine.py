from backend.product_loader import get_product_by_id
from backend.ingredient_engine import analyze_ingredients
from backend.family_engine import evaluate_family
from backend.health_score import calculate_health_score
from backend.recommendation import recommend_products

def analyze_product(product_id, family_members):
    """
    Run a complete NutriSaathi analysis for one product.

    Pipeline:
    Product Loader
        ↓
    Ingredient Engine
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

    health_score_result = calculate_health_score(
    product["nutrition"]
    )

    # 3. Analyze product for every family member
    family_results = evaluate_family(
        family_members,
        product["ingredients"],
        product["nutrition"]
    )
    recommendations = recommend_products(
        product,
        family_members
    )

    # 4. Return complete analysis
    score_100 = health_score_result["score"]
    score_10 = round(score_100 / 10, 1)

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
        "family_results": family_results,
        "recommendations": recommendations
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


def analyze_external_product(product, family_members):
    """
    Run the same NutriSaathi intelligence on an external product.
    """

    ingredient_analysis = analyze_ingredients(
        product.get("ingredients", "")
    )

    health_score_result = calculate_health_score(
        product.get("nutrition", {})
    )

    score_100 = health_score_result["score"]
    score_10 = round(score_100 / 10, 1)

    family_results = evaluate_family(
        family_members,
        product.get("ingredients", ""),
        product.get("nutrition", {})
    )

    recommendations = recommend_products(
        product,
        family_members
    )

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
        "family_results": family_results,
        "recommendations": recommendations
    }