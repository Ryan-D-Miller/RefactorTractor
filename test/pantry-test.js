import { expect } from 'chai';
import User from '../src/user.js';

import recipeData from '../src/data/recipes.js'
import Pantry from '../src/pantry';

let user1;
let pantry;
const recipe = {
    "name": "Elvis Pancakes",
    "id": 741603,
    "image": "https://spoonacular.com/recipeImages/741603-556x370.jpeg",
    "ingredients": [
      {
        "name": "all purpose flour",
        "id": 1077,
        "quantity": {
          "amount": 1,
          "unit": "cup"
        }
      },
      {
        "name": "all purpose flour",
        "id": 14412,
        "quantity": {
          "amount": 1,
          "unit": "cup"
        }
      },
      {
        "name": "all purpose flour",
        "id": 1009054,
        "quantity": {
          "amount": 1,
          "unit": "cup"
        }
      },
    ],
    "instructions": [
      {
        "number": 1,
        "instruction": "Watch how to make this recipe."
      }]
}
const recipeDontHave = {
    "name": "Elvis Pancakes",
    "id": 741603,
    "image": "https://spoonacular.com/recipeImages/741603-556x370.jpeg",
    "ingredients": [
      {
        "name": "all purpose flour",
        "id": 1077,
        "quantity": {
          "amount": 3,
          "unit": "cup"
        }
      },
      {
        "name": "Random flour",
        "id": 14412,
        "quantity": {
          "amount": 2,
          "unit": "cup"
        }
      },
      {
        "name": "Sugar",
        "id": 4,
        "quantity": {
          "amount": 1,
          "unit": "cup"
        }
      },
    ],
    "instructions": [
      {
        "number": 1,
        "instruction": "Watch how to make this recipe."
      }]
}

describe('Pantry', function() {
    beforeEach(function() {
        user1 = new User(1, 'Boba', [
            {
              'ingredient': 1077,
              'amount': 1
            },
            {
              'ingredient': 14412,
              'amount': 1
            },
            {
              'ingredient': 1009054,
              'amount': 3
            }]
          );
        pantry = new Pantry([
            {
              'ingredient': 1077,
              'amount': 1
            },
            {
              'ingredient': 14412,
              'amount': 1
            },
            {
              'ingredient': 1009054,
              'amount': 3
            }]);
    });
    it('should be a function', function () {
        expect(Pantry).to.be.a('function');
    });

    it('should holy an array of ingredients', function() {
        expect(pantry.contents).to.eql([
            {
              'ingredient': 1077,
              'amount': 1
            },
            {
              'ingredient': 14412,
              'amount': 1
            },
            {
              'ingredient': 1009054,
              'amount': 3
            }])
    });

    it('should determine where a pantry has enough ingredients to cook a given meal', function() {
        expect(pantry.checkMeal(recipe)).to.equal(true);

    });

    it('should return an array of missing ingredients and the amount missing', function() {
        expect(pantry.checkMeal(recipeDontHave)).to.eql([
            { name: 'all purpose flour', amount: 2 },
            { name: 'Random flour', amount: 1 },
            { name: 'Sugar', amount: 1 }
          ]);
    });

    it('should remove ingredients used to cook from the pantry', function() {
        pantry.cookMeal(recipe);
        expect(pantry.contents).to.eql([{
            'ingredient': 1009054,
            'amount': 2
          }]);
          expect(pantry.cookMeal(recipeDontHave)).to.eql("Don't have ingredients to cook!")
    });
});


