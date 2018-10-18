require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI);

//SCHEMA SETUP
let campgroundSchema = new mongoose.Schema({
  name: String,
  image: String,
  description: String
});

let Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create(
//   {
//     name: 'Granite Hill',
//     image: 'https://farm7.staticflickr.com/6014/6015893151_044a2af184.jpg',
//     description:
//       'This is a huge granite hill, no bathrooms. No water. Beautiful granite. '
//   },
//   function(err, campground) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log('Newly created campground: ');
//       console.log(campground);
//     }
//   }
// );

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

let campgrounds = [
  {
    name: 'Salmon Creek',
    image:
      'https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104496f9c971aeeeb5be_340.jpg'
  },
  {
    name: 'Granite Hill',
    image: 'https://farm7.staticflickr.com/6014/6015893151_044a2af184.jpg'
  },
  {
    name: 'Mountain Goats Rest',
    image:
      'https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104496f9c971aeeeb5be_340.jpg'
  }
];

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
  Campground.findById(req.params.id, function(err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render('show', { campground: foundCampground });
    }
  });
});

app.listen(process.env.PORT || '3000', process.env.IP, function() {
  console.log('Yelpcamp!');
});
