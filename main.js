const recipeList = recipes.map(recipe => new Recipe(recipe));
let filteredRecipes = recipeList;

/**
 * remove accents from a string
 * @param {String} string
 * @returns {String}
 */
function removeDiacritics(string) {
  return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
/**
 * check if a String is found in a list
 * @param {String} str
 * @param {Array} list
 * @returns {Boolean}
 */
function isInArray(str, list) {
  const regex = new RegExp(`${removeDiacritics(str)}`, "i");
  return list.find(elm => regex.test(removeDiacritics(elm))) ? true : false;
}
/**
 * get list of ingredients, appliances or ustensils from an array of Recipes
 * @param {String} tag
 * @param {Array} list
 * @returns {Array}
 */
function getTagList(tag, list) {
  let filteredList = [];
  switch (tag) {
    case "ingredients":
      list.forEach(recipe => {
        recipe.ingredients.forEach(ingredient => {
          if (!isInArray(ingredient.ingredient, filteredList)) {
            filteredList.push(ingredient.ingredient);
          }
        });
      });
      break;
    case "appliances":
      list.forEach(recipe => {
        if (!isInArray(recipe.appliance, filteredList)) {
          filteredList.push(recipe.appliance);
        }
      });
      break;
    case "ustensils":
      list.forEach(recipe => {
        recipe.ustensils.forEach(ustensil => {
          if (!isInArray(ustensil, filteredList)) {
            filteredList.push(ustensil);
          }
        });
      });
      break;
  }
  return filteredList.sort();
}

/**
 * add onload event that creates cards, set filtered recipe, and add the onInput event for the search
 */
window.addEventListener("load", () => {
  recipeList.forEach(recipe => recipe.createCard());
  let tagsCategories = ["ingredients", "appliances", "ustensils"];
  tagsCategories.forEach(category =>
    updateDatalist(getTagList(category, filteredRecipes), category)
  );
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
      let ingredients = getTagList("ingredients", filteredRecipes);
      results = ingredients.filter(ingredient => regex.test(ingredient));
      break;
    case "appliances":
      let appliances = getTagList("appliances", filteredRecipes);
      results = appliances.filter(appliance => regex.test(appliance));
      break;
    case "ustensils":
      let ustensils = getTagList("ustensils", filteredRecipes);
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
  datalist.innerHTML = "";
  if (results) {
    results.forEach(result => {
      const option = document.createElement("li");
      option.innerText = result;
      option.addEventListener("click", () => searchTag(result));
      datalist.append(option);
    });
  }
}
/**
 * add the tag to the list of selected tags
 * @param {String} tag
 */
function searchTag(tag) {
  const tagList = document.querySelector(".tag-list");
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.innerText = `${tag}`;
  const button = document.createElement("button");
  button.setAttribute("type", "button");
  button.setAttribute("class", "btn-close");
  button.setAttribute("aria-label", "Close");
  button.addEventListener("click", event => event.target.parentNode.remove());
  li.append(span);
  li.append(button);
  tagList.append(li);
  searchRecipe(tag);
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
  const tagsCategories = ["ingredients", "appliances", "ustensils"];
  tagsCategories.forEach(category =>
    updateDatalist(getTagList(category, filteredRecipes), category)
  );
}
