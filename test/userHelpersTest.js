const { expect } = require('chai');

const userHelperConstructor = require('../helpers/userHelpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

const {authenticateUser, getUserByEmail, createUser} = userHelperConstructor(testUsers);

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com")
    const expectedOutput = {
      id: "userRandomID", 
      email: "user@example.com", 
      password: "purple-monkey-dinosaur"
    };
    // Write your assert statement here
    expect(user).to.have.deep.equal(expectedOutput);
  });

  it('should return a null with invalid email', function() {
    const user = getUserByEmail("tes@example.com")
    const expectedOutput = null;
    // Write your assert statement here
    expect(user).to.have.equal(expectedOutput);
  });
});