from flask import Blueprint, jsonify, request


family_bp = Blueprint("family", __name__)

families = {}


@family_bp.get("/api/family")
def get_family():
    return jsonify({
        "success": True,
        "family_members": list(families.values())
    })


@family_bp.post("/api/family")
def add_family_member():
    data = request.get_json(silent=True) or {}

    member_id = data.get("member_id")
    name = data.get("name")

    if not member_id or not name:
        return jsonify({
            "success": False,
            "error": "member_id and name are required"
        }), 400

    member = {
        "member_id": member_id,
        "name": name,
        "dietary_preferences": data.get(
            "dietary_preferences", []
        ),
        "allergies": data.get(
            "allergies", []
        ),
        "health_considerations": data.get(
            "health_considerations", []
        )
    }

    families[member_id] = member

    return jsonify({
        "success": True,
        "member": member
    }), 201


@family_bp.delete("/api/family/<member_id>")
def delete_family_member(member_id):
    if member_id not in families:
        return jsonify({
            "success": False,
            "error": "Family member not found"
        }), 404

    deleted = families.pop(member_id)

    return jsonify({
        "success": True,
        "member": deleted
    }), 200