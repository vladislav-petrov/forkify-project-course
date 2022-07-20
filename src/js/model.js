import { API_URL, RESULTS_PER_PAGE, KEY } from './config.js';
import { AJAX } from './helpers.js';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        resultsPerPage: RESULTS_PER_PAGE,
        currentPage: 1
    },
    bookmarks: []
};

const createRecipeObject = function(data) {
    const { recipe } = data.data;

    return {
        bookmarked: false,
        cookingTime: recipe.cooking_time,
        id: recipe.id,
        image: recipe.image_url,
        ingredients: recipe.ingredients,
        publisher: recipe.publisher,
        servings: recipe.servings,
        sourceUrl: recipe.source_url,
        title: recipe.title,
        ... (recipe.key && { key: recipe.key })
    };
}

export const loadRecipe = async function(id) {
    try {
        const recipeBookmarked =
            state.bookmarks.find((bookmark) => bookmark.id === id);

        if (recipeBookmarked) {
            state.recipe = recipeBookmarked;

            return;
        }

        const data = await AJAX(`${API_URL}${id}`);
        state.recipe = createRecipeObject(data);
    } catch (error) {
        throw error;
    }
}

export const loadResults = async function(query) {
    try {
        state.search.query = query;
        state.search.currentPage = 1;
        const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`);
        const { recipes: results } = data.data;

        if (!results.length) {
            throw new Error(
                'No recipes found for your query'
            );
        }

        state.search.results = results.map((result) => {
            return {
                id: result.id,
                image: result.image_url,
                ... (result.key && { key: result.key }),
                publisher: result.publisher,
                title: result.title
            };
        });
    } catch (error) {
        throw error;
    }
}

export const getResultsPage = function(page = state.search.currentPage) {
    state.search.currentPage = page;

    const start = (page - 1) * state.search.resultsPerPage;
    const end = page * state.search.resultsPerPage;

    return state.search.results.slice(start, end);
}

export const updateServings = function(servingsNumber) {
    state.recipe.ingredients.forEach((ingredient) => {
        ingredient.quantity =
            servingsNumber * ingredient.quantity / state.recipe.servings;
    });

    state.recipe.servings = servingsNumber;
}

const updateLocalStorage = function() {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}

export const addRemoveBookmark = function() {
    if (!state.recipe.bookmarked) {
        state.recipe.bookmarked = true;
        state.bookmarks.push(state.recipe);
    } else {
        const index = state.bookmarks.findIndex((bookmark) => {
            return bookmark.id === state.recipe.id;
        });

        state.bookmarks.splice(index, 1);
        state.recipe.bookmarked = false;
    }

    updateLocalStorage();
}

export const uploadRecipe = async function(data) {
    try {
        const ingredients = Object.entries(data)
            .filter((el) => el.at(0).includes('ingredient'))
            .map((el) => {
                const value = el.at(1);

                if (!value) return null;

                const propsArray = el.at(1).split(',');

                if (propsArray.length !== 3) {
                    throw new Error('Wrong ingredient format. Please use the correct format');
                }

                const quantity = propsArray.at(0).trim();
                const unit = propsArray.at(1).trim();
                const description = propsArray.at(2).trim();

                return {
                    quantity: quantity ? +quantity : null,
                    unit,
                    description
                };
            })
            .filter((ingredient) => ingredient);

        const result = {
            cooking_time: +data.cookingTime,
            image_url: data.image,
            ingredients,
            publisher: data.publisher,
            servings: +data.servings,
            source_url: data.sourceUrl,
            title: data.title
        };

        const responseData = await AJAX(`${API_URL}?key=${KEY}`, result);
        state.recipe = createRecipeObject(responseData);
        window.history.pushState(null, '', `#${state.recipe.id}`)
    } catch (error) {
        throw error;
    }
}

export const init = function() {
    const storage = localStorage.getItem('bookmarks');

    if (!storage) return;

    state.bookmarks = JSON.parse(storage);
}

init();
