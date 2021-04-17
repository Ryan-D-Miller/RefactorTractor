import sampleRecipeData from '../src/data/sampleRecipesData.js'

class RecipeRepository {
  constructor(recipeData) {
    this.recipeData = recipeData;
  }

  retrieveListByTags(tag) {
    tag = tag.toLowerCase();
    let results = this.recipeData.filter(recipe => recipe.tags.includes(tag));
    return results;
  }



  retrieveListByNameOrIngredients(keyword, ingredientData) {
    //take results and make it all capital or lower case
    keyword = keyword.toLowerCase();
    //console.log(this.recipeData)
    let results = this.recipeData.filter(recipe => {
      let lowerCaseName = recipe.name.toLowerCase();
      let ingredients = recipe.ingredients.map(ingredient => {
        const index = ingredientData.find(ingredientElement => ingredientElement.id === ingredient.id)
        //console.log(ingredientData);
        if (index > -1) {
          return ingredientData[index].name

        }
      })
      //console.log(lowerCaseName);
      if (lowerCaseName.includes(keyword) || ingredients.includes(keyword))
        return true

  });
  return results;
}


}

export default RecipeRepository
