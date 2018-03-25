var mongoose = require('mongoose');
var chalk = require('chalk');
var Promise = require('bluebird');

mongoose.Promise = Promise;

let url = process.env.DB_URL;

mongoose.connection.once('open', () => {
  console.log('mongoose ' + chalk.green('connected'));
});

mongoose.connection.once('close', () => {
  console.log('mongoose ' + chalk.red('disconnected'));
});

mongoose.connect(url);
