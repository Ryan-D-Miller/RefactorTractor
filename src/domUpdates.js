
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
        cardArea.insertAdjacentHTML('afterbegin', `<div id='${recipe.id}'
        class='card'>
            <header id='${recipe.id}' class='card-header'>
                <label for='add-button' class='hidden'>Click to add recipe</label>
                <button id='${recipe.id}' aria-label='add-button' class='add-button card-button'>
                <img id='${recipe.id} favorite' class='add'
                src='https://image.flaticon.com/icons/svg/32/32339.svg' alt='Add to
                recipes to cook'>
                </button>
                <label for='favorite-button' class='hidden'>Click to favorite recipe
                </label>
                <button id='${recipe.id}' aria-label='favorite-button' class='favorite favorite${recipe.id} card-button'></button>
            </header>
                <span id='${recipe.id}' class='recipe-name'>${recipe.name}</span>
                <img id='${recipe.id}' tabindex='0' class='card-picture'
                src='${recipe.image}' alt='click to view recipe for ${recipe.name}'>
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
            favButton.innerHTML = 'You have no favorites!';
            this.populateCards(cookbook.recipes, user);
            return
        } else {
            favButton.innerHTML = 'Refresh Favorites'
            cardArea.innerHTML = '';
            user.favoriteRecipes.forEach(recipe => {
            cardArea.insertAdjacentHTML('afterbegin', `<div id='${recipe.id}'
            class='card'>
            <header id='${recipe.id}' class='card-header'>
            <label for='add-button' class='hidden'>Click to add recipe</label>
            <button id='${recipe.id}' aria-label='add-button' class='add-button card-button'>
            <img id='${recipe.id}' class='add'
            src='https://image.flaticon.com/icons/svg/32/32339.svg' alt='Add to
            recipes to cook'></button>
            <label for='favorite-button' class='hidden'>Click to favorite recipe
            </label>
            <button id='${recipe.id}' aria-label='favorite-button' class='favorite favorite-active card-button'>
            </button></header>
            <span id='${recipe.id}' class='recipe-name'>${recipe.name}</span>
            <img id='${recipe.id}' tabindex='0' class='card-picture'
            src='${recipe.image}' alt='Food from recipe'>
            </div>`)
          })
        }
      },
      favoriteCard(event, cookbook, user) {
        let specificRecipe = cookbook.recipes.find(recipe => {
          if (recipe.id  === Number(event.target.id)) {
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
      searchBarSearch(recipeRepository, ingredientsData) {
        console.log("I'm here");
        let userRequestSearch = searchInput.value;
        if (cardArea.classList.contains('all')) {
            cardArea.classList.remove('all')
        } else {
          cardArea.innerHTML = '';
          const searchResults = recipeRepository.retrieveListByNameOrIngredients(userRequestSearch, ingredientsData)
          //console.log(searchResults);
          searchResults.forEach(recipe => {

            cardArea.insertAdjacentHTML('afterbegin', `<div id='${recipe.id}'
            class='card'>
            <header id='${recipe.id}' class='card-header'>
            <label for='add-button' class='hidden'>Click to add recipe</label>
            <button id='${recipe.id}' aria-label='add-button' class='add-button card-button'>
            <img id='${recipe.id}' class='add'
            src='https://image.flaticon.com/icons/svg/32/32339.svg' alt='Add to
            recipes to cook'></button>
            <label for='favorite-button' class='hidden'>Click to favorite recipe
            </label>
            <button id='${recipe.id}' aria-label='favorite-button' class='favorite favorite-active card-button'>
            </button></header>
            <span id='${recipe.id}' class='recipe-name'>${recipe.name}</span>
            <img id='${recipe.id}' tabindex='0' class='card-picture'
            src='${recipe.image}' alt='Food from recipe'>
            </div>`)
          })
        }

      }
};

export default domUpdates;
