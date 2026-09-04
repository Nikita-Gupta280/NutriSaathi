import csv
import re
from pathlib import Path


# CSV is in the root data/ folder
DATA_FILE = Path(__file__).resolve().parent.parent / "data" / "nutrisaathi_products.csv"


def _to_float(value):
    """Convert a CSV value to float, returning None when unavailable."""
    if value is None or str(value).strip() == "":
        return None

    try:
        return float(value)
    except (ValueError, TypeError):
        return None


def _parse_ingredients(value):
    """Convert the ingredient text into a clean list."""
    if not value:
        return []

    # Most ingredient lists use commas or semicolons.
    parts = re.split(r"[;,]", str(value))

    return [
        ingredient.strip()
        for ingredient in parts
        if ingredient.strip()
    ]


def _normalize_product(row):
    """Convert one CSV row into NutriSaathi's internal product format."""

    return {
        "product_id": row.get("product_id"),
        "barcode": None,
        "product_name": row.get("product_name", "").strip(),
        "brand": row.get("brand", "").strip(),
        "category": row.get("category", "").strip(),
        "sub_category": row.get("sub_category", "").strip(),

        "ingredients": _parse_ingredients(
            row.get("ingredients", "")
        ),

        "nutrition": {
            "serving_size_g": _to_float(row.get("serving_size_g")),
            "calories_kcal": _to_float(row.get("calories_kcal")),
            "carbohydrates_g": _to_float(row.get("carbohydrates_g")),
            "protein_g": _to_float(row.get("protein_g")),
            "total_fat_g": _to_float(row.get("total_fat_g")),
            "saturated_fat_g": _to_float(row.get("saturated_fat_g")),
            "trans_fat_g": _to_float(row.get("trans_fat_g")),
            "sugar_g": _to_float(row.get("sugar_g")),
            "sodium_mg": _to_float(row.get("sodium_mg")),
            "dietary_fiber_g": _to_float(row.get("dietary_fiber_g")),
            "cholesterol_mg": _to_float(row.get("cholesterol_mg")),
            "calcium_mg": _to_float(row.get("calcium_mg")),
            "iron_mg": _to_float(row.get("iron_mg"))
        },

        "vitamin_info": row.get("vitamin_info", "").strip(),
        "price_inr": _to_float(row.get("price_inr")),

        "allergens": [],
        "labels": [],

        "source": "local",
        "source_id": row.get("product_id")
    }


def load_products():
    """Load all products from the local NutriSaathi CSV."""

    if not DATA_FILE.exists():
        raise FileNotFoundError(
            f"Product dataset not found: {DATA_FILE}"
        )

    products = []

    with open(DATA_FILE, "r", encoding="utf-8-sig", newline="") as file:
        reader = csv.DictReader(file)

        for row in reader:
            products.append(_normalize_product(row))

    return products


def get_product_by_id(product_id):
    """Find one product by its NutriSaathi product ID."""

    products = load_products()

    for product in products:
        if product["product_id"] == product_id:
            return product

    return None


def search_products(query):
    """Simple local product search by name or brand."""

    query = query.strip().lower()

    if not query:
        return []

    products = load_products()

    return [
        product
        for product in products
        if query in product["product_name"].lower()
        or query in product["brand"].lower()
    ]


if __name__ == "__main__":

    products = load_products()

    print(f"Loaded products: {len(products)}")

    if products:
        product = products[0]

        print("\nFirst product:")
        print(f"ID: {product['product_id']}")
        print(f"Name: {product['product_name']}")
        print(f"Brand: {product['brand']}")
        print(f"Category: {product['category']}")
        print(f"Ingredients: {product['ingredients']}")
        print(f"Nutrition: {product['nutrition']}")