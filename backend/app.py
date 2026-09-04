from flask import Flask, jsonify
from flask_cors import CORS

from config import Config
from routes.product_routes import product_bp
from routes.scan_routes import scan_bp
from routes.analysis_routes import analysis_bp


app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

app.register_blueprint(product_bp)
app.register_blueprint(scan_bp)
app.register_blueprint(analysis_bp)


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