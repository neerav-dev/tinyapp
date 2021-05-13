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

const {authenticateUser, getUserByEmail, createUser} = userHelperConstructor(users);
const {urlsForUser, createUrl, validateUser} = urlHelperConstructor(urlDatabase);

//ROUTES

app.get("/", (req, res) => {
  res.redirect("/urls");
});

app.get("/urls", (req, res) => {
  const user = getUserByEmail(req.session['user_id']);
  let urlList = null;
  if (user) {
    urlList = urlsForUser(user);
  }
  const templateVars = {urlList, user};
  
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = getUserByEmail(req.session['user_id']);
  
  if (!user) {
    res.redirect("/login");
  } else {
    const templateVars = {urlList: urlDatabase, user};
    res.render("urls_new", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const user = getUserByEmail(req.session['user_id']);

  if (!user) {
    res.redirect("/login");
  } else {
    const {shortURL} = req.params;
    const longURL = urlDatabase[shortURL].longURL;
    const templateVars = {shortURL, longURL, user};
    
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
  const user = getUserByEmail(req.session['user_id']);
  if (user) {
    const result = createUrl(req.body, user);
    if (result.error) {
      res.statusCode = 400;
      res.send(result.error);
    } else {
      res.redirect(`/urls/${result.data}`);
    }
  }  
});

//DELETE URL
app.post("/urls/:shortURL/delete", (req, res) => {
  const user = getUserByEmail(req.session['user_id']);
  
  if (user) {
    const result = validateUser(req.params, user);
    if (result.error) {
      res.statusCode = 400;
      res.send(result.error);
    } else {
      delete urlDatabase[result.data];
      res.redirect("/urls");
    }
  }  
});

//UPDATE URL
app.post("/urls/:shortURL", (req, res) => {
  const user = getUserByEmail(req.session['user_id']);
  const {longURL} = req.body;

  if (user) {
    const result = validateUser(req.params, user);
    if (result.error) {
      res.statusCode = 400;
      res.send(result.error);
    } else {
      urlDatabase[result.data] = longURL;
      res.redirect(`/urls/${result.data}`);
    }
  }  
});

//LOGOUT
app.post("/logout", (req, res) => {
  req.session = null;
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
    req.session['user_id'] = result.data.email;
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
    req.session['user_id'] = result.data.email;
    res.redirect(`/urls`);
  }
});


app.listen(PORT, () => {
  console.log(`TinyApp listening on port ${PORT}!`);
});
