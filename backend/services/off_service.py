import requests

from backend.config import Config


def get_product_by_barcode(barcode):
    """
    Fetch a product from Open Food Facts using its barcode.
    Returns a normalized product dictionary or None if not found.
    """

    barcode = str(barcode).strip()

    if not barcode:
        return None

    url = f"{Config.OPENFOODFACTS_BASE_URL}/api/v2/product/{barcode}.json"

    headers = {
        "User-Agent": "NutriSaathi/1.0 (hackathon project)"
    }

    try:
        response = requests.get(
            url,
            headers=headers,
            timeout=10
        )

        response.raise_for_status()
        data = response.json()

    except requests.RequestException:
        return None
    except ValueError:
        return None

    if data.get("status") != 1:
        return None

    product = data.get("product", {})

    nutriments = product.get("nutriments", {})


    return {
        "product_id": product.get("id"),
        "barcode": barcode,
        "product_name": product.get("product_name") or "Unknown product",
        "brand": product.get("brands") or "",
        "category": (
            "SPREAD"
            if "spread" in (product.get("categories") or "").lower()
            else product.get("categories") or ""
        ),
        "subcategory": (
            "CHOCOLATESPREAD"
            if "chocolate" in (product.get("categories") or "").lower()
            and "spread" in (product.get("categories") or "").lower()
            else ""
        ),
        "ingredients": [
            item.strip()
            for item in (
                product.get("ingredients_text_en")
                or product.get("ingredients_text")
                or ""
            ).split(",")
            if item.strip()
        ],
        "allergens": product.get("allergens") or "",
        "nutrition": {
            "calories_kcal": nutriments.get("energy-kcal_100g"),
            "carbohydrates_g": nutriments.get("carbohydrates_100g"),
            "protein_g": nutriments.get("proteins_100g"),
            "total_fat_g": nutriments.get("fat_100g"),
            "saturated_fat_g": nutriments.get("saturated-fat_100g"),
            "trans_fat_g": nutriments.get("trans-fat_100g"),
            "sugar_g": nutriments.get("sugars_100g"),
            "dietary_fiber_g": nutriments.get("fiber_100g"),
            "sodium_mg": (
                nutriments.get("sodium_100g") * 1000
                if nutriments.get("sodium_100g") is not None
                else None
            ),
        },
        "source": "open_food_facts",
        "confidence": 0.9
    }