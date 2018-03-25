var mongoose = require('mongoose');

var campgroundSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  imgUrl: { type: String, required: true },
  description: String,
  comments: [{type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}],
  owner: {
    id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    email: String
  },
  price: String
});
var Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;
