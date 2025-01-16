const API_BASE_URL = "http://127.0.0.1:3000";

// Get the recipe name from the URL query string
const urlParams = new URLSearchParams(window.location.search);
const recipeName = urlParams.get("name");

// Fetch and display recipe details
async function fetchRecipeDetails(name) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/recipes/${encodeURIComponent(name)}`
    );
    const data = await response.json();

    if (response.ok) {
      displayRecipeDetails(data);
      setupFavoriteButton(data);
    } else {
      showError(data.message || `Recipe '${name}' not found`);
    }
  } catch (error) {
    showError(`Error fetching recipe '${name}'`);
  }
}

// Display recipe details
function displayRecipeDetails(recipe) {
  const recipeDetails = document.getElementById("recipe-details");
  document.getElementById("recipe-title").textContent = recipe.foodName;

  const ingredients = recipe.keyIngredients
    .map(
      ([image, name]) =>
        `<li class="ingredient-item"><img class="ingredient-image" src="${image}" alt="${name}"> ${name}</li>`
    )
    .join("");

  recipeDetails.innerHTML = `
    <div class="recipe-header">
      <img class="recipe-image" src="${
        recipe.foodImage || "placeholder.jpg"
      }" alt="${recipe.foodName}">
      <p class="recipe-description">${
        recipe.foodDescription || "No description available."
      }</p>
      </div>
    
    <h3 class="ingredients-header">Ingredients:</h3>
    <ul class="ingredients-list">${ingredients}</ul>

    <h3 class="details-header">Details:</h3>
    <p class="details-item"><strong>Eaten with:</strong> ${
      recipe.eatenWith || "Unknown"
    }</p>
    <p class="details-item"><strong>Virya:</strong> ${
      recipe.virya || "Unknown"
    }</p>
    <p class="details-item"><strong>Rasa:</strong> ${
      recipe.rasa || "Unknown"
    }</p>
  `;
}

// Set up the favorite button
function setupFavoriteButton(recipe) {
  const favoriteButton = document.getElementById("favorite-button");

  // Update button state based on whether recipe is already in favorites
  const favorites = getFavorites();
  const isAlreadyFavorite = favorites.some(
    (fav) => fav.foodName === recipe.foodName
  );
  favoriteButton.textContent = isAlreadyFavorite
    ? "Remove from Favorites"
    : "Add to Favorites";

  // Remove existing event listeners
  favoriteButton.replaceWith(favoriteButton.cloneNode(true));

  // Get the new button reference and add event listener
  const newFavoriteButton = document.getElementById("favorite-button");
  newFavoriteButton.addEventListener("click", () => toggleFavorite(recipe));
}

// Toggle favorite status
function toggleFavorite(recipe) {
  const favorites = getFavorites();
  const index = favorites.findIndex((fav) => fav.foodName === recipe.foodName);

  if (index === -1) {
    // Add to favorites
    favorites.push({
      foodName: recipe.foodName,
      foodImage: recipe.foodImage,
      foodDescription: recipe.foodDescription,
      eatenWith: recipe.eatenWith,
      virya: recipe.virya,
      rasa: recipe.rasa,
      keyIngredients: recipe.keyIngredients,
    });
    alert(`${recipe.foodName} added to favorites!`);
  } else {
    // Remove from favorites
    favorites.splice(index, 1);
    alert(`${recipe.foodName} removed from favorites!`);
  }

  // Save updated favorites
  saveFavorites(favorites);

  // Update button state
  setupFavoriteButton(recipe);
}

// Get favorites from localStorage
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  } catch (error) {
    console.error("Error getting favorites:", error);
    return [];
  }
}

// Save favorites to localStorage
function saveFavorites(favorites) {
  try {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  } catch (error) {
    console.error("Error saving favorites:", error);
    alert("Unable to save favorites. Storage might be full.");
  }
}

// Show error messages
function showError(message) {
  const recipeDetails = document.getElementById("recipe-details");
  recipeDetails.innerHTML = `<p class="error">${message}</p>`;
}

// Fetch and display the recipe details
if (recipeName) {
  fetchRecipeDetails(recipeName);
} else {
  showError("No recipe name provided.");
}
