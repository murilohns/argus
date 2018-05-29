/**
  @param {Object} filterOptions
  @param {Array} filterOptions.blacklist
  @param {Array} filterOptions.whitelist
  @param {Array} filterOptions.itemsToFilter
  @param {Function} getValueToCompare
*/
function Sieve(filterOptions, getValueToCompare) {

  function filterInclusive( comparableList ) {
    let filteredItems = [];

    filterOptions.itemsToFilter.forEach( item => {
      const comparableValue = ( getValueToCompare )? getValueToCompare(item) : item;

      if( has(comparableList, comparableValue) ) {
        filteredItems.push(item);
      }
    });

    return filteredItems;
  }

  function filterExclusive( comparableList ) {
    let filteredItems = [];

    filterOptions.itemsToFilter.forEach( item => {
      const comparableValue = ( getValueToCompare )? getValueToCompare(item) : item;

      if( !has(comparableList, comparableValue) ) {
        filteredItems.push(item);
      }
    });

    return filteredItems;
  }

  function has( comparableList, value ) {

    for( let i = 0; i < comparableList.length; i += 1 ) {
      if( comparableList[i] === value ) return true;
    }

    return false;
  }

  return {
    mitigate: function() {
      if( filterOptions.blacklist && filterOptions.whitelist ) {
        throw {
          type: 'FilterException',
          message: "Can't filter for both blacklist and whitelist"
        };
      }

      if( filterOptions.blacklist ) {
        return filterExclusive( filterOptions.blacklist );
      } else if( filterOptions.whitelist ) {
        return filterInclusive( filterOptions.whitelist );
      }
    }
  }
}

export default Sieve;
