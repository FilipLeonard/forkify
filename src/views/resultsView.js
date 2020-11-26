import View from './view.js';
import previewView from './previewView.js';

class ResultsView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.results');
    this.errorMessage = 'Search yielded no results 🥦🥦';
    this.message = '';
  }

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
