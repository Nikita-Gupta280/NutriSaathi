from flask import Blueprint, jsonify, request

from backend.analysis_engine import analyze_product
from backend.services.off_service import get_product_by_barcode


analysis_bp = Blueprint("analysis", __name__)


@analysis_bp.post("/api/analysis")
def analyze():
    data = request.get_json(silent=True) or {}

    product_id = data.get("product_id")
    family_members = data.get("family_members", [])

    if not product_id:
        return jsonify({
            "success": False,
            "error": "product_id is required"
        }), 400

    if not isinstance(family_members, list):
        return jsonify({
            "success": False,
            "error": "family_members must be a list"
        }), 400

    try:
        result = analyze_product(
            product_id,
            family_members
        )

        return jsonify(result), 200

    except Exception as exc:
        return jsonify({
            "success": False,
            "error": str(exc)
        }), 500