import icons from 'url:../../img/icons.svg';

export default class View {
    _data

    clearContainer() {
        this._parentElement.innerHTML = '';
    }

    _insertMarkup(markup) {
        this.clearContainer();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);  
    }

    renderDefaultMessage() {
        const markup = `
            <div class="message">
                <div>
                    <svg>
                        <use href="${icons}#icon-smile"></use>
                    </svg>
                </div>
                <p>
                    ${this._defaultMessage}
                </p>
            </div>
        `;

        this._insertMarkup(markup);
    }

    renderErrorMessage(message = this._errorMessage) {
        const markup = `
            <div class="error">
                <div>
                    <svg>
                        <use href="${icons}#icon-alert-triangle"></use>
                    </svg>
                </div>
                <p>${message}</p>
            </div>
        `;

        this._insertMarkup(markup);
    }

    renderSpinner() {
        const markup = `
            <div class="spinner">
                <svg>
                    <use href="${icons}#icon-loader"></use>
                </svg>
            </div>
        `;

        this._insertMarkup(markup);
    }

    /**
     * Render the received object to the DOM
     * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
     * @returns {undefined}
     * @this {Object} View instance
     * @author Firstname Lastname
     * @todo Finish implementation
     */
    render(data) {
        this._data = data;
        this._insertMarkup(this._generateMarkup());
    }

    update(data) {
        this._data = data;
        const newMarkup = this._generateMarkup();

        const newDOM =
            document.createRange().createContextualFragment(newMarkup);

        const newElements = Array.from(newDOM.querySelectorAll('*'));

        const currentElements =
            Array.from(this._parentElement.querySelectorAll('*'));

        newElements.forEach((newElement, i) => {
            const currentElement = currentElements[i];

            if (
                !newElement.isEqualNode(currentElement) &&
                newElement.firstChild?.nodeValue.trim() !== ''
            ) {
                currentElement.textContent = newElement.textContent;
            }

            if (
                !newElement.isEqualNode(currentElement)
            ) {
                Array.from(newElement.attributes).forEach((attr) => {
                    currentElement.setAttribute(attr.name, attr.value);
                });
            }
        });
    }
}
