class Ingredient {
  constructor(ingredient) {
    this.ingredient = removeNonAlphabeticalCharacters(ingredient.ingredient);
    this.quantity = parseInt(ingredient.quantity, 10);
    this.unit = ingredient.unit
      ? removeNonAlphabeticalCharacters(ingredient.unit)
      : "";
  }
}
