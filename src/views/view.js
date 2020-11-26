import icons from 'url:../img/icons.svg';

export default class View {
  constructor() {
    this._data = '';
  }

  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   * @author Filip Leonard
   * @todo Finish implementation
   */
  render(data, render = true) {
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._insertHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);

    const currentElements = [...this._parentElement.querySelectorAll('*')];
    const newElements = [...newDOM.querySelectorAll('*')];

    newElements.forEach((newEl, i) => {
      const currEl = currentElements[i];

      // Updates changed attributes
      if (!newEl.isEqualNode(currEl)) {
        Array.from(newEl.attributes).forEach(attr =>
          currEl.setAttribute(attr.name, attr.value)
        );
        // Updates changed text
        if (newEl.firstChild?.nodeValue.trim() !== '') {
          currEl.textContent = newEl.textContent;
        }
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  _insertHTML(position, markup) {
    this._parentElement.insertAdjacentHTML(position, markup);
  }

  renderError(message = this.errorMessage) {
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

    this._clear();
    this._insertHTML('afterbegin', markup);
  }

  renderMessage(message = this.message) {
    const markup = `
        <div class="message">
            <div>
            <svg>
                <use href="${icons}#icon-smile"></use>
            </svg>
            </div>
            <p>${message}</p>
        </div>
      `;

    this._clear();
    this._insertHTML('afterbegin', markup);
  }
}
