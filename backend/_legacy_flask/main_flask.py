from flask import Flask, jsonify
from flask_cors import CORS
from routes.api_routes import api_bp
import sys
import os

# Ensure backend folder is in python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    app.register_blueprint(api_bp)

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def server_error(e):
        return jsonify({"error": "Internal server error", "details": str(e)}), 500

    return app

app = create_app()

if __name__ == "__main__":
    print("🚀 Starting MERIDIAN Cold Case Intelligence Platform Backend Server...")
    print("📍 API Base: http://localhost:5000/api")
    app.run(host="0.0.0.0", port=5000, debug=True)
