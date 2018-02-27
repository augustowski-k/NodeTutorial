var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Campground = require('./models/campground');
var Comment = require('./models/comment');
var seedDB = require('./seeds');

seedDB();
mongoose.connect('mongodb://localhost/yelp_camp');
var app = express();
app.use(express.static('public'));
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
      res.render('campgrounds/index', { campsites: camps });
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
  res.render('campgrounds/new');
});

app.get('/campgrounds/:id', function (req, res) {
  Campground.findById(req.params.id).populate('comments').exec(function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('campgrounds/show', campground);
    }
  });
});

// Comment route
app.get('/campgrounds/:id/comments/new', function (req, res) {
  Campground.findById(req.params.id, function (err, campground) {
    if (err) {
      console.log(err);
    } else {
      res.render('comments/new', { camp: campground });
    }
  });
});

app.post('/campgrounds/:id/comments', function (req, res) {
  var comment = req.body.comment;
  Campground.findById(req.params.id, function (err, camp) {
    if (err) {
      console.log(err);
    } else {
      Comment.create(comment, function (err, newComment) {
        if (err) {
          console.log(err);
        } else {
          camp.comments.push(newComment._id);
          camp.save(function (err, editedCamp) {
            if (err) {
              console.log(err);
            } else {
              res.redirect('/campgrounds/' + editedCamp._id);
            }
          });
        }
      });
    }
  });
});

app.listen(80, function () {
  console.log('yelp server started');
});
