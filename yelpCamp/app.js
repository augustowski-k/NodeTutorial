var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/yelp_camp');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

var campgroundSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  imgUrl: { type: String, required: true },
});
var Campground = mongoose.model('Campground', campgroundSchema);

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/campgrounds', function (req, res) {
  Campground.find({}, function (err, camps) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds', { campsites: camps });
      console.log('campgrounds page served');
    }
  });
});

app.post('/campgrounds', function (req, res) {
  var name = req.body.name;
  var imgUrl = req.body.imgUrl;

  Campground.create({ name: name, imgUrl: imgUrl }, function (err, campground) {
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

app.listen(8080, function () {
  console.log('yelp server started');
});
