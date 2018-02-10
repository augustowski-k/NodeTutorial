var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = express();
mongoose.connect('mongodb://localhost/blog_app');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

var blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  img: { type: String, required: false },
  body: { type: String, required: true },
  created: { type: Date, default: Date.now },
});

var Blog = mongoose.model('Blog', blogSchema);

app.get('/', function (req, res) {
  res.redirect('/blogs');
});

app.get('/blogs', function (req, res) {
  Blog.find({}, function (err, blogs) {
    if (err) {
      console.log(err);
    } else {
      res.render('index', { blogs: blogs });
    }
  });
});

app.get('/blogs/new', function (req, res) {
  res.render('new');
});

app.listen(80, function () {
  console.log('Blog application started');
});
