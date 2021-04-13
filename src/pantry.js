class Pantry {
  constructor(userIngredients) {
    this.contents = userIngredients;
  }

  checkMeal(recipe) {
    let haveIngredient = true;
    let missingIngredients = [];
    recipe.ingredients.forEach(ingredient => {
      let ingredientIndex = this.contents.findIndex(element => element.ingredient === ingredient.id);
      if(ingredientIndex === -1 || this.contents[ingredientIndex].amount < ingredient.quantity.amount) {
        haveIngredient = false;
        let amountDifference = ingredient.quantity.amount;
        if(ingredientIndex !== -1) {
          amountDifference = ingredient.quantity.amount - this.contents[ingredientIndex].amount;
        }
        missingIngredients.push({'name': ingredient.name, 'amount': amountDifference});
      }
    });
    if(haveIngredient){
      return haveIngredient;
    }
    return missingIngredients;
  }
}

export default Pantry;
