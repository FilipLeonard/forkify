import * as model from '../model.js';

import 'core-js/stable'; //polyfill everything else
import 'regenerator-runtime/runtime'; //polyfill aync/await

import recipeView from '../views/recipeView.js';
import searchView from '../views/searchView.js';
import resultsView from '../views/resultsView.js';
import paginationView from '../views/paginationView.js';
import bookmarksView from '../views/bookmarksView.js';
import addRecipeView from '../views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

// if (module.hot) {
//   module.hot.accept();
// }

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();

    // Update results view to mark selected recipe
    resultsView.update(model.getSearchResultsPage());

    // Load recipe
    await model.loadRecipe(id);

    // Updating bookmarks view
    bookmarksView.update(model.state.bookmarks);

    // Rendering the recipe
    recipeView.render(model.state.currentRecipe);
  } catch (error) {
    console.error(error);
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  try {
    // Get search query
    const query = searchView.getQuery();
    if (!query) return;

    resultsView.renderSpinner();

    // Load search results
    await model.loadSearchResults(query);

    // Render results
    resultsView.render(model.getSearchResultsPage());

    // Render initial pagination
    paginationView.render(model.state.search);
  } catch (error) {
    console.error(error);
    resultsView.renderError(error.message);
  }
};

const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

const controlRecipeServings = function (desiredServings) {
  model.updateServings(desiredServings);
  recipeView.update(model.state.currentRecipe);
};

const controlHandleBookmark = function (recipe) {
  // Add or remove bookmark
  model.handleBookmark(recipe);

  // Update recipe view
  recipeView.update(model.state.currentRecipe);

  // Render the bookmarks
  bookmarksView.render(model.state.bookmarks);
  console.log(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (toAddRecipe) {
  try {
    // Show spinner while uploading
    addRecipeView.renderSpinner();

    // Upload the new recipe data
    await model.uploadRecipe(toAddRecipe);

    // Render recipe
    recipeView.render(model.state.currentRecipe);

    // Display success message
    addRecipeView.renderMessage();

    // Render bookmark view
    bookmarksView.render(model.state.bookmarks);

    // Change id in URL
    window.history.pushState(null, '', `#${model.state.currentRecipe.id}`);

    // Close form window
    setTimeout(
      addRecipeView._toggleWindow.bind(addRecipeView),
      MODAL_CLOSE_SEC * 1000
    );

    // Reset form state
    setTimeout(
      addRecipeView.refreshForm.bind(addRecipeView),
      (MODAL_CLOSE_SEC + 0.5) * 1000
    );
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error.message);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerServings(controlRecipeServings);
  recipeView.addHandlerAddBookmark(controlHandleBookmark);

  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  bookmarksView.addHandlerRender(controlBookmarks);

  addRecipeView.addHandlerUpload(controlAddRecipe);
  console.log('Changes');
};

init();
