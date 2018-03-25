var Comment = require('../models/comment');
var Campground = require('../models/campground');

var middleware = {};

middleware.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please login before doing that!');
  res.redirect('/login/?url=' + req.originalUrl);
};

middleware.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comId, function(err, comment){
      if(err){
        req.flash('err', err.message);
        res.redirect('back');
      }else if(!comment){
        req.flash('error', 'Could not find comment with id: ' + req.params.comId);
        res.redirect('back');
      }else if(comment.author.id.equals(req.user._id)){
        req.comment = comment;
        next();
      }else{
        req.flash('error', 'Sorry you do not have permissions to do that!');
        res.redirect('back');
      }
    });
  }else {
    req.flash('error', 'You need to be loggedin to do this!');
    res.redirect('back');
  }
};

middleware.checkCampOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, campground) {
      if(err){
        req.flash('err', err.message);
        res.redirect('back');
      }else if(!campground){
        req.flash('error', 'Could not find campground with id: ' + req.params.id);
        res.redirect('back');
      }else if(campground.owner.id.equals(req.user._id)){
        req.campground = campground;
        next();
      }else {
        req.flash('error', 'Sorry you do not have permissions to do that!');
        res.redirect('back');
      }
    });
  }else {
    req.flash('error', 'You need to be loggedin to do this!');
    res.redirect('back');
  }
};

module.exports = middleware;
