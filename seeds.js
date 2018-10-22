const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comment = require('./models/comment');

let data = [
  {
    name: 'Cloud Peak',
    price: 5.95,
    image: 'https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg',
    description:
      'It is a restful home for clouds on top of a huge hill. I could stare at the clear sky all day near the lake.'
  },
  {
    name: 'Desert Mesa',
    price: 10.95,
    image: 'https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg',
    description:
      'So quiet and serene.  You will not find a better place to relax.'
  },
  {
    name: 'Canyon Floor',
    price: 12.55,
    image: 'https://farm1.staticflickr.com/189/493046463_841a18169e.jpg',
    description:
      'The sunsets are beautiful here. Come out and enjoy the gorgeous scenery.'
  }
];

function seedDB() {
  //Remove all campgrounds
  Campground.remove({}, function(err) {
    if (err) {
      console.log(err);
    }
    console.log('removed campgrounds!');
    Comment.remove({}, function(err) {
      if (err) {
        console.log(err);
      }
      console.log('removed comments!');
      //add a few campgrounds
      data.forEach(function(seed) {
        Campground.create(seed, function(err, campground) {
          if (err) {
            console.log(err);
          } else {
            console.log('added a campground');
            //create a comment
            Comment.create(
              {
                text: 'This place is great, but I wish there was internet',
                author: 'Homer'
              },
              function(err, comment) {
                if (err) {
                  console.log(err);
                } else {
                  campground.comments.push(comment);
                  campground.save();
                  console.log('Created new comment');
                }
              }
            );
          }
        });
      });
    });
  });
  //add a few comments
}

module.exports = seedDB;
