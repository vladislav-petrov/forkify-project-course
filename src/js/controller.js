import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { MODAL_CLOSE_SEC } from './config.js';
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import searchView from './views/searchView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';

if (module.hot) {
    module.hot.accept();
}

const controlRecipe = async function() {
    try {
        const id = window.location.hash.slice(1);

        if (!id) {
            recipeView.renderDefaultMessage();

            return;
        };

        recipeView.renderSpinner();
        await model.loadRecipe(id);
        recipeView.render(model.state.recipe);

        if (model.state.search.results.length) {
            resultsView.update(model.getResultsPage());
        }

        if (model.state.bookmarks.length) {
            bookmarksView.update(model.state.bookmarks);
        }
    } catch (error) {
        recipeView.renderErrorMessage();
    }
}

const controlResults = async function() {
    try {
        const query = searchView.getQuery();

        if (!query) return;

        resultsView.renderSpinner();
        await model.loadResults(query);
        searchView.clearInput();
        resultsView.render(model.getResultsPage());
        paginationView.render(model.state.search);
    } catch (error) {
        resultsView.renderErrorMessage();
        paginationView.clearContainer();
    }
}

const controlPagination = function(page) {
    resultsView.render(model.getResultsPage(page));
    paginationView.render(model.state.search);
}

const controlServings = function(servingsNumber) {
    model.updateServings(servingsNumber);
    recipeView.update(model.state.recipe);
}

const controlAddRemoveBookmark = function() {
    model.addRemoveBookmark();
    recipeView.update(model.state.recipe);

    if (model.state.bookmarks.length) {
        bookmarksView.render(model.state.bookmarks);
    } else {
        bookmarksView.renderDefaultMessage();
    }
}

const controlAddRecipe = async function(data) {
    try {
        addRecipeView.renderSpinner();
        await model.uploadRecipe(data);
        model.addRemoveBookmark();
        recipeView.render(model.state.recipe);
        bookmarksView.render(model.state.bookmarks);
        addRecipeView.renderDefaultMessage();

        setTimeout(function() {
            addRecipeView.toggleModal();
        }, MODAL_CLOSE_SEC * 1000);
    } catch (error) {
        addRecipeView.renderErrorMessage(error.message);
    }
}

const init = function() {
    recipeView.subscribeHandlerRecipe(controlRecipe);
    recipeView.subscribeHandlerServings(controlServings);
    recipeView.subscribeHandlerBookmark(controlAddRemoveBookmark);
    searchView.subscribeHandler(controlResults);
    paginationView.subscribeHandler(controlPagination);
    addRecipeView.subscribeHandler(controlAddRecipe);

    if (model.state.bookmarks.length) {
        bookmarksView.render(model.state.bookmarks);
    } else {
        bookmarksView.renderDefaultMessage();
    }
}

init();
