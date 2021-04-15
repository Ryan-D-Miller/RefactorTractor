import './css/base.scss';
import './css/styles.scss';


let userData = {}
let ingredientsData = {}
let recipeData = {}

function getData() {
  userData = fetch("http://localhost:3001/api/v1/users")
    .then(response => response.json())
    .then(userData => {
      return userData;
    })
    .catch(err => console.log("Error: Users data can't be accessed."));

  ingredientsData = fetch("http://localhost:3001/api/v1/ingredients")
    .then(response => response.json())
    .then(ingredientsData => {
      return ingredientsData;
    })
    .catch(err => console.log("Error: Ingredient data can't be accessed."));

  recipeData = fetch("http://localhost:3001/api/v1/recipes")
    .then(response => response.json())
    .then(recipeData => {
      return recipeData;
    })
    .catch(err => console.log("Error: Recipe data can't be accessed."));

  return Promise.all([userData, ingredientsData, recipeData])
    .then(data => {
      userData = data[0];
      ingredientsData = data[1];
      recipeData = data[2];
    })
}

import domUpdates from './domUpdates';
import Pantry from './pantry';
import Recipe from './recipe';
import User from './user';
import Cookbook from './cookbook';

let favButton = document.querySelector('.view-favorites');
let homeButton = document.querySelector('.home');
let cardArea = document.querySelector('.all-cards');
let user, pantry, cookbook;

window.onload = onStartup();

homeButton.addEventListener('click', cardButtonConditionals);
favButton.addEventListener('click', function() {
  domUpdates.viewFavorites(user, cookbook);
});
cardArea.addEventListener('click', cardButtonConditionals);

function onStartup() {
  getData()
    .then(data => {
      user = new User(userData[(Math.floor(Math.random() * userData.length))]);
      cookbook = new Cookbook(recipeData);
      pantry = new Pantry(user.pantry)
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
    user.addRecipe()
  }
}

function displayDirections(event) {
  let newRecipeInfo = cookbook.recipes.find(recipe => {
    if (recipe.id === Number(event.target.id)) {
      return recipe;
    }
  })
  let recipeObject = new Recipe(newRecipeInfo, ingredientsData);
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

