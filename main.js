const recipeList = recipes.map(recipe => new Recipe(recipe));
let filteredRecipes = [];
/**
 * returns a list of all ingredients in an Array of Recipes
 * @param {Array} list
 * @returns {Array}
 */
function getIngredients(list) {
  let ingredientList = [];
  list.forEach(recipe => {
    recipe.ingredients.forEach(ingredient => {
      if (!ingredientList.includes(ingredient.ingredient)) {
        ingredientList.push(ingredient.ingredient);
      }
    });
  });
  return ingredientList;
}
/**
 * returns a list of all appliances in an Array of Recipes
 * @param {Array} list
 * @returns {Array}
 */
function getAppliance(list) {
  let applianceList = [];
  list.forEach(recipe => {
    if (!applianceList.includes(recipe.appliance)) {
      applianceList.push(recipe.appliance);
    }
  });
  return applianceList;
}
/**
 * returns a list of all ustensils in an Array of Recipes
 * @param {*} list
 * @returns {Array}
 */
function getUstensils(list) {
  let ustensilsList = [];
  list.forEach(recipe => ustensilsList.concat(recipe.ustensils));
  return ustensilsList;
}
/**
 * add onload event that creates cards, set filtered recipe, and add the onInput event for the search
 */
window.addEventListener("load", () => {
  recipeList.forEach(recipe => recipe.createCard());
  filteredRecipes = recipeList;
  const searchInput = document.querySelector("#search");
  searchInput.addEventListener("input", event => {
    let caractersInSearch = event.target.value;
    if (caractersInSearch.length >= 3) {
      searchRecipe(caractersInSearch);
    }
  });
});
/**
 * filters filteredRecipes based on input and update content
 * @param {String} searchInput
 */
function searchRecipe(searchInput) {
  const regex = new RegExp(`${searchInput}`, "i");
  const results = recipeList.filter(
    recipe => !regex.test(recipe.searchShortcut)
  );
  results.forEach(result =>
    filteredRecipes.splice(filteredRecipes.indexOf(result), 1)
  );
  updateRecipes();
}
/**
 * reset and create cards based on filteredRecipes
 */
function updateRecipes() {
  resetRecipeCards();
  filteredRecipes.forEach(recipe => recipe.createCard());
}
/**
 * creates a single array with all the content from an object and suboject
 * @param {Array} data
 */
function flattenObject(data) {
  return data.reduce((accumulator, item) => {
    return accumulator.concat(
      typeof item === "object" ? flattenObject(Object.values(item)) : item
    );
  }, []);
}
/**
 * empty div with class "recipe", deleting all the previously created cards
 */
function resetRecipeCards() {
  const recipeContainer = document.querySelector(".recipes");
  recipeContainer.innerHTML = "";
}
