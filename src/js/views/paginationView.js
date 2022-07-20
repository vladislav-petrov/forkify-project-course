import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View {
    _parentElement = document.querySelector('.pagination');

    _generateMarkupButtonPrev() {
        return `
            <button class="btn--inline pagination__btn--prev">
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-left"></use>
                </svg>
                <span>Page ${this._data.currentPage - 1}</span>
            </button>
        `;
    }

    _generateMarkupButtonNext() {
        return `
            <button class="btn--inline pagination__btn--next">
                <span>Page ${this._data.currentPage + 1}</span>
                <svg class="search__icon">
                    <use href="${icons}#icon-arrow-right"></use>
                </svg>
            </button>
        `;
    }

    _generateMarkup() {
        const pagesNumber = Math.ceil(
            this._data.results.length / this._data.resultsPerPage
        );

        if (
            this._data.currentPage === 1 &&
            pagesNumber === 1
        ) {
            return '';
        }

        if (this._data.currentPage === 1) {
            return this._generateMarkupButtonNext();
        }

        if (this._data.currentPage === pagesNumber) {
            return this._generateMarkupButtonPrev();
        }

        return `
            ${this._generateMarkupButtonPrev()}
            ${this._generateMarkupButtonNext()}
        `;
    }

    subscribeHandler(handler) {
        const handlerModified = function(event) {
            const button = event.target.closest('.btn--inline');

            if (!button) return;

            const newPage = button.classList.contains(
                'pagination__btn--prev'
            ) ? --this._data.currentPage : ++this._data.currentPage;

            handler(newPage);
        }

        this._parentElement.addEventListener(
            'click', handlerModified.bind(this)
        );
    }
}

export default new PaginationView();
