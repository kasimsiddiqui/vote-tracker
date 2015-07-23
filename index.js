'use strict';

var express = require('express');
var cool = require('cool-ascii-faces');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.get('/secret', function(request, response) {
  response.status(200).send("<h1>boo!!!!</h1>");
});

app.get('/*', function(req, res) {
  res.status(404).sendFile("404.html", {root: __dirname + "/public/"});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});