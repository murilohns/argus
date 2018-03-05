var express = require('express');
var bodyParser = require('body-parser');
var app = express();

var routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', routes);

const port = 8081;
app.listen(port, function() {
  console.log(`Listening on port ${port}...`);
});

module.exports = app;
