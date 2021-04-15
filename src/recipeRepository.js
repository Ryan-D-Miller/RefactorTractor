import sampleRecipeData from '../src/data/sampleRecipesData.js'

class RecipeRepository {
  constructor(ingredientsData) {
    this.ingredientsData = ingredientsData;
  }

  retrieveListByTags(tag) {
    let results = this.ingredientsData.filter(recipe => recipe.tags.includes(tag));
    return results;
  }

  retrieveListByNameOrIngredients(keyword) {
    let results = this.ingredientsData.filter(recipe => recipe.name.includes(keyword) || recipe.ingredients.includes(keyword));

    return results;
    };




}

export default RecipeRepository
