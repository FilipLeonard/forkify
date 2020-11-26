import View from './view.js';

import icons from 'url:../img/icons.svg';

class PaginationView extends View {
  constructor() {
    super();
    this._parentElement = document.querySelector('.pagination');
    this.errorMessage = `Couldn't render paginarion 📃📃`;
    this.message = '';
    this.FIRST_PAGE = 1;
  }

  _generateMarkup() {
    return this._generateMarkupPagination();
  }

  _generateMarkupPagination() {
    const LAST_PAGE = Math.ceil(
      this._data.recipes.length / this._data.resultsPerPage
    );
    // Page 1, one page
    if (this.FIRST_PAGE === LAST_PAGE) return '';

    // Page 1, multiple pages
    if (this._data.currentPage === this.FIRST_PAGE)
      return this._generateMarkupNext();

    // Last page, multiple pages,
    if (this._data.currentPage === LAST_PAGE) return this._generateMarkupPrev();

    // Any other page
    return this._generateMarkupPrev() + this._generateMarkupNext();
  }

  _generateMarkupPrev() {
    const previousPage = this._data.currentPage - 1;
    return `
        <button data-goto="${previousPage}" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${previousPage}</span>
        </button>
      `;
  }

  _generateMarkupNext() {
    const nextPage = this._data.currentPage + 1;
    return `
        <button data-goto="${nextPage}" class="btn--inline pagination__btn--next">
            <span>Page ${nextPage}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
  }

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', e => {
      const button = e.target.closest('.btn--inline');
      if (!button) return;
      handler(+button.dataset.goto);
    });
  }
}

export default new PaginationView();
