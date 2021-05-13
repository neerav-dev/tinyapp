const generateRandomString = require('./helpers');

const userHelperConstructor = db => {
  
  const fetchUser = (email) => {
    for (const userID in db) {
      const user = db[userID];
      if (user.email === email) {
        return user;
      }
    }
    
    return null;
  };
  
  const createUser = (userParams) => {
    const id = generateRandomString(8);
    const {email, password} = userParams;
    
    if (email) {
      const userExist = fetchUser(email, db);
      if (userExist) {
        return {error: "User Already Exist!", data: null};
      }
      if (password) {
        db[id] = {id, email, password};
        return {error: null, data: db[id]};
      } else {
        return {error: "Password Required!", data: null};
      }
    } else {
      return {error: "Email Required!", data: null};
    }
  };
  
  const authenticateUser = (userParams) => {
    const {email, password} = userParams;
    const user = fetchUser(email, db);
    if (user) {
      if (user.password === password) {
        return {error: null, data: user};
      } else {
        return {error: "Invalid Password!", data: null};
      }
    } else {
      return {error: "Invalid Email!", data: null};
    }
  };
  
  return {authenticateUser, fetchUser, createUser, generateRandomString};
};

module.exports = userHelperConstructor;