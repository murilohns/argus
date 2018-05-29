import mongoose from 'mongoose';
import chalk from 'chalk';
import Promise from 'bluebird';

import config from '../config.js';

mongoose.connect( config.get('mongo.url'), { useMongoClient: true } );
mongoose.Promise = Promise;

mongoose.connection.on('error', error => {
  console.log(`${chalk.red('Mongo connection error:')} ${error}`);
  process.exit(1);
});

mongoose.connection.once('open', () => {
  console.log( chalk.green('Mongo successfully connected...') );
});

export default mongoose;
