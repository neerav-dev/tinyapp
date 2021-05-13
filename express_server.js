const express = require("express");
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const userHelperConstructor = require('./helpers/userHelpers');
const urlHelperConstructor = require('./helpers/urlHelpers');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));

app.use(bodyParser.urlencoded({extended: true}));

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  "u$er1": {
    id: "aJ48lW",
    email: "user@example.com",
    password: bcrypt.hashSync("user", 10)
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10)
  }
};

const {authenticateUser, createUser} = userHelperConstructor(users);
const {urlsForUser, createUrl, validateUser} = urlHelperConstructor(urlDatabase);

//ROUTES

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const currentUserId =  req.session['user_id'];
  let urlList = null;
  if (currentUserId) {
    urlList = urlsForUser(currentUserId);
  }
  const templateVars = {urlList, email: req.session['email']};
  
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const currentUserId =  req.session['user_id'];
  
  if (!currentUserId) {
    res.redirect("/login");
  } else {
    const templateVars = {urlList: urlDatabase, email: req.session['email']};
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const currentUserId =  req.session['user_id'];

  if (!currentUserId) {
    res.redirect("/login");
  } else {
    const {shortURL} = req.params;
    const longURL = urlDatabase[shortURL].longURL;
    const templateVars = {shortURL, longURL, email: req.session['email']};
    
    res.render('urls_show', templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  const {shortURL} = req.params;
  const longURL = urlDatabase[shortURL].longURL;

  res.redirect(longURL);
});

//ADD URL
app.post("/urls", (req, res) => {
  const currentUserId =  req.session['user_id'];
  if (currentUserId) {
    const result = createUrl(req.body, currentUserId);
    if (result.error) {
      res.statusCode = 400;
      res.send(`<html><body><scrip><h1>${result.error}</h1></body></html>`);
    } else {
      res.redirect(`/urls/${result.data}`);
    }
  } else {
    res.statusCode = 403;
    res.send(`<html><body><scrip><h1>Unauthorized operation!</h1></body></html>`);
  }
});

//DELETE URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const currentUserId =  req.session['user_id'];
  
  if (currentUserId) {
    const result = validateUser(req.params, currentUserId);
    if (result.error) {
      res.statusCode = 400;
      res.send(result.error);
    } else {
      delete urlDatabase[result.data];
      res.redirect("/urls");
    }
  } else {
    res.statusCode = 403;
    res.send(`<html><body><scrip><h1>Unauthorized operation!</h1></body></html>`);
  }
});

//UPDATE URL
app.post("/urls/:shortURL", (req, res) => {
  const currentUserId =  req.session['user_id'];
  const {longURL} = req.body;

  if (currentUserId) {
    const result = validateUser(req.params, currentUserId);
    if (result.error) {
      res.statusCode = 400;
      res.send(`<html><body><scrip><h1>${result.error}</h1></body></html>`);
    } else {
      urlDatabase[result.data] = {longURL, userID: currentUserId};
      res.redirect(`/urls/${result.data}`);
    }
  } else {
    res.statusCode = 403;
    res.send(`<html><body><scrip><h1>Unauthorized operation!</h1></body></html>`);
  }
});

//LOGOUT
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

//REGISTER
app.get("/register", (req, res) => {
  const templateVars = {email: undefined};
  res.render("urls_register", templateVars);
});

app.post("/register", (req, res) => {
  const result = createUser(req.body);
  if (result.error) {
    res.statusCode = 400;
    res.send(`<html><body><scrip><h1>${result.error}</h1></body></html>`);
  } else {
    req.session['user_id'] = result.data.id;
    req.session['email'] = result.data.email;
    res.redirect(`/urls`);
  }
});

//LOGIN
app.get("/login", (req, res) => {
  const templateVars = {email: undefined};
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  const result = authenticateUser(req.body);
  
  if (result.error) {
    res.statusCode = 403;
    res.send(`<html><body><scrip><h1>${result.error}</h1></body></html>`);
  } else {
    req.session['user_id'] = result.data.id;
    req.session['email'] = result.data.email;
    res.redirect(`/urls`);
  }
});


app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
