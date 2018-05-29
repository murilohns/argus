import chalk from 'chalk';
import Promise from 'bluebird';

/**
  @param {Object[]} requests
  @param {Promise} requests.promise
  @param {Function} requests.registrator
*/
function Worker(requests) {

  function getPromises() {
    let promises = [];

    requests.forEach( (requestBundle) => {
      promises.push( requestBundle.promise );
    });

    return promises;
  }

  function deliverPromisesResponsesToCallbacks( responses, callback ) {

    let promises = [];
    for( let i = 0; i < responses.length; i += 1 ) {
      let mongoReplicator = requests[i].callback;
      promises.push( mongoReplicator( responses[i] ) );
    }

    Promise.all(promises)
    .then( () => {
      callback();
    })
  }

  function runPromises(callback) {
    return Promise.all(getPromises())
    .then( responses => {
      deliverPromisesResponsesToCallbacks( responses, callback );
    })
    .catch( error => {
      console.log( error );
    });
  }

  return {
    run: function(callback) {
      console.log(chalk.yellow('Worker started executing...'));

      return runPromises(callback);
    }
  }
}

export default Worker;
