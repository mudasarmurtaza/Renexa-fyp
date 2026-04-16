from flask import Flask, request, jsonify
from flask_cors import CORS
import logic

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend integration

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "healthy", "service": "Renexa AI Bot"})

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data.get("message", "")
    
    # Process message logic
    response_text = logic.get_ai_response(user_message)
    
    return jsonify({
        "reply": response_text,
        "sender": "AI Assistant"
    })

@app.route('/estimate', methods=['POST'])
def estimate():
    data = request.json
    area = data.get("area")
    quality = data.get("quality", "A")
    include_finishing = data.get("include_finishing", True)
    
    result = logic.calculate_estimate(area, quality, include_finishing)
    return jsonify(result)

if __name__ == '__main__':
    print("🤖 Renexa AI Assistant Service starting on http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
