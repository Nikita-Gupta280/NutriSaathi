import os
import tempfile

from flask import Blueprint, jsonify, request

from backend.services.ocr_service import extract_text_from_image

scan_bp = Blueprint("scans", __name__)


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