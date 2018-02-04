var express = require('express');
var app = express();
var request = require('request');
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
  res.render('search');
});

app.get('/results', function (req, res) {
  console.log('results requested');
  var url = 'http://omdbapi.com/?apikey=thewdb&s=' + req.query.keyword;
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      res.send(res.render('results', { data: data }));
    } else {
      res.send('error: ' + response.statusCode);
    }
  });
});

app.listen(8080, function () {
  console.log('Started server on port 8080');
});
