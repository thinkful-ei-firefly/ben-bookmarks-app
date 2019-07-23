'use strict';

/* global store, api */

const bookmarkList = (function() {
  function generateBookmarkElement(obj) {
    const { id, title, url, rating, desc } = obj;
    const bookmark = store.findById(id);
    if (bookmark.isEditing) {
      return `
      <li class="js-bookmark-element" data-bookmark-id="${id}">
      <form class="edit">  
      <fieldset>
          <legend>EDIT BOOKMARK</legend>
          <label for="title">
            Title: 
            <input type="text" name="title" id="title" value="${title}" required>
            </label>
          <label for="url">
            URL: 
            <input type="url" name="url" id="url" value="${url}" required>
          </label>
          <label for="rating">
            Rating: 
            <input type="number" name="rating" id="rating" min="1" max="5" value="${rating}" required>
          </label>
          <label for="description">
            Description: 
            <textarea name="desc" id="description" required>${desc}</textarea>
          </label>
          <button type="submit" class="update">UPDATE</button>
          <button type="button" class="cancel">CANCEL</button>
          </fieldset>
        </form>
      </li>
      `;
    } else if (bookmark.expand) {
      return `
      <li class="js-bookmark-element" data-bookmark-id="${id}">
        <span class="bookmark-title">${title}</span>
        <span class="bookmark-rating">${rating}</span>
        <span class="bookmark-url">
          <a href="${url}">Visit Link</a>
        </span>
        <span class="bookmark-url">${desc}</span>
        <button class="bookmark-toggle">COLLAPSE</button>
        <button class="bookmark-edit">EDIT</button>
        <button class="bookmark-delete">REMOVE</button>
      </li>`;
    } else {
      return `
      <li class="js-bookmark-element" data-bookmark-id="${id}">
        <span class="bookmark-title">${title}</span>
        <span class="bookmark-rating">${rating}</span>
        <button class="bookmark-toggle">DETAILS</button>
        <button class="bookmark-edit">EDIT</button>
        <button class="bookmark-delete">REMOVE</button>
      </li>`;
    }
  }

  function generateBookmarksString(bookmarksList) {
    const bookmarks = bookmarksList.map(bookmark =>
      generateBookmarkElement(bookmark)
    );
    return bookmarks.join('');
  }

  function render() {
    console.log('render ran');
    const bookmarks = store.filterByRating(store.filterRating);
    const bookmarksString = generateBookmarksString(bookmarks);
    if (store.adding) {
      $('.add-new').empty();
      $('.add-form').html(`
        <fieldset>
          <legend>ADD A NEW BOOKMARK</legend>
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
            <textarea name="desc" id="description" required></textarea>
          </label>
          <button type="submit">ADD</button>
          <button type="button" class="cancel">CANCEL</button>
          </fieldset>
      `);
    } else {
      $('.add-form').empty();
      $('.add-new').html(`<div class="add-new">
      <button class="add-new-button">ADD A BOOKMARK</button>
    </div>`);
    }
    console.log(bookmarksString);
    $('.js-bookmark-list').html(bookmarksString);
  }

  function handleAddNewBookmarkClick() {
    $('.add-new').on('click', '.add-new-button', () => {
      store.adding = !store.adding;
      render();
    });
  }

  function handleCancelNewClick() {
    $('.add-form').on('click', '.cancel', () => {
      store.adding = !store.adding;
      render();
    });
  }

  function handleCancelEditClick() {
    $('ul').on('click', '.cancel', () => {
      const id = getBookmarkIdFromElement(event.target);
      store.setBookmarkIsEditing(id, false);
      render();
    });
  }

  function serializeJson(form) {
    const formData = new FormData(form);
    const o = {};
    formData.forEach((val, name) => (o[name] = val));
    return JSON.stringify(o);
  }

  function handleNewBookmarkSubmit() {
    $('.add-form').submit(event => {
      event.preventDefault();
      const newBookmark = serializeJson(event.currentTarget);
      store.adding = !store.adding;
      api.createBookmark(newBookmark).then(bookmark => {
        store.addBookmark(bookmark);
        render();
      });
    });
  }

  function getBookmarkIdFromElement(element) {
    return $(element)
      .closest('li')
      .data('bookmark-id');
  }

  function handleBookmarkDetailClick() {
    $('ul').on('click', '.bookmark-toggle', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      const bookmark = store.findById(id);
      bookmark.expand = !bookmark.expand;
      render();
    });
  }

  function handleRemoveBookmarkClick() {
    $('ul').on('click', '.bookmark-delete', event => {
      const id = getBookmarkIdFromElement(event.currentTarget);
      api.deleteBookmark(id).then(() => {
        store.findAndDelete(id);
        render();
      });
    });
  }

  function handleFilterByRating() {
    $('#filter').change(() => {
      const rating = $(event.currentTarget).val();
      store.filterRating = rating;
      render();
    });
  }

  function handleBookmarkStartEditing() {
    $('ul').on('click', '.bookmark-edit', event => {
      const id = getBookmarkIdFromElement(event.target);
      store.setBookmarkIsEditing(id, true);
      render();
    });
  }

  function handleEditBookmarkSubmit() {
    $('ul').on('submit', '.edit', event => {
      event.preventDefault();
      const id = getBookmarkIdFromElement(event.currentTarget);
      const bookmark = serializeJson(event.currentTarget);
      api
        .updateBookmark(id, bookmark)
        .then(() => {
          store.findAndUpdate(id, bookmark);
          store.setBookmarkIsEditing(id, false);
          render();
        });
    });
  }

  // function handleNewBookmarkSubmit() {
  //   $('.add-form').submit(event => {
  //     event.preventDefault();
  //     const newBookmark = serializeJson(event.currentTarget);
  //     store.adding = !store.adding;
  //     api.createBookmark(newBookmark).then(bookmark => {
  //       store.addBookmark(bookmark);
  //       render();
  //     });
  //   });
  // }

  function bindEventListeners() {
    handleAddNewBookmarkClick();
    handleNewBookmarkSubmit();
    handleBookmarkDetailClick();
    handleRemoveBookmarkClick();
    handleFilterByRating();
    handleBookmarkStartEditing();
    handleEditBookmarkSubmit();
    handleCancelNewClick();
    handleCancelEditClick();
  }

  return {
    render,
    bindEventListeners
  };
})();
