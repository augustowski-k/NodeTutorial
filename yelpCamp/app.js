var express = require('express');
var camps = require('./camps');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('home');
});

app.get('/campgrounds', function (req, res) {
  res.render('campgrounds', { campsites: camps });
});

app.post('/campgrounds', function (req, res) {
  var name = req.body.name;
  var imgUrl = req.body.imgUrl;

  camps.push({ name: name, imgUrl: imgUrl });

  res.redirect('/campgrounds');
});

app.get('/campgrounds/new', function (req, res) {
  res.render('new');
});

app.listen(8080, function () {
  console.log('yelp server started');
});
