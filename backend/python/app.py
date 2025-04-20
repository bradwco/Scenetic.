import os
import json
import random
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# Load .env variables
load_dotenv()

# Configure Gemini API
api_key = os.getenv("GEMINI_API_KEY")
print("Loaded GEMINI_API_KEY:", api_key is not None)

genai.configure(api_key=api_key)
model = genai.GenerativeModel(
    model_name="models/gemini-2.0-flash-lite",
    generation_config={
        "temperature": 0.8,
        "top_p": 1,
        "top_k": 1,
        "max_output_tokens": 256,
    }
)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Track previously used words
previously_used_words = set()

def get_fresh_fallback_tags():
    # List of potential fallback tags
    all_fallbacks = [
        "Sunset", "Rain", "Fog", "Beach", "Forest", "City", "Snow", "Desert",
        "Dawn", "Night", "Storm", "Ocean", "Mountain", "Village", "Garden", "Bridge",
        "Sunrise", "Mist", "Lake", "Valley", "Cave", "Waterfall", "Field", "Island",
        "Twilight", "Clouds", "River", "Cliff", "Temple", "Ruins", "Meadow", "Harbor"
    ]
    # Get 8 random tags that haven't been used recently
    available_tags = [tag for tag in all_fallbacks if tag not in previously_used_words]
    if len(available_tags) < 8:
        # If we've used most tags, reset the tracking
        previously_used_words.clear()
        available_tags = all_fallbacks
    selected_tags = random.sample(available_tags, 8)
    previously_used_words.update(selected_tags)
    return selected_tags

def generate_scene_tags(max_retries=5):
    prompt = (
        "Generate a JSON array of exactly 8 unique, simple one-word visual movie scene tags. "
        "Each tag should describe a distinct visual element or characteristic of a movie scene that helps identify its mood and atmosphere. "
        "Focus on visual elements like lighting, weather, time of day, setting, and prominent visual features. "
        "DO NOT use any of these previously used words: " + ", ".join(previously_used_words) + ". "
        "Examples of good visual tags (but don't use these exact words): 'Sunset', 'Rain', 'Fog', 'Beach', 'Forest', 'City', 'Snow', 'Desert'. "
        "Avoid abstract concepts and focus on things that can be visually captured in a scene. "
        "Only respond with a plain JSON array of strings like [\"Dawn\", \"Storm\", \"Ocean\"] — no explanation, no formatting."
    )

    for attempt in range(max_retries):
        try:
            response = model.generate_content(prompt)
            text = response.text.strip()

            print(f"Gemini raw response (attempt {attempt + 1}):", text)

            # Handle markdown code block format
            if text.startswith("```json"):
                text = text.split("```json")[1].strip()
            elif text.startswith("```"):
                text = text.split("```")[1].strip()
            
            # Remove any remaining markdown code block markers
            text = text.replace("```", "").strip()

            # Parse the JSON and ensure it's a list of strings
            tags = json.loads(text)
            if isinstance(tags, list):
                # Ensure we have exactly 8 unique tags
                tags = list(set(tags))[:8]  # Remove duplicates and take first 8
                if len(tags) < 8:
                    continue  # Try again if we don't have enough unique tags
                
                # Check if any tags were previously used
                if any(tag in previously_used_words for tag in tags):
                    continue  # Try again if any tags were previously used
                
                print("Parsed tags:", tags)
                previously_used_words.update(tags)
                return tags
        except Exception as e:
            print(f"Gemini error (attempt {attempt + 1}):", e)
            print("Failed to parse text:", text)
        time.sleep(1)

    # If all retries fail, use fresh fallback tags
    fallback_tags = get_fresh_fallback_tags()
    print("Using fallback tags:", fallback_tags)
    return fallback_tags

@app.route("/generate-tags", methods=["GET"])
def api_generate_tags():
    tags = generate_scene_tags()
    print("Sending tags:", tags)
    return jsonify(tags=tags)

@app.route("/extract-keywords", methods=["POST"])
def api_extract_keywords():
    try:
        data = request.get_json()
        description = data.get("description", "")
        print("Received description:", description)
        prompt = f"Extract 5 important one-word keywords from the following scene description. Respond with a JSON array: {description}"
        response = model.generate_content(prompt)
        raw = response.text.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1].strip()
        print("Keyword extraction response:", raw)
        keywords = json.loads(raw)
        return jsonify(keywords=keywords)
    except Exception as e:
        print("Keyword extraction error:", e)
        return jsonify(keywords=[]), 500

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5001)
