var B = require('./B')
  .B;

//Calculates the information gain based on the B value and return the attribute with most gain
//Much of this is hardcoded for this data set
exports.importance = function(data, attributes) {

  var col = 0;
  var gains = [];
  var gainsInfo = [];
  while (col < data[0].length - 1) {
    if (attributes.indexOf(col) > -1) {
      var currColNumbers = {};
      var currColBooleans = {
        '1': 0,
        '2': 0
      };
      var lines = [];
      for (var i = 0; i < data.length; i++) {
        var curr = data[i][col];
        if (!currColNumbers[curr]) {
          currColNumbers[curr] = 1;
        } else {
          currColNumbers[curr]++;
        }
        if (data[i][data[0].length - 1] == '1') {
          currColBooleans[curr.toString()]++;
        }

        lines.push([i, data[i][col], data[i][data[0].length - 1]])
      }

      gains.push(
        1 -
        (((currColNumbers['1'] / data.length) * B(currColBooleans['1'] / currColNumbers['1'])) +
          ((currColNumbers['2'] / data.length) * B(currColBooleans['2'] / currColNumbers['2']))));
      gainsInfo.push([currColNumbers, currColBooleans, lines]);
    }
    else{
      gains.push(-1);
    }
    col++;
  }


  var max = gains[0];
  var maxIndex = 0;

  for (var i = 1; i < gains.length; i++) {
    if (gains[i] > max) {
      maxIndex = i;
      max = gains[i];
    }
  }


  return maxIndex;
}
