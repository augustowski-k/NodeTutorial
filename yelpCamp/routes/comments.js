var express = require('express');
var Campground = require('../models/campground');
var Comment = require('../models/comment');

var router = express.Router({mergeParams: true});

router.get('/new', isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {camp: campground});
    }
  });
});

router.post('/', isLoggedIn, function(req, res) {
  var comment = req.body.comment;
  comment.author = {
    id: req.user._id,
    email: req.user.email
  };
  Campground.findById(req.params.id, function(err, camp) {
    if (err) {
      console.log(err);
    } else {
      Comment.create(comment, function(err, newComment) {
        if (err) {
          console.log(err);
        } else {
          camp.comments.push(newComment._id);
          camp.save(function(err, editedCamp) {
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

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login/?url=' + req.originalUrl);
}

module.exports = router;
