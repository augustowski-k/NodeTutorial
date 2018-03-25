var express = require('express');
var router = express.Router();
var Campground = require('../models/campground');
var middleware = require('../middleware');

router.get('/', function(req, res) {
  Campground.find({}, function(err, camps) {
    if(err) {
      req.flash('error',
        typeof err === 'object' ? err.message : err);
      res.redirect('back');
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
    if(err) {
      req.flash('error',
        typeof err === 'object' ? err.message : err);
      res.redirect('back');
    } else {
      req.flash('success', 'You succesfully created your campground');
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
      if(err) {
        req.flash('error',
          typeof err === 'object' ? err.message : err);
        res.redirect('back');
      }else if(!campground){
        req.flash('error', 'Could not find campground with id: ' + req.params.id);
        res.redirect('back');
      }else {
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
      req.flash('err', err.message);
      res.redirect('back');
    }else {
      req.flash('success', 'You successfuly edited your campground');
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

router.delete('/:id', middleware.checkCampOwnership, function(req, res) {
  Campground.findOneAndRemove(req.params.id, function(err){
    if(err){
      req.flash('err', err.message);
      res.redirect('back');
    }else {
      req.flash('warning', 'You successfuly deleted your campground');
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
