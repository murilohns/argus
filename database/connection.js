var mongoose = require('mongoose');
var chalk = require('chalk');
var Promise = require('bluebird');

mongoose.Promise = Promise;

function Database() {

  return {
    connect: () => {

      if( process.env.NODE_ENV !== 'test' ) {
        mongoose.connection.once('open', () => {
          console.log('mongoose ' + chalk.green('connected'));
        });

        mongoose.connection.once('close', () => {
          console.log('mongoose ' + chalk.red('disconnected'));
        });
      }

      const url = process.env.NODE_ENV === 'test'? 'mongodb://localhost/testing' : 'mongodb://localhost/perryworker';
      mongoose.connect(url);
    },
    close: () => {
      mongoose.connection.close();
    }
  };
}

module.exports = Database;
