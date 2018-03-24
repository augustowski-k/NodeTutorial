var express = require('express');
var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleware = require('../middleware/index');

var router = express.Router({mergeParams: true});

router.get('/new', middleware.isLoggedIn, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', {camp: campground});
    }
  });
});

router.post('/', middleware.isLoggedIn, function(req, res) {
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

router.get('/:comId/edit', middleware.checkCommentOwnership, function(req, res){
  res.render('comments/edit', {comment: req.comment, campId: req.params.id});
});

router.put('/:comId', middleware.checkCommentOwnership, function(req, res) {
  console.log(req.body.comment);
  Comment.findByIdAndUpdate(req.params.comId, req.body.comment, function(err, comment){
    if(err){
      res.redirect('back');
    }else{
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

router.delete('/:comId', middleware.checkCommentOwnership, function(req, res) {
  req.comment.remove(function(err, com){
    if(err){
      res.redirect('back');
    }else{
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

module.exports = router;
