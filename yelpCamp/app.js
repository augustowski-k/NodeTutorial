var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var seedDB = require('./seeds');

seedDB();
mongoose.connect('mongodb://localhost/yelp_camp');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/campgrounds', function (req, res) {
  Campground.find({}, function (err, camps) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { campsites: camps });
      console.log('campgrounds page served');
    }
  });
});

app.post('/campgrounds', function (req, res) {
  var name = req.body.name;
  var imgUrl = req.body.imgUrl;
  var description = req.body.description;
  var newCamp = { name: name, imgUrl: imgUrl, description: description };

  Campground.create(newCamp, function (err, campground) {
    if (err) {
      console.log(err);
      res.send(err);
    } else {
      console.log('Created campground with name: ' + campground.name);
      res.redirect('/campgrounds');
    }
  });
});

app.get('/campgrounds/new', function (req, res) {
  res.render('new');
});

app.get('/campgrounds/:id', function (req, res) {
  Campground.findById(req.params.id).populate('comments').exec(function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      console.log(campground);
      res.render('show', campground);
    }
  });
});

app.listen(80, function () {
  console.log('yelp server started');
});
