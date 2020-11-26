import View from './view.js';
import previewView from './previewView.js';

class BookmarksView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.bookmarks__list');
    this.errorMessage =
      'No bookmarks yet! Find a nice recipe and bookmark it 🔖🔖';
    this.message = '';
  }

  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }

  addHandlerRender(handler) {
    ['load'].forEach(event => window.addEventListener(event, handler));
  }
}

export default new BookmarksView();
