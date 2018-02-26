var mongoose = require('mongoose');
var chalk = require('chalk');
var Promise = require('bluebird');

mongoose.connect('mongodb://localhost/perryworker');
mongoose.promise = Promise;
var db = mongoose.connection;

db.once('open', () => {
  console.log('mongoose ' + chalk.green('connected'));
});

db.once('close', () => {
  console.log('mongoose ' + chalk.red('disconnected'));
});

module.exports = db;
