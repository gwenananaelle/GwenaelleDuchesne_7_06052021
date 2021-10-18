const recipeList = recipes.map(recipe => new Recipe(recipe));
let filteredRecipes = recipeList;
let ingredients = getIngredients(filteredRecipes);
let appliances = getAppliance(filteredRecipes);
let ustensils = getUstensils(filteredRecipes);

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
  list.forEach(
    recipe => (ustensilsList = ustensilsList.concat(recipe.ustensils))
  );
  return ustensilsList;
}
/**
 * add onload event that creates cards, set filtered recipe, and add the onInput event for the search
 */
window.addEventListener("load", () => {
  recipeList.forEach(recipe => recipe.createCard());
  updateDatalist(ingredients, "ingredients");
  updateDatalist(ustensils, "ustensils");
  updateDatalist(appliances, "appliances");
  const searchInput = document.querySelector("#search");
  searchInput.addEventListener("input", event => {
    let caractersInSearch = event.target.value;
    if (caractersInSearch.length >= 3) {
      searchRecipe(caractersInSearch);
    }
  });
  const searchByTagInput = document.querySelectorAll(".search-by-tag");
  searchByTagInput.forEach(input => {
    input.addEventListener("input", event => {
      filterTagSuggestions(event.target.value, input.name);
    });
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
 * filter tag suggestions based on searchInput
 * @param {String} searchInput
 * @param {String} type
 */
function filterTagSuggestions(searchInput, type) {
  const regex = new RegExp(`${searchInput}`, "i");
  let results;
  switch (type) {
    case "ingredients":
      results = ingredients.filter(ingredient => regex.test(ingredient));
      break;
    case "appliances":
      results = appliances.filter(appliance => regex.test(appliance));
      break;
    case "ustensils":
      results = ustensils.filter(ustensil => regex.test(ustensil));
      break;
  }
  updateDatalist(results, type);
}
/**
 * update datalist for tag search with the filtered results
 * @param {Array} results
 * @param {String} type
 */
function updateDatalist(results, type) {
  const datalist = document.querySelector(`#${type}-list`);
  if (results) {
    results.forEach(result => {
      const option = document.createElement("option");
      option.setAttribute("value", result);
      datalist.append(option);
    });
  }
}
/**
 * reset and create cards based on filteredRecipes
 */
function updateRecipes() {
  resetRecipeCards();
  if (filteredRecipes.length === 0) {
    const recipeContainer = document.querySelector(".recipes");
    const text = document.createElement("p");
    text.innerText = `Aucune recette ne correspond à votre critère… vous pouvez
      chercher « tarte aux pommes », « poisson », etc.`;
    recipeContainer.append(text);
  } else {
    filteredRecipes.forEach(recipe => recipe.createCard());
  }
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
