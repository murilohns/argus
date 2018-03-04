var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', routes);

app.listen(3000, function() {
  console.log('Listening on port 3000...');
});

module.exports = app;
