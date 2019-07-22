'use strict';

const store = (function() {
  const setError = function(error) {
    this.error = error;
  };

  const addBookmark = function(bookmark) {
    const expand = { expand: false };
    Object.assign(bookmark, expand);
    this.bookmarks.push(bookmark);
  };

  const findById = function(id) {
    return this.bookmarks.find(bookmark => bookmark.id === id);
  };

  const findAndDelete = function(id) {
    this.bookmarks = this.bookmarks.filter(bookmark => bookmark.id !== id);
  };

  const filterByRating = function() {};

  return {
    bookmarks: [],
    adding: false,
    showError: false,

    setError,
    addBookmark,
    findById,
    findAndDelete,
    filterByRating
  };
})();
