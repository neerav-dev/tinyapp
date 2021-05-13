const generateRandomString = require('./helpers');
const bcrypt = require('bcrypt');

const userHelperConstructor = db => {
  
  const getUserByEmail = (email) => {
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
      const userExist = getUserByEmail(email, db);
      if (userExist) {
        return {error: "User Already Exist!", data: null};
      }
      if (password) {
        db[id] = {id, email, password: bcrypt.hashSync(password, 10)};
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
    const user = getUserByEmail(email, db);
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
        return {error: null, data: user};
      } else {
        return {error: "Invalid Password!", data: null};
      }
    } else {
      return {error: "Invalid Email!", data: null};
    }
  };
  
  return {authenticateUser, createUser};
};

module.exports = userHelperConstructor;