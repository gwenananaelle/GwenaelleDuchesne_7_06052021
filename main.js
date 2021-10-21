let filteredRecipes = recipes.map(recipe => new Recipe(recipe));
let search = [];
let tags = [];

/**
 * creates a single array with all the content from an object and suboject
 * @param {Array} data
 */
function flattenObject(data) {
  return data.reduce((accumulator, item) => {
    return accumulator.concat(
      typeof item === "object"
        ? flattenObject(Object.values(item))
        : removeDiacritics(item.toString())
    );
  }, []);
}
function removeNonAlphabeticalCharacters(string) {
  return string.replace(/[^A-zÀ-ú\s]/g, "");
}
/**
 * remove non letter characters and accents from a string
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
  //create cards
  filteredRecipes.forEach(recipe => recipe.createCard());
  ellipsizeTextElement(".multiline-text-troncated");
  //create dropdown lists
  let tagsCategories = ["ingredients", "appliances", "ustensils"];
  tagsCategories.forEach(category =>
    updateDatalist(getTagList(category, filteredRecipes), category)
  );
  //submit event for search
  const form = document.querySelector(".form-search");
  form.addEventListener("submit", event => {
    event.preventDefault();
    searchRecipe();
  });
  //add input event for search
  const searchInput = document.querySelector("#search");
  searchInput.addEventListener("input", event => {
    let caractersInSearch = event.target.value;
    if (caractersInSearch.length >= 3) {
      let keywords = caractersInSearch.split(" ");
      search = keywords.map(str => new RegExp(`${removeDiacritics(str)}`, "i"));
      searchRecipe();
    } else {
      search = [];
    }
  });
  //add dropdown events
  addDropdownToggleEvents();
  addTagEvent();
});
/**
 * filters filteredRecipes based on input and update content
 */
function searchRecipe() {
  filteredRecipes = recipes.map(recipe => new Recipe(recipe));
  const tagsInRegex = tags.map(
    str => new RegExp(`${removeDiacritics(str)}`, "i")
  );
  regexes = search.concat(tagsInRegex);
  for (let index = 0; index < regexes.length; index++) {
    if (!filteredRecipes.length > 0) {
      break;
    }
    filteredRecipes = filteredRecipes.filter(recipe =>
      regexes[index].test(recipe.searchShortcut)
    );
  }
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
  const dropdown = document.querySelector(`#${type}-dropdown`);
  dropdown.setAttribute("data-length", results.length);
  const datalist = document.querySelector(`#${type}-list`);
  datalist.setAttribute("data-length", results.length);
  datalist.innerHTML = "";
  if (results) {
    results.forEach(result => {
      const option = document.createElement("li");
      option.innerText = result;
      option.setAttribute("data-type", type);
      datalist.append(option);
    });
  }
}
/**
 * add the tag to the list of selected tags
 * @param {String} tag
 */
function addSearchTag(tag, type) {
  const tagList = document.querySelector(".tag-list");
  const li = document.createElement("li");
  li.classList.add("tag", type, "d-inline-block", "my-3", "me-1");
  li.innerHTML = `${tag}<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
</svg>`;
  li.addEventListener("click", () => {
    const tagElm = li;
    const index = tags.indexOf(tagElm.innerText);
    if (index !== -1) {
      tags.splice(index, 1);
      tagElm.remove();
      searchRecipe();
    }
  });
  tagList.append(li);
  tags.push(tag);
  searchRecipe();
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
  ellipsizeTextElement(".multiline-text-troncated");
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
function ellipsizeTextElement(element) {
  var nodeList = document.querySelectorAll(element);
  var elements = Array.prototype.slice.call(nodeList, 0);
  elements.forEach(function(element) {
    var wordArray = element.innerHTML.split(" ");
    while (element.scrollHeight > element.offsetHeight) {
      wordArray.pop();
      element.innerHTML = wordArray.join(" ") + "...";
    }
  });
}
/**
 * add events to show dropdown list for click toggle button, focus, and blur
 */
function addDropdownToggleEvents() {
  document.querySelectorAll(".dropdown-toggle-custom").forEach(elm => {
    const type = elm.dataset.type;
    const dropdown = document.querySelector(`#${type}-dropdown`);
    elm.addEventListener("click", () => {
      if (dropdown.classList.contains("show")) {
        dropdown.classList.remove("show");
      } else {
        closeAllDropdowns();
        dropdown.classList.add("show");
      }
    });
  });
  const searchByTagInput = document.querySelectorAll(".search-by-tag");
  searchByTagInput.forEach(input => {
    const type = input.dataset.type;
    const dropdown = document.querySelector(`#${type}-dropdown`);
    input.addEventListener("input", event => {
      filterTagSuggestions(event.target.value, type);
    });
    input.addEventListener("focus", () => {
      input.setAttribute("placeholder", "Recherche un ingédient");
      if (!dropdown.classList.contains("show")) {
        closeAllDropdowns();
        dropdown.classList.add("show");
      }
    });
    input.addEventListener("blur", () => {
      if (!event.target.matches("li")) {
        dropdown.classList.remove("show");
        input.setAttribute("placeholder", type);
      }
    });
  });
}
/**
 * remove class "show" for all dropdowns
 */
function closeAllDropdowns() {
  openedDropdowns = document.querySelectorAll(".show");
  openedDropdowns.forEach(dropdown => dropdown.classList.remove("show"));
}
/**
 * add event for the tag list that triggers tag creation
 */
function addTagEvent() {
  const datalists = document.querySelectorAll(`.dropdown-menu-custom`);
  datalists.forEach(datalist => {
    datalist.addEventListener("mousedown", event => {
      if (
        event.target.matches("li") &&
        event.target.innerText &&
        event.target.dataset.type
      ) {
        addSearchTag(event.target.innerText, event.target.dataset.type);
      }
    });
  });
}
