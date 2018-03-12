var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');

router.get('/', function(req, res) {
  Campground.find({}, function(err, camps) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campsites: camps});
    }
  });
});

router.post('/', isLoggedIn, function(req, res) {
  var name = req.body.name;
  var imgUrl = req.body.imgUrl;
  var description = req.body.description;
  var newCamp = {name: name, imgUrl: imgUrl, description: description};

  newCamp.owner = {
    id: req.user._id,
    email: req.user.email
  };

  Campground.create(newCamp, function(err, campground) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log('Created campground with name: ' + campground.name);
      res.redirect('/campgrounds');
    }
  });
});

router.get('/new', isLoggedIn, function(req, res) {
  res.render('campgrounds/new');
});

router.get('/:id', function(req, res) {
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function(err, campground) {
      if (err) {
        console.log(err);
      } else {
        res.render('campgrounds/show', campground);
      }
    });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
