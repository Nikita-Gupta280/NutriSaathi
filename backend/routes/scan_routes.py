import os
import tempfile

from flask import Blueprint, jsonify, request

from backend.services.ocr_service import extract_text_from_image
from backend.services.off_service import get_product_by_barcode
from backend.ingredient_engine import analyze_ingredients
from backend.health_score import calculate_health_score
from backend.analysis_engine import analyze_external_product

scan_bp = Blueprint("scans", __name__)

@scan_bp.post("/api/scan/barcode")
def scan_barcode():
    data = request.get_json(silent=True) or {}
    barcode = str(data.get("barcode", "")).strip()

    if not barcode:
        return jsonify({
            "success": False,
            "error": "barcode is required"
        }), 400

    product = get_product_by_barcode(barcode)

    if not product:
        return jsonify({
            "success": False,
            "error": "Product not found in Open Food Facts",
            "barcode": barcode
        }), 404

    family_members = data.get("family_members", [])

    if not isinstance(family_members, list):
        return jsonify({
            "success": False,
            "error": "family_members must be a list"
        }), 400

    try:
        result = analyze_external_product(
            product,
            family_members
        )

        return jsonify(result), 200

    except Exception as exc:
        return jsonify({
            "success": False,
            "error": str(exc)
        }), 500

@scan_bp.post("/api/scan/ocr")
def scan_ocr():
    if "image" not in request.files:
        return jsonify({
            "success": False,
            "error": "Image file is required"
        }), 400

    image = request.files["image"]

    if not image.filename:
        return jsonify({
            "success": False,
            "error": "Image filename is required"
        }), 400

    temp_path = None

    try:
        suffix = os.path.splitext(image.filename)[1] or ".jpg"

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=suffix
        ) as temp_file:
            image.save(temp_file.name)
            temp_path = temp_file.name

        result = extract_text_from_image(temp_path)

        if not result["success"]:
            return jsonify(result), 500

        return jsonify({
            "success": True,
            "text": result["text"]
        }), 200

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)