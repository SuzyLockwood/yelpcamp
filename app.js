const express = require('express');
const app = express();
const bodyParser = require('body-parser');

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

app.get('/', function(req, res) {
  res.render('landing');
});

app.get('/campgrounds', function(req, res) {
  res.render('campgrounds', { campgrounds: campgrounds });
});

app.post('/campgrounds', function(req, res) {
  let name = req.body.name;
  let image = req.body.image;
  let newCampground = { name: name, image: image };
  campgrounds.push(newCampground);
  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function(req, res) {
  res.render('new.ejs');
});

app.listen(process.env.PORT || '3000', process.env.IP, function() {
  console.log('Yelpcamp!');
});
