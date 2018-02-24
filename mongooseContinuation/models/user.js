var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, },
  name: String,
  posts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});
var User = mongoose.model('User', userSchema);

module.exports = User;
