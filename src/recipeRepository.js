import sampleRecipeData from '../src/data/sampleRecipesData.js'

class RecipeRepository {
  constructor(ingredientsData) {
    this.ingredientsData = ingredientsData;
  }

  retrieveListByTags(tag) {
    let listByTags = []
    let results = this.ingredientsData.find(recipe => recipe.tags.includes(tag));
    listByTags.push(results);
      //console.log(this.ingredientsData);
     console.log(listByTags);
    return listByTags;
  }



}

export default RecipeRepository
