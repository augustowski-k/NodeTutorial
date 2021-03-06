var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var User = require('./models/user');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var expressSession = require('express-session');

mongoose.connect('mongodb://localhost/passport_demo2');

var app = express();

app.set('view engine', 'ejs');

app.use(expressSession({
  secret: 'Something is here',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true }));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/secret', isLoggedIn, function (req, res) {
  res.render('secret');
});

app.post('/register', function (req, res) {
  User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/secret');
    });
  });
});

app.get('/register', function (req, res) {
  res.render('register');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/secret',
  failureRedirect: '/login',
}), function (req, res) {});

app.get('/login', function (req, res) {
  res.render('login');
});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

app.listen(80, function () {
  console.log('Passport demo listening on port 80');
});
