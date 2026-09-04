from typing import Dict, Any


def calculate_health_score(nutrition: Dict[str, Any]):
    """
    Calculate a general nutrition screening score from 0-100.

    This is an MVP food-quality score, not a medical recommendation.
    """

    score = 100
    deductions = []

    def deduct(points, reason):
        nonlocal score
        score -= points
        deductions.append({
            "points": points,
            "reason": reason
        })

    # Sugar
    sugar = nutrition.get("sugar_g")
    if sugar is not None:
        if sugar >= 20:
            deduct(25, "High sugar")
        elif sugar >= 10:
            deduct(12, "Moderate sugar")

    # Saturated fat
    saturated_fat = nutrition.get("saturated_fat_g")
    if saturated_fat is not None:
        if saturated_fat >= 5:
            deduct(20, "High saturated fat")
        elif saturated_fat >= 3:
            deduct(10, "Moderate saturated fat")

    # Trans fat
    trans_fat = nutrition.get("trans_fat_g")
    if trans_fat is not None:
        if trans_fat >= 1:
            deduct(20, "High trans fat")
        elif trans_fat >= 0.5:
            deduct(10, "Moderate trans fat")

    # Sodium
    sodium = nutrition.get("sodium_mg")
    if sodium is not None:
        if sodium >= 920:
            deduct(20, "High sodium")
        elif sodium >= 460:
            deduct(10, "Moderate sodium")

    # Dietary fiber
    fiber = nutrition.get("dietary_fiber_g")
    if fiber is not None and fiber < 2:
        deduct(10, "Low dietary fiber")

    # Protein bonus
    protein = nutrition.get("protein_g")
    if protein is not None and protein >= 10:
        score += 5

    # Keep score within 0-100
    score = max(0, min(100, score))

    # Convert score to label
    if score >= 75:
        label = "Good"
    elif score >= 50:
        label = "Moderate"
    else:
        label = "Needs Attention"

    return {
        "score": score,
        "label": label,
        "deductions": deductions
    }


if __name__ == "__main__":

    test_nutrition = {
        "calories_kcal": 479,
        "carbohydrates_g": 73.4,
        "protein_g": 5.9,
        "total_fat_g": 18,
        "saturated_fat_g": 9.4,
        "trans_fat_g": 0,
        "sugar_g": 32.5,
        "sodium_mg": 114,
        "dietary_fiber_g": 0
    }

    result = calculate_health_score(test_nutrition)

    print(result)