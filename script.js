const API_BASE_URL = "http://127.0.0.1:3000";

// Fetch and display all recipes
async function fetchRecipes() {
  try {
    const response = await fetch(`${API_BASE_URL}/recipes`);
    const data = await response.json();

    if (response.ok) {
      displayRecipes(data);
    } else {
      showError(data.message || "Failed to fetch recipes");
    }
  } catch (error) {
    showError("Error fetching recipes");
  }
}

// Display the list of recipes
function displayRecipes(recipes) {
  const recipeList = document.getElementById("recipe-list");
  recipeList.innerHTML = recipes
    .map(
      (recipe) => `
        <div class="recipe" onclick="navigateToDetails('${recipe.name}')">
            <img src="${recipe.image || "placeholder.jpg"}" alt="${
        recipe.name
      }">
            <span>${recipe.name}</span>
        </div>
    `
    )
    .join("");
}

// Navigate to the details page
function navigateToDetails(recipeName) {
  window.location.href = `details.html?name=${encodeURIComponent(recipeName)}`;
}

// Navigate to the favorites page
function navigateToFavorites() {
  window.location.href = "favorites.html";
}

// Show error messages
function showError(message) {
  const recipeDetails = document.getElementById("recipe-list");
  recipeDetails.innerHTML = `<p class="error">${message}</p>`;
}

// Load recipes on page load
fetchRecipes();
