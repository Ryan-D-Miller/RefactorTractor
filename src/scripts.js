import domUpdates from './domUpdates';
import Pantry from './pantry';
import Recipe from './recipe';
import User from './user';
import Cookbook from './cookbook';
import RecipeRepository from './recipeRepository'

import './css/index.scss';


let userData = {}
let ingredientsData = {}
let recipeData = {}
let recipeRepository;


let globalIngredientsData = {}

const getUserData = () => fetch("http://localhost:3001/api/v1/users")
  .then(response => response.json())
  .catch(err => console.log(`User API Error: ${err.message}`));

const getIngredientsData = () => fetch("http://localhost:3001/api/v1/ingredients")
  .then(response => response.json())
  .catch(err => console.log(`Ingredients API Error: ${err.message}`));

const getRecipeData = () => fetch("http://localhost:3001/api/v1/recipes")
  .then(response => response.json())
  .catch(err => console.log(`Recipe API Error: ${err.message}`));


const postIngredients = (userID, ingredientID, ingredientMod) => fetch("http://localhost:3001/api/v1/users", {
  method: 'POST',
  body: JSON.stringify({
    userID: userID,
    ingredientID: ingredientID,
    ingredientModification: ingredientMod,
  }), 
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(response => response.json())
  .catch(err => console.log(`POST Request Error: ${err.message}`))

function getData() {
  return Promise.all([getUserData(), getIngredientsData(), getRecipeData()])
}


let favButton = document.querySelector('.view-favorites');
let homeButton = document.querySelector('.home');
let cardArea = document.querySelector('.all-cards');
let pantryButton = document.querySelector('.view-pantry');
let user, pantry, cookbook;
let searchInput = document.querySelector('#searchInput');


window.onload = onStartup();

homeButton.addEventListener('click', cardButtonConditionals);
favButton.addEventListener('click', function() {
  domUpdates.viewFavorites(user, cookbook);
});
cardArea.addEventListener('click', cardButtonConditionals);
pantryButton.addEventListener('click', function() {
  domUpdates.displayPantry(user, pantry, globalIngredientsData);
});

searchInput.addEventListener('keyup', function() {
  domUpdates.searchBarSearch(recipeRepository, globalIngredientsData);
});
function onStartup() {
  getData()
    .then(([userData, ingredientsData, recipeData]) => {
      user = new User(userData[(Math.floor(Math.random() * userData.length))]);
      globalIngredientsData = ingredientsData;
      cookbook = new Cookbook(recipeData);
      pantry = new Pantry(user.pantry);
      recipeRepository = new RecipeRepository (recipeData);
      domUpdates.populateCards(cookbook.recipes, user);
      domUpdates.greetUser(user);
    });
}

function cardButtonConditionals(event) {
  if (event.target.classList.contains('favorite')) {
    domUpdates.favoriteCard(event, cookbook, user);
  } else if (event.target.classList.contains('card-picture')) {
    displayDirections(event);
  } else if (event.target.classList.contains('home')) {
    favButton.innerHTML = 'View Favorites';
    domUpdates.populateCards(cookbook.recipes, user);
  } else if (event.target.classList.contains('add-button')) {
    user.addRecipe(addCookRecipe(event));
  } else if(event.target.classList.contains('cook-meal')) {
    cookMeal(event);
  }
}

function displayDirections(event) {
  let newRecipeInfo = cookbook.recipes.find(recipe => {
    if (recipe.id === Number(event.target.id)) {
      return recipe;
    }
  })
  let recipeObject = new Recipe(newRecipeInfo, globalIngredientsData);
  let cost = recipeObject.calculateCost()
  let costInDollars = (cost / 100).toFixed(2)
  cardArea.classList.add('all');
  cardArea.innerHTML = `<h3>${recipeObject.name}</h3>
  <p class='all-recipe-info'>
  <strong>It will cost: </strong><span class='cost recipe-info'>
  $${costInDollars}</span><br><br>
  <strong>You will need: </strong><span class='ingredients recipe-info'></span>
  <strong>Instructions: </strong><ol><span class='instructions recipe-info'>
  </span></ol>
  </p>`;
  let ingredientsSpan = document.querySelector('.ingredients');
  let instructionsSpan = document.querySelector('.instructions');
  recipeObject.ingredients.forEach(ingredient => {
    ingredientsSpan.insertAdjacentHTML('afterbegin', `<ul><li>
    ${ingredient.quantity.amount.toFixed(2)} ${ingredient.quantity.unit}
    ${ingredient.name}</li></ul>
    `)
  })
  recipeObject.instructions.forEach(instruction => {
    instructionsSpan.insertAdjacentHTML('beforebegin', `<li>
    ${instruction.instruction}</li>
    `)
  })
}

function addCookRecipe(event) {
  let specificRecipe = recipeRepository.recipeData.find(recipe => {
      if (recipe.id  === Number(event.target.id)) {
          return recipe;
      }
  });
  return specificRecipe;
}

function cookMeal(event) {
  let recipeToCook = addCookRecipe(event);
  let ingredientsName = convertToName(recipeToCook);
  recipeToCook.ingredients = ingredientsName;
  let canCook = pantry.checkMeal(recipeToCook);
  if(canCook === true) {
    pantry.cookMeal(recipeToCook);
    user.removeRecipe(recipeToCook);
    domUpdates.displayPantry(user, pantry, globalIngredientsData);
    domUpdates.cookMeal(recipeToCook);
  } else {
    domUpdates.cantCookDisplay(canCook);
  }
}

function convertToName(recipeToCook) {
  let ingredientInfo = recipeToCook.ingredients.map(ingredient => {
    const index = globalIngredientsData.findIndex(ingredientStat => ingredientStat.id === ingredient.id);
    return {name: globalIngredientsData[index].name,id: ingredient.id , quantity:  {amount: ingredient.quantity.amount}};
  });
  return ingredientInfo;
}

