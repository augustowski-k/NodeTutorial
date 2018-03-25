var express = require('express');
var passport = require('passport');
var User = require('../models/user');

var router = express.Router();

router.get('/', function(req, res) {
  res.render('home');
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  var newUser = new User({email: req.body.email});
  User.register(newUser, req.body.password, function(err, user) {
    if(err) {
      req.flash('error',
        typeof err === 'object' ? err.message : err);
      res.redirect('back');
      return;
    }

    passport.authenticate('local')(req, res, function() {
      req.flash('success', 'Your account has been created');
      res.redirect('/campgrounds');
    });
  });
});

router.get('/login', function(req, res) {
  res.render('login', req.query);
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}),
  function(req, res) {
    if(req.query.url){
      res.redirect(req.query.url);
    }else {
      res.redirect('/campgrounds');
    }
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('info', 'You logged out');
  res.redirect('/campgrounds');
});

module.exports = router;
