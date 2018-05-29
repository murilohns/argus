const Helpers = {

  isPromise: function(obj) {
    return ( obj && obj.then !== undefined );
  },
  isArray: function(obj) {
    return ( obj && obj.constructor === Array );
  },
  findPromises: function(obj) {

    let foundPromises = [];
    if( isArray(obj) ) {

      for( let i = 0; i < obj.length; i += 1 ) {
        if( isPromise(obj[i]) ) {
          foundPromises.push( obj[i] );
        }
      }

    } else {
      if( isPromise(obj) ) {
        foundPromises.push( obj );
      }
    }

    return foundPromises;
  },
  /**
    @param {Object} spec
    @param {Object} spec.object
    @param {Object} spec.buildControllerPayload
    @param {Promise} controller
  */
  prepareControllerPromise: function( spec, controller ) {
    let { object, buildControllerPayload } = spec;

    let controllerSpec = buildControllerPayload(object);

    return controller.save(controllerSpec);
  },
  /**
    @param {Object} spec
    @param {Object} spec.objects
    @param {Object} spec.buildControllerPayload
    @param {Promise} controller
  */
  prepareControllerPromises: function( spec, controller ) {
    const { buildControllerPayload } = spec;

    return spec.objects.map( object => {
      return this.prepareControllerPromise({
        object,
        buildControllerPayload
      }, controller);
    });
  }
}

export default Helpers;
