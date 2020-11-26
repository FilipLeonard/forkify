import View from './view.js';

import icons from 'url:../img/icons.svg';

class AddRecipeView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.upload');
    this._window = document.querySelector('.add-recipe-window');
    this._overlay = document.querySelector('.overlay');
    this._btnOpen = document.querySelector('.nav__btn--add-recipe');
    this._btnClose = document.querySelector('.btn--close-modal');
    this.errorMessage = `Couldn't add recipe 🥒🍌🥑`;
    this.message = 'Recipe was successfully uploaded!';
    this.originalDOM = this._parentElement.outerHTML;
    this._addHandlerToggleWindow();
  }

  refreshForm() {
    this._parentElement.outerHTML = this.originalDOM;
  }

  _addHandlerToggleWindow() {
    [this._btnOpen, this._btnClose, this._overlay].forEach(el =>
      el.addEventListener('click', this._toggleWindow.bind(this))
    );
  }

  _toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const dataArray = [...new FormData(this)];
      console.log(dataArray);
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
