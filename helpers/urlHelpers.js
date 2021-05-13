const generateRandomString = require('./helpers');

const urlHelperConstructor = db => {
  
  const urlsForUser = (userID) => {
    let urls = {};

    for (const urlID in db) {
      const url = db[urlID];
      if (url.userID === userID) {
        urls[urlID] = url;
      }
    }
    
    return urls;
  };
  
  const createUrl = (urlParams, userID) => {
    const shortURL = generateRandomString(6);
    const {longURL} = urlParams;
    
    db[shortURL] = {longURL, userID};
    
    return {error: null, data: shortURL};    
  };



  return {urlsForUser, createUrl};
};

module.exports = urlHelperConstructor;