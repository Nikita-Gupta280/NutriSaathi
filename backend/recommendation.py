from .health_score import calculate_health_score
from .family_engine import evaluate_family
from .product_loader import load_products

EXCLUDED_NAME_TERMS = {
    "gift",
    "hamper",
    "gift box",
    "gift set",
    "combo",
}


VERDICT_PENALTY = {
    "ALLERGY_CONCERN": 1000,
    "NOT_SUITABLE": 1000,
    "CAUTION": 20,
    "MODERATE": 10,
    "SUITABLE": 0,
    "UNKNOWN": 5
}

def _is_everyday_product(candidate):
    """
    Exclude obvious gift/hamper products from everyday recommendations.
    """

    text = " ".join([
        candidate.get("product_name", ""),
        candidate.get("sub_category", "")
    ]).lower()

    return not any(
        term in text
        for term in EXCLUDED_NAME_TERMS
    )

def _category_match(scanned_product, candidate):
    """
    Check whether a candidate belongs to the same product category.

    Exact sub-category match gets highest priority.
    Exact category match is also accepted.
    """

    scanned_category = (
        scanned_product.get("category", "").strip().lower()
    )

    candidate_category = (
        candidate.get("category", "").strip().lower()
    )

    scanned_subcategory = (
        scanned_product.get("sub_category", "").strip().lower()
    )

    candidate_subcategory = (
        candidate.get("sub_category", "").strip().lower()
    )

    if (
        scanned_subcategory
        and candidate_subcategory
        and scanned_subcategory == candidate_subcategory
    ):
        return 2

    if (
        scanned_category
        and candidate_category
        and scanned_category == candidate_category
    ):
        return 1

    return 0


def _family_compatibility(candidate, family_members):
    """
    Evaluate a candidate against the family.

    Products with allergy concerns or dietary conflicts are rejected.
    Caution/moderate results are allowed but receive a ranking penalty.
    """

    if not family_members:
        return 0, []

    family_results = evaluate_family(
        family_members,
        candidate["ingredients"],
        candidate["nutrition"]
    )

    worst_priority = 0
    reasons = []

    for result in family_results:
        verdict = result.get("verdict", "UNKNOWN")

        penalty = VERDICT_PENALTY.get(verdict, 5)

        if penalty > worst_priority:
            worst_priority = penalty

        if result.get("reasons"):
            reasons.extend(result["reasons"])

    # Allergy/dietary conflicts make the product unsuitable.
    if worst_priority >= 1000:
        return None, reasons

    return worst_priority, reasons


def _build_why(scanned_product, candidate, candidate_score):
    """
    Generate deterministic explanations for why a candidate
    may be a better option.
    """

    why = []

    scanned_nutrition = scanned_product.get("nutrition", {})
    candidate_nutrition = candidate.get("nutrition", {})

    scanned_score = calculate_health_score(
        scanned_nutrition
    )["score"]

    if candidate_score > scanned_score:
        why.append("Higher overall health score")

    comparisons = [
        ("sugar_g", "Lower sugar"),
        ("saturated_fat_g", "Lower saturated fat"),
        ("trans_fat_g", "Lower trans fat"),
        ("sodium_mg", "Lower sodium"),
    ]

    for nutrient, reason in comparisons:
        scanned_value = scanned_nutrition.get(nutrient)
        candidate_value = candidate_nutrition.get(nutrient)

        if (
            scanned_value is not None
            and candidate_value is not None
            and candidate_value < scanned_value
        ):
            why.append(reason)

    scanned_fiber = scanned_nutrition.get("dietary_fiber_g")
    candidate_fiber = candidate_nutrition.get("dietary_fiber_g")

    if (
        scanned_fiber is not None
        and candidate_fiber is not None
        and candidate_fiber > scanned_fiber
    ):
        why.append("Higher dietary fiber")

    scanned_protein = scanned_nutrition.get("protein_g")
    candidate_protein = candidate_nutrition.get("protein_g")

    if (
        scanned_protein is not None
        and candidate_protein is not None
        and candidate_protein > scanned_protein
    ):
        why.append("Higher protein")

    # Always provide a reason if no individual nutrient comparison fired.
    if not why:
        why.append("Better overall nutrition profile")

    return why[:3]


def recommend_products(
    scanned_product,
    family_members=None,
    limit=3
):
    """
    Recommend better products from the local NutriSaathi dataset.

    Candidates must belong to the same category or sub-category,
    have a better health score, and be compatible with the family.
    """

    if family_members is None:
        family_members = []

    products = load_products()

    scanned_product_id = scanned_product.get("product_id")

    scanned_score = calculate_health_score(
        scanned_product["nutrition"]
    )["score"]

    candidates = []

    for candidate in products:

        # Never recommend the product currently being viewed.
        if candidate.get("product_id") == scanned_product_id:
            continue

            # Avoid gift/hamper products as everyday alternatives.
        if not _is_everyday_product(candidate):
            continue

        category_score = _category_match(
            scanned_product,
            candidate
        )

        # Only same category/sub-category products.
        if category_score == 0:
            continue

        candidate_score_result = calculate_health_score(
            candidate["nutrition"]
        )

        candidate_score = candidate_score_result["score"]

        # Recommendation should actually be better.
        if candidate_score <= scanned_score:
            continue

        family_penalty, family_reasons = _family_compatibility(
            candidate,
            family_members
        )

        # Reject allergy/dietary conflicts.
        if family_penalty is None:
            continue

        why = _build_why(
            scanned_product,
            candidate,
            candidate_score
        )

        ranking_score = (
            candidate_score
            + (category_score * 10)
            - family_penalty
        )

        candidates.append({
            "product_id": candidate["product_id"],
            "product_name": candidate["product_name"],
            "brand": candidate["brand"],
            "category": candidate["category"],
            "sub_category": candidate["sub_category"],
            "health_score": round(candidate_score / 10, 1),
            "health_label": candidate_score_result["label"],
            "why": why,
            "_ranking_score": ranking_score
        })

    candidates.sort(
        key=lambda item: (
            item["_ranking_score"],
            item["health_score"]
        ),
        reverse=True
    )

    recommendations = candidates[:limit]

    # Remove internal ranking field before returning API data.
    for recommendation in recommendations:
        recommendation.pop("_ranking_score", None)

    return recommendations