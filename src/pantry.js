class Pantry {
  constructor(userIngredients) {
    this.contents = userIngredients;
  }

  showInfo(ingredientData) {
    let ingredientInfo = this.contents.map(ingredient => {
      const index = ingredientData.findIndex(ingredientStat => ingredientStat.id === ingredient.ingredient);
      return {name: ingredientData[index].name, amount: ingredient.amount, id: ingredientData[index].id};
    });

    return ingredientInfo;
  }

  checkMeal(recipe) {
    let haveIngredient = true;
    let missingIngredients = [];
    recipe.ingredients.forEach(ingredient => {
      let ingredientIndex = this.contents.findIndex(element => element.ingredient === ingredient.id);
      if (ingredientIndex === -1 || this.contents[ingredientIndex].amount < ingredient.quantity.amount) {
        haveIngredient = false;
        let amountDifference = ingredient.quantity.amount;
        if (ingredientIndex !== -1) {
          amountDifference = ingredient.quantity.amount - this.contents[ingredientIndex].amount;
        }
        missingIngredients.push({'name': ingredient.name, 'amount': amountDifference});
      }
    });
    if (haveIngredient) {
      return haveIngredient;
    }
    return missingIngredients;
  }

  cookMeal(recipe) {
    if(this.checkMeal(recipe) === true) {
      recipe.ingredients.forEach(ingredient => {
        let ingredientIndex = this.contents.findIndex(element => element.ingredient === ingredient.id);
        if(this.contents[ingredientIndex].amount <= ingredient.quantity.amount) {
          this.contents.splice(ingredientIndex, 1);
        } else {
          this.contents[ingredientIndex].amount = this.contents[ingredientIndex].amount - ingredient.quantity.amount;
        }
      });
    } else {
      return "Don't have ingredients to cook!";
    }
  }
}

export default Pantry;
