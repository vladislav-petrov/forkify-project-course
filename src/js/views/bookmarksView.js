import PreviewView from './PreviewView.js';

class BookmarksView extends PreviewView {
    _parentElement = document.querySelector('.bookmarks__list');
    _defaultMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)'
}

export default new BookmarksView();
