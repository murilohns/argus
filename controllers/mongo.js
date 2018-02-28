var mongoose = require('mongoose');
var chalk = require('chalk');
var Promise = require('bluebird');

var mongoUrl = process.env.NODE_ENV === 'test' ? 'mongodb://localhost/testing' : 'mongodb://localhost/perryworker';
console.log(mongoUrl);

mongoose.connect(mongoUrl);
mongoose.promise = Promise;
var db = mongoose.connection;

db.once('open', () => {
  console.log('mongoose ' + chalk.green('connected'));
});

db.once('close', () => {
  console.log('mongoose ' + chalk.red('disconnected'));
});

module.exports = db;
