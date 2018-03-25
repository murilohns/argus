var express = require('express');
var bodyParser = require('body-parser');
var app = express();
require('./database/connection');

var routes = require('./routes');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/', routes);

const port = process.env.PORT || 8081;
app.listen(port, function() {
  console.log(`Listening on port ${port}...`);
});

module.exports = app;
