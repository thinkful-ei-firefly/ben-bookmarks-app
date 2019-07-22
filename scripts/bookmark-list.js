'use strict';

/* global store */

const bookmarkList = (function() {
  function generateBookmarkElement(bookmark) {
    const { id, title } = bookmark;
    return `
      <li class="js-bookmark-element" data-bookmark-id="${id}">
        <span class="bookmark-title">${title}</span>
          <button class="bookmark-details js-bookmark-details">
            <span class="button-label">DETAILS</span>
          </button>
          <button class="bookmark-delete js-bookmark-delete">
            <span class="button-label">REMOVE</span>
          </button>
        </div>
      </li>`;
  }

  function generateBookmarksString(bookmarksList) {
    const bookmarks = bookmarksList.map(bookmark =>
      generateBookmarkElement(bookmark)
    );
    return bookmarks.join('');
  }

  function render() {
    let bookmarks = [...store.bookmarks];
    console.log('`render` ran');
    const bookmarksString = generateBookmarksString(bookmarks);
    $('.js-bookmark-list').html(bookmarksString);
  }

  function handleAddNewBookmarkClick() {
    $('.js-add-new').click(() => {
      $('.add-new').html('');
      $('form').html(`
      <fieldset>
          <legend>Add A New Bookmark</legend>
          <label for="title">
            Title: 
            <input type="text" name="title" id="title" required>
            </label>
          <label for="url">
            URL: 
            <input type="url" name="url" id="url" required>
          </label>
          <label for="rating">
            Rating: 
            <input type="number" name="rating" id="rating" min="1" max="5" required>
          </label>
          <label for="description">
          Description: 
          <textarea name="description" id="description" required></textarea>
        </label>
        <button type="submit">ADD</button>
        </fieldset>
      `);
    });
  }

  function handleNewBookmarkSubmit() {
    $('form').submit(event => {
      event.preventDefault();
      const title = $(event.currentTarget)
        .find('input[id="title"]')
        .val();
      const url = $(event.currentTarget)
        .find('input[id="url"]')
        .val();
      const rating = $(event.currentTarget)
        .find('input[id="rating"]')
        .val();
      const description = $(event.currentTarget)
        .find('textarea')
        .val();
      const newBookmark = { title, url, rating, description };
      console.log(newBookmark);
      api.createBookmark(newBookmark)
        .then(bookmark => {
          store.addBookmark(bookmark);
          render();
        });
    });
  }

  function getBookmarkIdFromElement(bookmark) {}

  function handleBookmarkDetailClick() {}

  function handleRemoveBookmarkClick() {}

  function handleFilterByRating() {}

  function bindEventListeners() {
    handleAddNewBookmarkClick();
    handleNewBookmarkSubmit();
    handleBookmarkDetailClick();
    handleRemoveBookmarkClick();
    handleFilterByRating();
  }

  // This object contains the only exposed methods from this module:
  return {
    render,
    bindEventListeners
  };
})();
