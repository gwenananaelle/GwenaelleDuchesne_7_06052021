class Recipe {
  constructor(recipe) {
    this.id = recipe.id;
    this.name = removeNonAlphabeticalCharacters(recipe.name);
    this.servings = parseInt(recipe.servings, 10);
    this.ingredients = recipe.ingredients.map(
      ingredient => new Ingredient(ingredient)
    );
    this.time = parseInt(recipe.time, 10);
    this.description = recipe.description;
    this.appliance = removeNonAlphabeticalCharacters(recipe.appliance);
    this.ustensils = recipe.ustensils.map(ustensil =>
      removeNonAlphabeticalCharacters(ustensil)
    );
    this.searchShortcut = flattenObject(Object.values(recipe)).toString();
    this.createCard = function() {
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
            <p class="multiline-text-troncated">
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
        const quantity = ingredient.quantity ? `: ${ingredient.quantity}` : "";
        const unit = ingredient.unit || "";
        li.innerHTML = `<strong>${ingredient.ingredient}</strong><p>${quantity}${unit}</p>`;
        ul.append(li);
      });
    };
  }
}
