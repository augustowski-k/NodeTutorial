var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var sanitizer = require('express-sanitizer');

var app = express();
mongoose.connect('mongodb://localhost/blog_app');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sanitizer());
app.use(methodOverride('_method'));

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

app.post('/blogs', function (req, res) {
  var blogData = req.body.blog;
  blogData.body = req.sanitize(blogData.body);
  Blog.create(blogData, function (err, blog) {
    if (err) {
      console.log(err);
      res.send('Something went wrong');
    } else {
      res.redirect('/blogs');
    }
  });
});

app.get('/blogs/:id', function (req, res) {
  Blog.findOne({ _id: req.params.id }, function (err, postData) {
    if (err) {
      res.send('Nothing interesting here:' + err);
    } else {
      res.render('show', postData);
    }
  });
});

app.get('/blogs/:id/edit', function (req, res) {
  Blog.findOne({ _id: req.params.id }, function (err, postData) {
    if (err) {
      res.send('Nothing interesting here:' + err);
    } else {
      res.render('edit', postData);
    }
  });
});

app.put('/blogs/:id', function (req, res) {
  var blogData = req.body.blog;
  blogData.body = req.sanitize(blogData.body);
  Blog.findByIdAndUpdate(req.params.id, blogData, function (err, blogData) {
    if (err) {
      res.send('Error');
    } else {
      res.redirect('/blogs/' + blogData._id);
    }
  });
});

app.delete('/blogs/:id', function (req, res) {
  Blog.findByIdAndRemove(req.params.id, function (err) {
    res.redirect('/blogs');
  });
});

app.listen(80, function () {
  console.log('Blog application started');
});
