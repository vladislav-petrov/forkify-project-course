import PreviewView from './PreviewView.js';

class ResultsView extends PreviewView {
    _parentElement = document.querySelector('.results')
    _errorMessage = `No recipes found for your query. Please try again`
}

export default new ResultsView();
