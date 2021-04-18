import Recipe from './recipe';

let favButton = document.querySelector('.view-favorites');
let homeButton = document.querySelector('.home')
let cardArea = document.querySelector('.all-cards');

let searchInput = document.querySelector('#searchInput');



let domUpdates = {
  greetUser(user) {
    const userName = document.querySelector('.user-name');
    userName.innerHTML =
      user.name.split(' ')[0] + ' ' + user.name.split(' ')[1][0];
  },
  populateCards(recipes, user) {
    cardArea.innerHTML = '';
    if (cardArea.classList.contains('all')) {
      cardArea.classList.remove('all')
    }
    recipes.forEach(recipe => {
      cardArea.insertAdjacentHTML('afterbegin',
        `<div data-id='${recipe.id}' class='card'>
            <header data-id='${recipe.id}' class='card-header'>
                <label for='add-button' class='hidden'>Click to add recipe</label>
                <button data-id='${recipe.id}' aria-label='add-button' class='add-button card-button'>
                <img data-id='${recipe.id}' favorite' class='add'
                src='https://image.flaticon.com/icons/svg/32/32339.svg' alt='Add to
                recipes to cook'>
                </button>
                <label for='favorite-button' class='hidden'>Click to favorite recipe
                </label>
                <button data-id='${recipe.id}' aria-label='favorite-button' class='favorite favorite${recipe.id} card-button'></button>
            </header>
                <img data-id='${recipe.id}' tabindex='0' class='card-picture'
                src='${recipe.image}' alt='click to view recipe for ${recipe.name}'>
                <span data-id='${recipe.id}' class='recipe-name'>${recipe.name}</span>
        </div>`)
    })
    this.getFavorites(user);
  },
  getFavorites(user) {
    if (user.favoriteRecipes.length) {
      user.favoriteRecipes.forEach(recipe => {
        document.querySelector(`.favorite${recipe.id}`).classList.add('favorite-active')
      })
    } else return
  },
  viewFavorites(user, cookbook) {
    if (cardArea.classList.contains('all')) {
      cardArea.classList.remove('all')
    }
    if (!user.favoriteRecipes.length) {
      favButton.innerHTML = 'No Favorites';
      this.populateCards(cookbook.recipes, user);
      return
    } else {
      favButton.innerHTML = 'Refresh Favorites'
      cardArea.innerHTML = '';
      this.populateCards(user.favoriteRecipes, user);
    }
  },
  favoriteCard(event, cookbook, user) {
    let specificRecipe = cookbook.recipes.find(recipe => {
      if (recipe.id === Number(event.target.dataset.id)) {
        return recipe;
      }
    })
    if (!event.target.classList.contains('favorite-active')) {
      event.target.classList.add('favorite-active');
      favButton.innerHTML = 'View Favorites';
      user.addToFavorites(specificRecipe);
    } else if (event.target.classList.contains('favorite-active')) {
      event.target.classList.remove('favorite-active');
      user.removeFromFavorites(specificRecipe)
    }
  },
  displayPantry(user, pantry, ingredientData) {
    cardArea.classList.add('all');
    let cantCookSpan = document.querySelector('.cant-cook');
    const ingredients = pantry.showInfo(ingredientData);
    cardArea.innerHTML = `<h3>${user.name} Pantry!</h3>
        <p class='all-recipe-info'>
        <strong class='cant-cook-header'></strong><span class='cant-cook recipe-info all-cards'></span><br>
        <strong>Recipes To Cook</strong><span id='recipiesToCook' class='recipes recipe-info all-cards'></span><br>
        <strong>In Pantry </strong><span class='ingredients recipe-info'></span>
        </p>`
    let ingredientsSpan = document.querySelector('.ingredients');
    let recipiesSpan = document.getElementById('recipiesToCook');
    ingredients.forEach(ingredient => {
      ingredientsSpan.insertAdjacentHTML('afterbegin', `<ul><li>
            ${ingredient.amount} ${ingredient.name}
            </li></ul>`)
    });
    if (user.recipesToCook.length === 0) {
      recipiesSpan.insertAdjacentHTML('afterbegin', `<p>No recipies to Cook!</p>`)
    } else {
        this.displayPantryRecipes(user, recipiesSpan);
        this.getFavorites(user);
    }
  },
  displayPantryRecipes(user, recipiesSpan) {
    user.recipesToCook.forEach(recipe => {
        recipiesSpan.insertAdjacentHTML('afterbegin', `<div data-id='${recipe.id}'
                class='card'>
                    <header data-id='${recipe.id}' class='card-header'>
                        <label for='add-button' class='hidden'>Click to add recipe</label>
                        <button data-id='${recipe.id}' aria-label='add-button' class='add-button card-button'>
                        <img data-id='${recipe.id}' id='${recipe.id} favorite' class='add'
                        src='https://image.flaticon.com/icons/svg/32/32339.svg' alt='Add to
                        recipes to cook'>
                        </button>
                        <label for='favorite-button' class='hidden'>Click to favorite recipe
                        </label>
                        <button data-id='${recipe.id}' aria-label='favorite-button' class='favorite favorite${recipe.id} card-button'></button>
                    </header>
                        <span data-id='${recipe.id}' class='recipe-name'>${recipe.name}</span>
                        <img data-id='${recipe.id}' tabindex='0' class='card-picture'
                        src='${recipe.image}' alt='click to view recipe for ${recipe.name}'>
                        <button data-id='${recipe.id}' class='cook-meal navButton'>Cook this Meal</button>
                </div>`);
      });
  },
  cantCookDisplay(missingIngredients) {
    let cantCookSpan = document.querySelector('.cant-cook');
    let cantCookHeaderSpan = document.querySelector('.cant-cook-header');
    cantCookSpan.innerHTML = "";
    cantCookHeaderSpan.innerHTML = "Not enough ingredients to Cook! You are missing -"
    missingIngredients.forEach(ingredient => {
      cantCookSpan.insertAdjacentHTML('afterbegin', `<ul><li>
            ${ingredient.amount} of ${ingredient.name}
            </li></ul>`)
    });
  },
  cookMeal(recipe) {
    let cantCookSpan = document.querySelector('.cant-cook');
    cantCookSpan.innerHTML = `Cooked ${recipe.name}!`;
  },
  searchBarSearch(recipeRepository, ingredientsData, user) {
    let userRequestSearch = searchInput.value;
    if (cardArea.classList.contains('all')) {
      cardArea.classList.remove('all')
    } else {
      cardArea.innerHTML = '';
      const searchResults = recipeRepository.retrieveListByNameOrIngredients(userRequestSearch, ingredientsData);
      this.populateCards(searchResults, user);
    }
  },
  displayDirections(event, cookbook, globalIngredientsData, convertToName) {
    let newRecipeInfo = cookbook.recipes.find(recipe => {
      if (recipe.id === Number(event.target.dataset.id)) {
        return recipe;
      }
    })
    let recipeObject = new Recipe(newRecipeInfo, globalIngredientsData);
    const ingrdientWithName = convertToName(recipeObject);
    recipeObject.ingredients = ingrdientWithName;
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
};

export default domUpdates;
