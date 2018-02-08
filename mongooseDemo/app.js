var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mongooseDemo');

var bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  pageCount: Number,
});

var Book = mongoose.model('Book', bookSchema);

var hp1 = new Book({
  title: 'Harry Potter and the filosopher stone',
  author: 'J.K.Rowling',
  pageCount: 253,
});

hp1.save(function (err, book) {
  if (err) {
    console.log(err);
  } else {
    console.log('New book. Yay!!');
    console.log(book);
  }
});
