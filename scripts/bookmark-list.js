'use strict';

const bookmarkList = (function() {
  function generateBookmarkElement() {}

  function generateBookmarksString(bookmarksList) {}

  function render() {}

  function handleNewBookmarkSubmit() {}

  function getBookmarkIdFromElement(bookmark) {}

  function handleBookmarkDetailClick() {}

  function handleRemoveBookmarkClick() {}

  function handleFilterByRating() {}

  function bindEventListeners() {
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
