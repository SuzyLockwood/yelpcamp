const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

//INDEX - show all campgrounds
router.get('/', function(req, res) {
  //Get all campgrounds from DB
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/index', {
        campgrounds: allCampgrounds
      });
    }
  });
});

//CREATE - add new campground to DB
router.post('/', function(req, res) {
  // get data from form and add to campgrounds array
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let newCampground = { name: name, image: image, description: description };
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
router.get('/new', function(req, res) {
  res.render('campgrounds/new');
});

//SHOW - shows more info about one campground
router.get('/:id', function(req, res) {
  //find object with provided ID
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        //render show template with that object
        res.render('campgrounds/show', { campground: foundCampground });
      }
    });
});

module.exports = router;
