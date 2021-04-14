import sampleRecipeData from './src/data/sampleRecipesData.js'

class RecipeRepository {
  constructor(ingredientsData) {
    this.ingredientsData = ingredientsData;
  }

  retrieveListByTags(tag) {
    console.log(this.ingredientsData);
    let listByTags = this.ingredientsData.filter(recipe => recipe.tags === tag);
    // return listByTags;
  }



}

export default RecipeRepository
