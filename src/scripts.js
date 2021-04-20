import domUpdates from './domUpdates';
import User from './user';
import Cookbook from './cookbook';
import RecipeRepository from './recipeRepository'

import './css/index.scss';

let recipeRepository;
let globalIngredientsData = {}

const getUserData = () => fetch("http://localhost:3001/api/v1/users")
  .then(response => checkForError(response))
  .catch(err => console.log(`User API Error: ${err.message}`));

const getIngredientsData = () => fetch("http://localhost:3001/api/v1/ingredients")
  .then(response => checkForError(response))
  .catch(err => console.log(`Ingredients API Error: ${err.message}`));

const getRecipeData = () => fetch("http://localhost:3001/api/v1/recipes")
  .then(response => checkForError(response))
  .catch(err => console.log(`Recipe API Error: ${err.message}`));

function addOrRemoveIngredient(userID, ingredientID, ingredientMod) {
  return fetch("http://localhost:3001/api/v1/users", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userID: userID,
      ingredientID: ingredientID,
      ingredientModification: ingredientMod
    }),
  })
    .then(response => checkForError(response))
    .then(response => updatePantry(userID, ingredientID, ingredientMod))
    .catch(err => console.log(`POST Request Error: ${err.message}`))
}

const checkForError = response => {
  if (!response.ok) {
    throw new Error('Something went wrong, please try again.');
  } else {
    return response.json();
  }
}

function getData() {
  return Promise.all([getUserData(), getIngredientsData(), getRecipeData()])
}


let favButton = document.querySelector('.view-favorites');
let homeButton = document.querySelector('.home');
let cardArea = document.querySelector('.all-cards');
let pantryButton = document.querySelector('.view-pantry');
let user, cookbook;
let searchInput = document.querySelector('#searchInput');


window.onload = onStartup();

homeButton.addEventListener('click', cardButtonConditionals);
favButton.addEventListener('click', function () {
  domUpdates.viewFavorites(user, cookbook);
});
cardArea.addEventListener('click', cardButtonConditionals);
cardArea.addEventListener('keypress', cardButtonConditionals);
pantryButton.addEventListener('click', function () {
  domUpdates.displayPantry(user, globalIngredientsData);
});

searchInput.addEventListener('keyup', function () {
  domUpdates.searchBarSearch(recipeRepository, globalIngredientsData, user);
});

function onStartup() {
  getData()
    .then(([userData, ingredientsData, recipeData]) => {
      user = new User(userData[(Math.floor(Math.random() * userData.length))]);

      globalIngredientsData = ingredientsData;
      cookbook = new Cookbook(recipeData);
      recipeRepository = new RecipeRepository(recipeData);
      domUpdates.populateCards(cookbook.recipes, user);
      domUpdates.greetUser(user);
    });
}

function cardButtonConditionals(event) {
  if (event.target.classList.contains('favorite')) {
    domUpdates.favoriteCard(event, cookbook, user);
  } else if (event.target.classList.contains('card-picture')) {
    domUpdates.displayDirections(event, cookbook, globalIngredientsData, convertToName);
  } else if (event.target.classList.contains('home')) {
    favButton.innerHTML = 'View Favorites';
    domUpdates.populateCards(cookbook.recipes, user);
  } else if (event.target.classList.contains('add')) {
    user.addRecipe(addCookRecipe(event));
  } else if (event.target.classList.contains('cook-meal')) {
    cookMeal(event);
  } else if (event.target.classList.contains('add-ingredient')) {
    addOrRemoveIngredient(user.id, event.target.dataset.id, 1);
  } else if (event.target.classList.contains('remove-ingredient')) {
    addOrRemoveIngredient(user.id, event.target.dataset.id, -1);
  }
}

function updatePantry(userID, ingredientID, ingredientMod) {
  let specificIngredient = user.pantry.contents.findIndex(ingredient => {
    if (Number(ingredient.ingredient) === Number(ingredientID)) {
      return true
    }
  });
  user.pantry.contents[specificIngredient].amount += ingredientMod;
  domUpdates.displayPantry(user, globalIngredientsData);
}

function addCookRecipe(event) {
  let specificRecipe = recipeRepository.recipeData.find(recipe => {
    if (recipe.id === Number(event.target.dataset.id)) {
      return recipe;
    }
  });
  return specificRecipe;
}

function cookMeal(event) {
  let recipeToCook = addCookRecipe(event);
  let ingredientsName = convertToName(recipeToCook);
  recipeToCook.ingredients = ingredientsName;
  let canCook = user.pantry.checkMeal(recipeToCook);
  if (canCook === true) {
    user.pantry.cookMeal(recipeToCook);
    user.removeRecipe(recipeToCook);
    domUpdates.displayPantry(user, globalIngredientsData);
    domUpdates.cookMeal(recipeToCook);
  } else {
    domUpdates.cantCookDisplay(canCook);
  }
}

function convertToName(recipeToCook) {
  let ingredientInfo = recipeToCook.ingredients.map(ingredient => {
    const index = globalIngredientsData.findIndex(ingredientStat => ingredientStat.id === ingredient.id);
    return {
      name: globalIngredientsData[index].name,
      id: ingredient.id,
      quantity: {
        amount: ingredient.quantity.amount,
        unit: ingredient.quantity.unit
      }
    };
  });
  return ingredientInfo;
}