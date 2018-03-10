const removeNullProperties = obj => {
  for( let property in obj ) {
    if( obj.hasOwnProperty(property) && obj[property] === null ) {
      delete obj[property];
    }
  }

  return obj;
};

module.exports = {
  removeNullProperties
};
