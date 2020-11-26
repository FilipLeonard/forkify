import { async } from 'regenerator-runtime';
import { API_KEY, API_URL, RES_PER_PAGE } from './js/config.js';
import { AJAX } from './js/helpers.js';

export const state = {
  currentRecipe: {},
  search: {
    query: '',
    recipes: [],
    currentPage: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (recipeBackend) {
  const bookmarked = state.bookmarks.some(b => b.id === recipeBackend.id)
    ? true
    : false;

  return {
    id: recipeBackend.id,
    title: recipeBackend.title,
    publisher: recipeBackend.publisher,
    sourceUrl: recipeBackend.sourceUrl,
    image: recipeBackend.image_url,
    servings: recipeBackend.servings,
    cookingTime: recipeBackend.cooking_time,
    ingredients: recipeBackend.ingredients,
    ...(recipeBackend.key && { key: recipeBackend.key }),
    bookmarked,
  };
};

export const loadRecipe = async function (id) {
  try {
    const {
      data: { recipe },
    } = await AJAX(`${API_URL}${id}?${API_KEY}?key=${API_KEY}`);

    state.currentRecipe = createRecipeObject(recipe);
  } catch (error) {
    console.log(`🔥🔥🔥 ${error}`);
    throw error;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const {
      data: { recipes },
    } = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    if (recipes.length === 0) {
      resetSearch();
      throw new Error(
        `No recipes found for **${query}**! Please try again🍕🍔🍅🥑`
      );
    }

    state.search.query = query;
    state.search.currentPage = 1;
    state.search.recipes = recipes.map(recipe => ({
      id: recipe.id,
      image: recipe.image_url,
      publisher: recipe.publisher,
      title: recipe.title,
      ...(recipe.key && { key: recipe.key }),
    }));
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (
  pageNo = state.search.currentPage
) {
  state.search.currentPage = pageNo;
  const start = (pageNo - 1) * state.search.resultsPerPage;
  const end = start + state.search.resultsPerPage;
  return state.search.recipes.slice(start, end);
};

const resetSearch = function () {
  state.search.query = '';
  state.search.currentPage = 1;
  state.search.recipes = [];
};

export const updateServings = function (desiredServings) {
  const ratio = desiredServings / state.currentRecipe.servings;
  state.currentRecipe.ingredients.forEach(ingredient => {
    if (!ingredient.quantity) return;
    ingredient.quantity = (ingredient.quantity * ratio).toFixed(2);
  });
  state.currentRecipe.servings = desiredServings;
};

export const handleBookmark = function (recipe) {
  recipe.bookmarked ? removeBookmark(recipe.id) : addBookmark(recipe);
  persistBookmarks();
};

const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe);

  // Mark current recipe as bookmark
  if (recipe.id === state.currentRecipe.id)
    state.currentRecipe.bookmarked = true;
};

const removeBookmark = function (id) {
  // Remove bookmark
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  // Mark current recipe as NOT bookmark
  if (id === state.currentRecipe.id) state.currentRecipe.bookmarked = false;
};

const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

export const uploadRecipe = async function (formRecipe) {
  try {
    const ingredients = Object.entries(formRecipe)
      .filter(([key, value]) => key.includes('ingredient') && value)
      .map(([_, ingr]) => parseStringToIngredient(ingr));

    const toUploadRecipe = {
      title: formRecipe.title,
      publisher: formRecipe.publisher,
      source_url: formRecipe.sourceUrl,
      image_url: formRecipe.image,
      servings: +formRecipe.servings,
      cooking_time: +formRecipe.cookingTime,
      ingredients,
    };
    const {
      data: { recipe: recipeBackend },
    } = await AJAX(`${API_URL}?key=${API_KEY}`, toUploadRecipe);

    state.currentRecipe = createRecipeObject(recipeBackend);
    addBookmark(state.currentRecipe);
    persistBookmarks();
    console.log(state.currentRecipe);
  } catch (error) {
    throw error;
  }
};

const parseStringToIngredient = function (stringIngredient) {
  const ingrArray = stringIngredient.split(',').map(el => el.trim());
  if (ingrArray.length !== 3)
    throw new Error(
      'Wrong ingredient format! Should use {quantity},{unit},{description}'
    );
  const [quantity, unit, description] = ingrArray;
  return {
    quantity: quantity ? +quantity : null,
    unit,
    description,
  };
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};

init();

console.log(state);
