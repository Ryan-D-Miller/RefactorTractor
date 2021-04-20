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
    keyword = keyword.toLowerCase();
    let results = this.recipeData.filter(recipe => {
      let addToSearch = false;
      let lowerCaseName = recipe.name.toLowerCase();
      if(lowerCaseName.includes(keyword))
        addToSearch = true;
      let ingredients = this.convertToName(recipe, ingredientData);
      ingredients.forEach(ingredient => {
        if(ingredient.name.includes(keyword))
        {
          addToSearch = true;
        }
      });
      return addToSearch
      }); 
    return results;
  };


convertToName(recipe, ingredientData) {
  let ingredientInfo = recipe.ingredients.map(ingredient => {
    const index = ingredientData.findIndex(ingredientStat => ingredientStat.id === ingredient.id);
    return {name: ingredientData[index].name};
  });
  return ingredientInfo;
}


}

export default RecipeRepository
