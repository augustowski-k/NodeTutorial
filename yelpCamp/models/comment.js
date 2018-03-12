var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  content: {type: String, required: true},
  author: {
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    email: String
  }
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
