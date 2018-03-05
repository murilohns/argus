const Mongo = require('./connection');

const connectionManager = callback => {

  let conn = async c => {
    Mongo().connect();
    const result = await c();
    Mongo().close();
    return result;
  };

  if( process.env.NODE_ENV === 'test' ) return callback;

  return conn.bind(null, callback);
};

module.exports = {
  connectionManager
};
