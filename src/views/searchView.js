class SearchView {
  constructor() {
    this._parentElement = document.querySelector('.search');
    this.errorMessage =
      'We could not find any recipes. Please try another search! 🍕🍕';
    this.message = '';
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      handler();
    });
  }

  getQuery() {
    const query = this._parentElement.querySelector('.search__field').value;
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentElement.querySelector('.search__field').value = '';
  }
}

export default new SearchView();
