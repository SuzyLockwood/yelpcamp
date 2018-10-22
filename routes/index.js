const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

//show register/signup form
router.get('/register', function(req, res) {
  res.render('register', { page: 'register' });
});

// signup logic
router.post('/register', function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err);
      return res.render('register', { error: err.message });
    }
    passport.authenticate('local')(req, res, function() {
      req.flash(
        'success',
        'Successfully Signed Up! Nice to meet you, ' + req.body.username + '.'
      );
      res.redirect('/campgrounds');
    });
  });
});

//show login form
router.get('/login', function(req, res) {
  res.render('login', { page: 'login' });
});

// login logic
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: 'Welcome back!'
  }),
  function(req, res) {}
);

// logout logic
router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You have successfully logged out.');
  res.redirect('/campgrounds');
});

module.exports = router;
