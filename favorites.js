// Load and display favorite recipes from localStorage
function displayFavorites() {
  const favorites = getFavorites();
  const favoritesList = document.getElementById("favorites-list");

  if (favorites.length > 0) {
    favoritesList.innerHTML = favorites
      .map(
        (recipe) => `
        <div class="recipe">
          <img src="${recipe.foodImage || "placeholder.jpg"}" 
               alt="${recipe.foodName}" 
               style="width: 200px; height: 150px; object-fit: cover;">
          <div class="recipe-info">
            <span class="recipe-name">${recipe.foodName}</span>
            <button 
              onclick="removeFavorite('${recipe.foodName}')" 
              class="remove-button">
              Remove
            </button>
          </div>
        </div>
      `
      )
      .join("");
  } else {
    favoritesList.innerHTML = "<p>No favorites yet!</p>";
  }
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

// Remove a recipe from favorites
function removeFavorite(foodName) {
  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter(
      (recipe) => recipe.foodName !== foodName
    );
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    displayFavorites(); // Refresh the display
    alert(`${foodName} removed from favorites!`);
  } catch (error) {
    console.error("Error removing favorite:", error);
    alert("Unable to remove from favorites");
  }
}

// Load favorites on page load
displayFavorites();
