const generateRandomString = require('./helpers');

const urlHelperConstructor = db => {
  
  const urlsForUser = (userParams) => {
    let urls = {};
    const {id} = userParams;
    for (const urlID in db) {
      const url = db[urlID];
      if (url.userID === id) {
        urls[urlID] = url;
      }
    }
    
    return urls;
  };
  
  const createUrl = (urlParams, userParams) => {
    const shortURL = generateRandomString(6);
    const {longURL} = urlParams;
    const {id} = userParams;
    
    db[shortURL] = {longURL, userID:id};
    
    return {error: null, data: shortURL};    
  };

  const validateUser = (urlParams, userParams) => {
    const {shortURL} = urlParams;
    const {id} = userParams;
    if (db[shortURL].userID === id) {
      return {error: null, data: shortURL};
    }
    return {error: "Unauthorized operation!", data: null};
  };

  return {urlsForUser, createUrl, validateUser};
};

module.exports = urlHelperConstructor;