var fs = require('fs');

exports.loadFile = function(name, callback) {

  fs.readFile(name, 'utf8', function(err, data) {
    if (err) {
      return console.log(err);
    }
    callback(data);
  });

}
