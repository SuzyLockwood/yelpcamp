const Campground = require('../models/campground');
const Comment = require('../models/comment');

//all the middleware goes here
let middlewareObj = {};

//middleware asking if user owns campground
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  //if user logged in (isAuthenticated), then run code
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (err) {
        res.redirect('back');
      } else {
        // if user owns campground, then can edit
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};

//middleware asking if user owns comment
middlewareObj.checkCommentOwnership = function(req, res, next) {
  //if user logged in (isAuthenticated), then run code
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        res.redirect('back');
      } else {
        // if user owns comment, then can edit
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect('back');
        }
      }
    });
  } else {
    res.redirect('back');
  }
};

//middleware asking if user is logged in
middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

module.exports = middlewareObj;
