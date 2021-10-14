flattenedRecipes = recipes.map(element => {
  return flattenObject(Object.values(element)).toString();
});

window.addEventListener("load", () => {
  const searchInput = document.querySelector("#search");
  searchInput.addEventListener("input", event => {
    let caractersInSearch = event.target.value;
    if (caractersInSearch.length >= 3) {
      searchRecipe(caractersInSearch);
    }
  });
  recipes.forEach(recipe => createRecipeCard(recipe));
});

function searchRecipe(string) {
  const regex = new RegExp(`${string}`, "i");
  const results = flattenedRecipes.filter(recipe => regex.test(recipe));
  resetRecipeCards();
  if (results) {
    results.forEach(result => {
      resultIndex = parseInt(result[0], 10) - 1;
      createRecipeCard(recipes[resultIndex]);
    });
  }
}

function flattenObject(data) {
  return data.reduce((accumulator, item) => {
    return accumulator.concat(
      typeof item === "object" ? flattenObject(Object.values(item)) : item
    );
  }, []);
}
function resetRecipeCards() {
  const recipeContainer = document.querySelector(".recipes");
  recipeContainer.innerHTML = "";
}
function createRecipeCard(recipe) {
  const recipeContainer = document.querySelector(".recipes");
  const card = document.createElement("div");
  card.classList.add("col", "h-35");
  card.innerHTML = `
<div class="card vh-35" style="height: 364px;">
${placeholder}
<div class="card-body h-50 overflow-hidden">
  <div class="card-title">
    <h5 class="w-75 d-inline-block text-truncate">${recipe.name}</h5>
    <strong class="float-end">${clockIcon}10 min</strong>
  </div>
  <div class="row card-text">
    <div class="col">
      <ul class="ingredient-list-${recipe.id} list-unstyled fs-6">
      </ul>
    </div>
    <div class="col">
      <p>
        ${recipe.description}
      </p>
    </div>
  </div>
</div>
</div>
`;
  recipeContainer.append(card);
  recipe.ingredients.forEach(ingredient => {
    const ul = document.querySelector(`.ingredient-list-${recipe.id}`);
    const li = document.createElement("li");
    const unit = ingredient.unit || "";
    li.innerHTML = `<strong>${ingredient.ingredient}:</strong><p>${ingredient.quantity}${unit}</p>`;
    ul.append(li);
  });
}
