const generateRandomString = require('./helpers');

const urlHelperConstructor = db => {
  
  const urlsForUser = (userId) => {
    let urls = {};
    for (const urlID in db) {
      const url = db[urlID];
      if (url.userID === userId) {
        urls[urlID] = url;
      }
    }
    
    return urls;
  };
  
  const createUrl = (urlParams, currentUserId) => {
    const shortURL = generateRandomString(6);
    const {longURL} = urlParams;
    
    db[shortURL] = {longURL, userID: currentUserId};
    
    return {error: null, data: shortURL};
  };

  const validateUser = (urlParams, currentUserId) => {
    const {shortURL} = urlParams;
    
    if (db[shortURL].userID === currentUserId) {
      return {error: null, data: shortURL};
    }
    return {error: "Unauthorized operation!", data: null};
  };

  return {urlsForUser, createUrl, validateUser};
};

module.exports = urlHelperConstructor;