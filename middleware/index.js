const Campground = require('../models/campground');
const Comment = require('../models/comment');
const Review = require('../models/review');

//all the middleware goes here
let middlewareObj = {};

//middleware asking if user owns campground
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  //if user logged in (isAuthenticated), then run code
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      //added error handling for edge case
      if (err || !foundCampground) {
        req.flash('error', 'Campground not found.');
        res.redirect('back');
      } else {
        //if user owns campground, then can edit
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You do not have permission to do that.');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that.');
    res.redirect('back');
  }
};

//middleware asking if user owns comment
middlewareObj.checkCommentOwnership = function(req, res, next) {
  //if user logged in (isAuthenticated), then run code
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      //added error handling for edge case
      if (err || !foundComment) {
        req.flash('error', 'Comment not found.');
        res.redirect('back');
      } else {
        //if user owns comment, then can proceed
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', 'You do not have permission to do that.');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that.');
    res.redirect('back');
  }
};

//middleware asking if user owns review
middlewareObj.checkReviewOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Review.findById(req.params.review_id, function(err, foundReview) {
      if (err || !foundReview) {
        res.redirect('back');
      } else {
        //if user owns review, then can proceed
        if (foundReview.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error', "You don't have permission to do that");
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be logged in to do that');
    res.redirect('back');
  }
};

//middleware that checks if the user already reviewed the campground and disallows further actions if they did
middlewareObj.checkReviewExistence = function(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id)
      .populate('reviews')
      .exec(function(err, foundCampground) {
        if (err || !foundCampground) {
          req.flash('error', 'Campground not found.');
          res.redirect('back');
        } else {
          //check if req.user._id exists in foundCampground.reviews
          var foundUserReview = foundCampground.reviews.some(function(review) {
            return review.author.id.equals(req.user._id);
          });
          if (foundUserReview) {
            req.flash(
              'error',
              'You already wrote a review for this campground.'
            );
            return res.redirect('back');
          }
          //if the review was not found, go to the next middleware
          next();
        }
      });
  } else {
    req.flash('error', 'You need to be logged in to do that.');
    res.redirect('back');
  }
};

//middleware asking if user is logged in
middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'You need to be logged in to do that.');
  res.redirect('/login');
};

module.exports = middlewareObj;
