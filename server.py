from flask import Flask, jsonify, request
from flask_cors import CORS

import aiohttp
import asyncio
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get the API base URL and port from environment variables
API_BASE_URL = os.getenv("API_BASE_URL")
PORT = os.getenv("PORT", 5000)  # Default to 5000 if PORT is not set in .env

# Asynchronous function to fetch recipe details
async def fetch_recipe_details(session, recipe):
    try:
        async with session.get(f'http://localhost:3000/recipes/{recipe}') as recipe_response:
            recipe_data = await recipe_response.json()

        # Verify the image link
        image_url = recipe_data.get('foodImage')
        async with session.head(image_url) as image_response:
            if image_response.status == 200:
                return {"name": recipe, "image": image_url}
            else:
                return {"name": recipe, "image": None}
    except Exception:
        return None

@app.route("/recipes", methods=["GET"])
async def get_recipes():
    try:
        async with aiohttp.ClientSession() as session:
            # Fetch the list of recipe names
            async with session.get(f"{API_BASE_URL}/all") as response:
                recipes_list = (await response.json()).get('recipesList', [])

            # Create a list of tasks to fetch recipe details concurrently
            tasks = [fetch_recipe_details(session, recipe) for recipe in recipes_list]
            recipes_details = await asyncio.gather(*tasks)

            # Filter out failed requests
            filtered_recipes = [recipe for recipe in recipes_details if recipe is not None]

            return jsonify(filtered_recipes)

    except Exception as error:
        return jsonify({"message": "Error fetching recipes", "error": str(error)}), 500

@app.route("/recipes/<name>", methods=["GET"])
async def get_recipe_by_name(name):
    try:
        async with aiohttp.ClientSession() as session:
            # Make a request to the API with the encoded recipe name
            async with session.get(f"{API_BASE_URL}/{name}") as response:
                if response.status == 200:
                    return jsonify(await response.json())
                else:
                    return jsonify({"message": f"Recipe '{name}' not found"}), 404
    except Exception as error:
        return jsonify({"message": f"Error fetching recipe '{name}'", "error": str(error)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=int(PORT))
