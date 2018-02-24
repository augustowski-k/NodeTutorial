var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongoose_continuation_embeded');

var postSchema = new mongoose.Schema({
  title: String,
  content: String,
});
var Post = mongoose.model('Post', postSchema);

var userSchema = new mongoose.Schema({
  email: String,
  name: String,
  posts: [postSchema],
});
var User = mongoose.model('User', userSchema);

var newUser = User({
  email: 'ktos@cos.pl',
  name: 'ktos',
});

newUser.posts.push({
  title: 'new post is here',
  content: 'yes it is new one',
});

newUser.save(function (err, user) {
  if (err) {
    console.log(err);
  } else {
    console.log(user);
  }
});

// var newPost = new Post({
//   title: 'Hello you',
//   content: 'it is nice to meet you',
// });
// a
// newPost.save(function (err, post) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(post);
//   }
// });
