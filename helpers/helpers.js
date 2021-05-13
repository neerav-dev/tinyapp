const generateRandomString = function(length) {
  let randomString = [];
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz';
  
  for (let i = 0; i < length; i++) {
    randomString.push(characters.charAt(Math.floor(Math.random() * characters.length)));
  }
  
  return randomString.join('');
};

module.exports = generateRandomString;