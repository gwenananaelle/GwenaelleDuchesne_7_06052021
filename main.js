window.addEventListener("load", () => {
  const searchInput = document.querySelector("#search");
  recipes.forEach(recipe => createRecipeCard(recipe));
  searchInput.addEventListener("input", event => {
    let caractersInSearch = event.target.value;
    if (caractersInSearch.length >= 3) {
      SearchRecipe(caractersInSearch);
    }
  });
});

function SearchRecipe(string) {
  console.log(`${string}`);
}

function createRecipeCard(recipe) {
  const recipeContainer = document.querySelector(".recipes");
  const card = document.createElement("div");
  card.classList.add("col", "h-35");
  card.innerHTML = `
<div class="card vh-35" style="height: 364px;">
${placeholder}
<div class="card-body h-50 overflow-hidden">
  <h5 class="card-title">
    ${recipe.name}
    <span class="float-end">${clockIcon}10 min</span>
  </h5>
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
