var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema({
  content: { type: String, required: true, },
  author: { type: String, required: true, },
});

var Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
