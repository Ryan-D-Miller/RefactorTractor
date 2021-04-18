import Pantry from './pantry';

class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.pantry = new Pantry(userData.pantry);
    this.favoriteRecipes = [];
    this.recipesToCook = [];
  }

  addToFavorites(recipe) {
    if (!this.favoriteRecipes.includes(recipe)) {
      this.favoriteRecipes.push(recipe)
    }
  }

  removeFromFavorites(recipe) {
    const i = this.favoriteRecipes.indexOf(recipe);
    this.favoriteRecipes.splice(i, 1)
  }

  filterFavorites(tag) {
    return this.favoriteRecipes.filter(recipe => {
      return recipe.tags.includes(tag);
    });
  }

  findFavorites(strgToSrch) {
    return this.favoriteRecipes.filter(recipe => {
      return recipe.name.includes(strgToSrch)
      || recipe.ingredients.find(ingredient => {
        return ingredient.name.includes(strgToSrch)
      });
    });
  }

  addRecipe(recipe) {
    if (!this.recipesToCook.includes(recipe)) {
      this.recipesToCook.push(recipe)
    }
  }

  removeRecipe(recipe) {
    const index = this.recipesToCook.findIndex(recipeIndex => recipe.id === recipeIndex.id)
    if (index !== -1) {
      this.recipesToCook.splice(index, 1);
    }
  }
}

export default User;
