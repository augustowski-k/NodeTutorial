var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

router.get('/', function(req, res) {
  Campground.find({}, function(err, camps) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {campsites: camps});
    }
  });
});

router.post('/', middleware.isLoggedIn, function(req, res) {
  var newCamp = req.body.campground;

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

router.get('/new', middleware.isLoggedIn, function(req, res) {
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

router.get('/:id/edit', middleware.checkCampOwnership, function(req,res) {
  res.render('campgrounds/edit', req.campground);
});

router.put('/:id', middleware.checkCampOwnership, function(req, res) {
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err,campground) {
    if(err){
      console.log(err);
    }else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

router.delete('/:id', middleware.checkCampOwnership, function(req, res) {
  Campground.findOneAndRemove(req.params.id, function(err){
    if(err){
      console.log(err);
    }else {
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
