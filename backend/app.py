from flask import Flask, jsonify
from flask_cors import CORS

from backend.config import Config
from backend.routes.product_routes import product_bp
from backend.routes.scan_routes import scan_bp
from backend.routes.analysis_routes import analysis_bp
from backend.routes.family_routes import family_bp
from backend.routes.history_routes import history_bp
from backend.routes.comparison_routes import comparison_bp
from backend.routes.chat_routes import chat_bp


app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

app.register_blueprint(product_bp)
app.register_blueprint(scan_bp)
app.register_blueprint(analysis_bp)
app.register_blueprint(family_bp)
app.register_blueprint(history_bp)
app.register_blueprint(comparison_bp)
app.register_blueprint(chat_bp)


@app.get("/")
def home():
    return jsonify({
        "success": True,
        "app": "NutriSaathi",
        "message": "NutriSaathi backend is running"
    })


@app.get("/api/health")
def health():
    return jsonify({
        "success": True,
        "status": "healthy"
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )