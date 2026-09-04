from flask import Blueprint, jsonify, request


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

    # Nikita's analysis engine will be connected here
    # after backend-nikita is merged into backend-kashish.
    return jsonify({
        "success": True,
        "message": "Analysis API ready",
        "product_id": product_id,
        "family_members": family_members
    }), 200