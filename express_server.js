const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieParser);
app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//ROUTES
app.get("/urls", (req, res) => {
  const templateVars = {urlList: urlDatabase};
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  const {shortURL} = req.params;
  const longURL = urlDatabase[shortURL];
  const templateVars = {shortURL, longURL};

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