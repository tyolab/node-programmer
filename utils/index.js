module.exports = {
    /**
     * Code was taken from stackoverflow but forgot the put down the link and author's name
     * will put it back here when coming crossing it again
     * 
     * Function equal to merge with the difference being that no reference
     * to original objects is kept.
     *
     * @see merge
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    deep_merge: function()  {
     var result = {};
     function assign_value(val, key) {
       if (typeof result[key] === 'object' && typeof val === 'object') {
         result[key] = deep_merge(result[key], val);
       } else if (typeof val === 'object') {
         result[key] = deep_merge({}, val);
       } else {
         result[key] = val;
       }
     }
   
     for (var i = 0, l = arguments.length; i < l; i++) {
       if (!arguments[i])
         continue;
      
       forEach(arguments[i], assign_value);
     }
     return result;
   }
}