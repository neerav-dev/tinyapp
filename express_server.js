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

//ROUTES
app.get("/urls", (req, res) => {
  const templateVars = {urlList: urlDatabase, username: req.cookies["username"]};
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {username: req.cookies["username"]};
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const {shortURL} = req.params;
  const longURL = urlDatabase[shortURL];
  const templateVars = {shortURL, longURL, username: req.cookies["username"]};

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
  res.clearCookie("username");
  res.redirect("/urls");
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