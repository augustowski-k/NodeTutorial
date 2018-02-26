var mongoose = require('mongoose');

var campgroundSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  imgUrl: { type: String, required: true },
  description: String,
});
var Campground = mongoose.model('Campground', campgroundSchema);

module.exports = Campground;
