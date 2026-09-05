from flask import Blueprint, request, jsonify

from backend.analysis_engine import analyze_product
from backend.services.chat_service import chat_with_groq


chat_bp = Blueprint("chat", __name__)


@chat_bp.post("/api/chat")
def chat():
    try:
        data = request.get_json(silent=True) or {}

        message = data.get("message", "").strip()
        product_id = data.get("product_id")
        family_members = data.get("family_members", [])

        if not message:
            return jsonify({
                "success": False,
                "error": "Message is required"
            }), 400

        if not isinstance(family_members, list):
            return jsonify({
                "success": False,
                "error": "family_members must be a list"
            }), 400

        context = None

        # If a product is provided, generate the real NutriSaathi
        # analysis instead of relying on frontend-generated context.
        if product_id:
            analysis = analyze_product(
                product_id,
                family_members
            )

            if not analysis.get("success"):
                return jsonify(analysis), 404

            context = analysis

        answer = chat_with_groq(
            message,
            context
        )

        return jsonify({
            "success": True,
            "answer": answer
        }), 200

    except Exception as exc:
        return jsonify({
            "success": False,
            "error": str(exc)
        }), 500