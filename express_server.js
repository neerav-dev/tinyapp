const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
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

//ROUTES
app.get("/urls", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = {urlList: urlDatabase, user};
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = {urlList: urlDatabase, user};
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const {shortURL} = req.params;
  const longURL = urlDatabase[shortURL];
  const user = users[req.cookies["user_id"]];
  const templateVars = {shortURL, longURL, user};

  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const {shortURL} = req.params;
  const longURL = urlDatabase[shortURL];

  res.redirect(longURL);
});

//ADD
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  const {longURL} = req.body;

  urlDatabase[shortURL] = longURL;

  res.redirect(`/urls/${shortURL}`);
});


//DELETE
app.post("/urls/:shortURL/delete", (req, res) => {
  const {shortURL} = req.params;
  
  delete urlDatabase[shortURL];
  
  res.redirect("/urls");
});

//UPDATE
app.post("/urls/:shortURL", (req, res) => {
  const {shortURL} = req.params;
  const {longURL} = req.body;
  
  urlDatabase[shortURL] = longURL;
  
  res.redirect(`/urls/${shortURL}`);
});

//LOGIN
app.post("/login", (req, res) => {
  const {username} = req.body;
  res.cookie('username', username);
  res.redirect("/urls");
});

//LOGOUT
app.post("/logout", (req, res) => {
  //const {username} = req.body;
  res.clearCookie("user_id");
  res.redirect("/urls");
});

//REGISTER
app.get("/register", (req, res) => {
  const templateVars = {user: null};
  res.render("urls_register", templateVars);
});

const fetchUser = email => {
  for (const userID in users) {
    const user = users[userID];
    if (user.email === email) {
      return user;
    }
  }
  return null;
};

const createUser = userParams => {
  const id = generateRandomString(8);
  const {email, password} = userParams;
  
  if (email) {
    const userExist = fetchUser(email);
    if (userExist) {
      return {error: "User Already Exist!", data: null};
    }
    if (password) {
      users[id] = {id, email, password};
      return {error: null, data: users[id]};
    } else {
      return {error: "Password Required!", data: null};
    }
  } else {
    return {error: "Email Required!", data: null};
  }
};

app.post("/register", (req, res) => {
  const result = createUser(req.body);
  if (result.error) {
    res.statusCode = 400;
    res.send(result.error);
  } else {
    res.cookie('user_id', result.data.email);
    res.redirect(`/urls`);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

const generateRandomString = function(length) {
  let randomString = [];
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz';
  
  for (let i = 0; i < length; i++) {
    randomString.push(characters.charAt(Math.floor(Math.random() * characters.length)));
  }
  
  return randomString.join('');
};