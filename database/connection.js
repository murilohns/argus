var mongoose = require('mongoose');
var chalk = require('chalk');
var Promise = require('bluebird');

mongoose.Promise = Promise;

let url = 'mongodb://localhost/testing';

/* istanbul ignore if */
if( process.env.NODE_ENV !== 'test' ) {
  mongoose.connection.once('open', () => {
    console.log('mongoose ' + chalk.green('connected'));
  });

  mongoose.connection.once('close', () => {
    console.log('mongoose ' + chalk.red('disconnected'));
  });

  url = 'mongodb://localhost/perryworker';
}

mongoose.connect(url);
