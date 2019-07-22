'use strict';

const main = function() {
  bookmarkList.bindEventListeners();
  api.getBookmarks()
    .then((bookmarks) => {
      bookmarks.forEach((bookmark) => store.addBookmark(bookmark));
      bookmarkList.render();
    })
    .catch(err => console.log(err.message));
};

$(main);