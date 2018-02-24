var mongoose = require('mongoose');
var User = require('./models/user.js');
var Post = require('./models/post.js');

mongoose.connect('mongodb://localhost/mongoose_continuation_references');

User.create({
  email: 'nn@nn.nn',
  name: 'John Doe',
});

Post.create({
  title: 'hohohoho',
  content: 'Hello hello hello',
}, function (err, post) {
  if (err) {
    console.log(err);
  } else {
    User.findOne({ email: 'ktos@cos.pl' }, function (err, user) {
      if (err) {
        console.log(err);
      } else {
        user.posts.push(post._id);
        user.save(function (err, savedUser) {
          console.log(savedUser);
        });
      }
    });
  }
});

User.findOne({ email: 'ktos@cos.pl' }).populate('posts').exec(function (err, user) {
  if (err) {
    console.log(err);
  } else {
    console.log(user);
  }
});
