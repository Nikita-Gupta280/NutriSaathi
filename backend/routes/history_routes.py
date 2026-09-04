from flask import Blueprint, jsonify, request
from datetime import datetime


history_bp = Blueprint("history", __name__)

history = []


@history_bp.get("/api/history")
def get_history():
    return jsonify({
        "success": True,
        "history": history
    })


@history_bp.post("/api/history")
def save_history():
    data = request.get_json(silent=True) or {}

    product = data.get("product")

    if not product:
        return jsonify({
            "success": False,
            "error": "product is required"
        }), 400

    item = {
        "id": len(history) + 1,
        "product": product,
        "analysis": data.get("analysis", {}),
        "timestamp": datetime.utcnow().isoformat()
    }

    history.insert(0, item)

    return jsonify({
        "success": True,
        "item": item
    }), 201


@history_bp.delete("/api/history")
def clear_history():
    history.clear()

    return jsonify({
        "success": True,
        "message": "History cleared"
    })