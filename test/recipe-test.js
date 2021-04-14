import { expect } from 'chai';

import Recipe from '../src/recipe.js';
import recipeData from '../src/data/recipes.js';
import ingredientsData from '../src/data/ingredients.js';

let recipe;

describe('Recipe', () => {
  beforeEach(() => {

    recipe = new Recipe(recipeData[47], ingredientsData);
  });

  describe('Recipe Data', () => {

    it('Should hold its own ingredient data', () => {
      expect(recipe.ingredients).to.equal(recipeData[47].ingredients);
    })

    it('Should hold its own instruction data', () => {
      expect(recipe.instructions).to.equal(recipeData[47].instructions);
    })
  })

  it('Should be able to calculate the cost of its ingredients', () => {
    // console.log(ingredientsData);
    expect(recipe.calculateCost()).to.equal(4166);
  });

  it('Should be able to determine the name of ingredients needed', () => {
    //console.log(recipeData[47]);
    expect(recipe.retrieveIngredients()).to.eql(["cheese", "flatbread",
    "fresh basil", "grape tomatoes", "olive oil", "zucchini"]);
  });

  it('Should be able to return the directions and instructions' , () => {
    console.log("test", recipeData[47].instructions);
    expect(recipe.retrieveDirections()).to.eql( [
      {
        "number": 1,
        "instruction": "Saute the zucchini in the olive oil on high heat. Season generously with salt and pepper. Stir and leave alone for a little while, so you get a little bit of texture from the browning on the zucchini.While you’re sauteing, toast the flatbread in the oven at 400 degrees.When the zucchini is soft and just slightly browned, remove from the heat. Take the flatbread out of the oven and spread the zucchini on the flatbread.Top with the fresh tomatoes, cheese, and fresh basil."
      },
      {
        "number": 2,
        "instruction": "Cut, serve, and enjoy!"
      }
    ])
  });



});
