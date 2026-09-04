from flask import Blueprint, jsonify, request

comparison_bp = Blueprint("comparison", __name__)


@comparison_bp.post("/api/comparison")
def compare_products():
    data = request.get_json(silent=True) or {}

    products = data.get("products", [])

    if not isinstance(products, list):
        return jsonify({
            "success": False,
            "error": "products must be a list"
        }), 400

    if len(products) < 2:
        return jsonify({
            "success": False,
            "error": "At least 2 products are required"
        }), 400

    return jsonify({
        "success": True,
        "products": products,
        "count": len(products)
    }), 200