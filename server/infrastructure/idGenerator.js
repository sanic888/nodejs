var mongoose = require('mongoose');

module.exports = function(){
  return mongoose.Types.ObjectId().toString();
};