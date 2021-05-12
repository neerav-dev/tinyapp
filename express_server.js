const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const userHelperConstructor = require('./helpers/userHelpers');
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

const {authenticateUser, fetchUser, createUser, generateRandomString} = userHelperConstructor(users);

//ROUTES
app.get("/urls", (req, res) => {
  const user = fetchUser(req.cookies["user_id"]);
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

//LOGOUT
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

//REGISTER
app.get("/register", (req, res) => {
  const templateVars = {user: null};

  res.render("urls_register", templateVars);
});



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

//LOGIN
app.get("/login", (req, res) => {
  const templateVars = {user: null};
  
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const result = authenticateUser(req.body);
  
  if (result.error) {
    res.statusCode = 403;
    res.send(result.error);
  } else {
    res.cookie('user_id', result.data.email);
    res.redirect(`/urls`);
  }
});


app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
