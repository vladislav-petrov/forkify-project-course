import View from './View.js';

class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload')
    _window = document.querySelector('.add-recipe-window')
    _overlay = document.querySelector('.overlay')
    _buttonOpen = document.querySelector('.nav__btn--add-recipe')
    _buttonClose = document.querySelector('.btn--close-modal')
    _defaultMessage = 'Recipe was successfully uploaded'

    constructor() {
        super();

        [this._buttonOpen, this._buttonClose, this._overlay]
            .forEach((element) => {
                element.addEventListener('click', this.toggleModal.bind(this));
            });
    }

    toggleModal() {
        this._window.classList.toggle('hidden');
        this._overlay.classList.toggle('hidden');
    }

    subscribeHandler(handler) {
        this._parentElement.addEventListener('click', function(event) {
            event.preventDefault();
            const button = event.target.closest('.upload__btn');

            if (!button) return;

            const dataArr = [...new FormData(this)];
            const data = Object.fromEntries(dataArr);
            handler(data);
        });
    }
}

export default new AddRecipeView();
