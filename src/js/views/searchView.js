class SearchView {
    _parentElement = document.querySelector('.search')

    clearInput() {
        this._parentElement.querySelector('.search__field').value = '';
    }

    getQuery() {
        return this._parentElement.querySelector('.search__field').value;
    }

    subscribeHandler(handler) {
        this._parentElement.addEventListener('submit', function(event) {
            event.preventDefault();
            handler();
        });
    }
}

export default new SearchView();
