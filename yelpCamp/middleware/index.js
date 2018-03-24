var Comment = require('../models/comment');
var Campground = require('../models/campground');

var middleware = {};

middleware.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login/?url=' + req.originalUrl);
};

middleware.checkCommentOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Comment.findById(req.params.comId, function(err, comment){
      if(err){
        res.redirect('back');
      }else if(comment.author.id.equals(req.user._id)){
        req.comment = comment;
        next();
      }else{
        res.redirect('back');
      }
    });
  }else {
    res.redirect('back');
  }
};

middleware.checkCampOwnership = function(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, campground) {
      if(err){
        res.redirect('back');
      }else if(campground.owner.id.equals(req.user._id)){
        req.campground = campground;
        next();
      }else {
        res.redirect('back');
      }
    });
  }else {
    res.redirect('back');
  }
};

module.exports = middleware;
