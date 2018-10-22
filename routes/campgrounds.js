const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const Review = require('../models/review');
const middleware = require('../middleware');

//INDEX - show all campgrounds
router.get('/', function(req, res) {
  //Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {
        campgrounds: allCampgrounds,
        page: 'campgrounds'
      });
    }
  });
});

//CREATE - add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res) {
  // get data from form and add to campgrounds array
  let name = req.body.name;
  let price = req.body.price;
  let image = req.body.image;
  let description = req.body.description;
  let author = {
    id: req.user._id,
    username: req.user.username
  };
  let newCampground = {
    name: name,
    price: price,
    image: image,
    description: description,
    author: author
  };
  // Create a new campground and save to DB
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

//NEW - show form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res) {
  res.render('campgrounds/new');
});

//SHOW - shows more info about one campground
router.get('/:id', function(req, res) {
  //find object with provided ID
  Campground.findById(req.params.id)
    .populate('comments')
    .populate({
      path: 'reviews',
      options: { sort: { createdAt: -1 } }
    })
    .exec(function(err, foundCampground) {
      //added error handling for edge case
      if (err || !foundCampground) {
        req.flash('error', 'Campground not found.');
        res.redirect('back');
      } else {
        //render show template with that object
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

//EDIT - get campground change form
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(
  req,
  res
) {
  Campground.findById(req.params.id, function(err, foundCampground) {
    res.render('campgrounds/edit', { campground: foundCampground });
  });
});

//UPDATE - post campground changes
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  //find and update the correct campground
  Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(
    err,
    updatedCampground
  ) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

//DESTROY - delete campground
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res) {
  Campground.findById(req.params.id, function(err, campground) {
    if (err) {
      res.redirect('/campgrounds');
    } else {
      //deletes all comments associated with the campground
      Comment.remove({ _id: { $in: campground.comments } }, function(err) {
        if (err) {
          console.log(err);
          return res.redirect('/campgrounds');
        }
        //deletes all reviews associated with the campground
        Review.remove({ _id: { $in: campground.reviews } }, function(err) {
          if (err) {
            console.log(err);
            return res.redirect('/campgrounds');
          }
          //delete the campground
          campground.remove();
          req.flash('success', 'Campground has been successfully deleted.');
          res.redirect('/campgrounds');
        });
      });
    }
  });
});

module.exports = router;
