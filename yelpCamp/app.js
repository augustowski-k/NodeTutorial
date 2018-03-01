var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local');
var expressSession = require('express-session');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var User = require('./models/user');
var seedDB = require('./seeds');

mongoose.connect('mongodb://localhost/yelp_camp');
seedDB();

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSession({
  secret: 'secret should be a secret... always',
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy({ usernameField: 'email', }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/campgrounds', function (req, res) {
  Campground.find({}, function (err, camps) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', { campsites: camps });
    }
  });
});

app.post('/campgrounds', function (req, res) {
  var name = req.body.name;
  var imgUrl = req.body.imgUrl;
  var description = req.body.description;
  var newCamp = { name: name, imgUrl: imgUrl, description: description };

  Campground.create(newCamp, function (err, campground) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log('Created campground with name: ' + campground.name);
      res.redirect('/campgrounds');
    }
  });
});

app.get('/campgrounds/new', function (req, res) {
  res.render('campgrounds/new');
});

app.get('/campgrounds/:id', function (req, res) {
  Campground.findById(req.params.id).populate('comments').exec(function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/show', campground);
    }
  });
});

// Comment route
app.get('/campgrounds/:id/comments/new', isLoggedIn, function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { camp: campground });
    }
  });
});

app.post('/campgrounds/:id/comments', isLoggedIn, function (req, res) {
  var comment = req.body.comment;
  Campground.findById(req.params.id, function (err, camp) {
    if (err) {
      console.log(err);
    } else {
      Comment.create(comment, function (err, newComment) {
        if (err) {
          console.log(err);
        } else {
          camp.comments.push(newComment._id);
          camp.save(function (err, editedCamp) {
            if (err) {
              console.log(err);
            } else {
              res.redirect('/campgrounds/' + editedCamp._id);
            }
          });
        }
      });
    }
  });
});

app.get('/register', function (req, res) {
  res.render('register');
});

app.post('/register', function (req, res) {
  var newUser = new User({ email: req.body.email });
  User.register(newUser, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.redirect('/register');
      return;
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/campgrounds');
    });
  });
});

app.get('/login', function (req, res) {
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/campgrounds',
  failureRedirect: '/login',
}), function (req, res) {});

app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/login');
}

app.listen(80, function () {
  console.log('yelp server started');
});
