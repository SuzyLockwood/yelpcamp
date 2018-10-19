require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const seedDB = require('./seeds');

seedDB();
mongoose.connect(process.env.MONGODB_URI);
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

//Landing page
app.get('/', function(req, res) {
  res.render('landing');
});

//Index - lists all objects
app.get('/campgrounds', function(req, res) {
  Campground.find({}, function(err, allCampgrounds) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { campgrounds: allCampgrounds });
    }
  });
});

//Create - add object to db collection
app.post('/campgrounds', function(req, res) {
  let name = req.body.name;
  let image = req.body.image;
  let description = req.body.description;
  let newCampground = { name: name, image: image, description: description };
  Campground.create(newCampground, function(err, newlyCreated) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/campgrounds');
    }
  });
});

//New object form
app.get('/campgrounds/new', function(req, res) {
  res.render('new.ejs');
});

//Show more detail about object
app.get('/campgrounds/:id', function(req, res) {
  //find object with provided ID
  Campground.findById(req.params.id)
    .populate('comments')
    .exec(function(err, foundCampground) {
      if (err) {
        console.log(err);
      } else {
        //render show template with that object
        res.render('show', { campground: foundCampground });
      }
    });
});

app.listen(process.env.PORT || '3000', process.env.IP, function() {
  console.log('Yelpcamp!');
});
