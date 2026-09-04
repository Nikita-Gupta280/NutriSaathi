from flask import Blueprint, jsonify, request

from services.off_service import get_product_by_barcode


product_bp = Blueprint("products", __name__)


@product_bp.post("/api/products/barcode")
def barcode_product():
    data = request.get_json(silent=True) or {}

    barcode = str(data.get("barcode", "")).strip()

    if not barcode:
        return jsonify({
            "success": False,
            "error": "Barcode is required"
        }), 400

    product = get_product_by_barcode(barcode)

    if product is None:
        return jsonify({
            "success": False,
            "error": "Product not found"
        }), 404

    return jsonify({
        "success": True,
        "product": product
    }), 200


@product_bp.get("/api/products/barcode/<barcode>")
def get_barcode_product(barcode):
    product = get_product_by_barcode(barcode)

    if product is None:
        return jsonify({
            "success": False,
            "error": "Product not found"
        }), 404

    return jsonify({
        "success": True,
        "product": product
    }), 200