require('console.table');
var nj = require('numjs');
var express = require('express');

/*
Server not part of this task
*/
var app = express();
var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  var host = server.address()
    .address;
  var port = server.address()
    .port;
}
app.use(express.static('public'));





var forward = [[0.5, 0.5]];
var backward = [[1.0, 1.0]];
var smoothed = [];
/*
Possible states: state 1 = rain, state 2 = no rain
The weather has a 70 % chance of staying the same, and 30% chance of changing
*/
var T = [
    [0.7, 0.3],
    [0.3, 0.7]
  ];

/*
  Observations: umbrella, umbrella, no umbrella, umbrella, umbrella
*/
var observ = [
    [[0.9, 0.0], [0.0, 0.2]],
    [[0.9, 0.0], [0.0, 0.2]],
    [[0.1, 0.0], [0.0, 0.8]],
    [[0.9, 0.0], [0.0, 0.2]],
    [[0.9, 0.0], [0.0, 0.2]]
  ];

/*
f = forward probability for either state. Starting with 0.5 for each.
*/
var f = [0.5, 0.5];

/*
b = forward probability for either state. Starting with 1.0 for each.
*/
var b = [1.0, 1.0];


/*
-----------Forward/Backward--------------
*/

/*
For all observations (one for each day) do the forwards- and backwards algorithm
*/
for (var i = 0; i < observ.length; i++) {
  /*
  Forward: dot observation for the day, T and f. Store the new value as the new f
  */
  f = nj.dot((nj.dot(observ[i], T)), f);

  /*
  Normalize values in f
  */
  f.divide(f.sum(), false);

  /*
  Store the result
  */
  forward.push([f.get(0), f.get(1)]);

  /*
  Forward: dot the T, observation for the day and b. Store the new value as the new b
  */
  b = nj.dot((nj.dot(T, observ[i])), b);

  /*
  Normalize values in b
  */
  b.divide(b.sum(), false);

  /*
  Store the result
  */
  backward.push([b.get(0), b.get(1)]);
}

/*
Reverse the results from the backward algorithm so it's easier to smooth
*/
backward = backward.reverse();


/*
-------------Smoothing--------------
*/
/*
For all results from the forwards- and backwards algorithm do smoothing
*/
for (var i = 0; i < forward.length; i++) {
  /*
  Smooth according to algorithm and store result
  */
  smoothed.push([(forward[i][0] * backward[i][0]), (forward[i][1] * backward[i][1])]);

  /*
  Normalize the result
  */
  var sumToOne = smoothed[i].reduce((a, b) => a + b, 0);
  smoothed[i][0] /= sumToOne;
  smoothed[i][1] /= sumToOne;
}


/*
-------------Viterbi------------
*/

/*
Initialize with first values from the forward array
*/
var viterbi = [[forward[1][0], forward[1][1]]];


for (var i = 1; i < observ.length; i++) {
  var observTrue = observ[i][0][0];
  var observFalse = observ[i][1][1];

  /*
  Store max of both the T values times both of the last viterbi values. Do this for both
  'rain' and 'No rain'
  */

  console.log(observTrue, '* max(', T[0][0], '*', viterbi[i - 1][0], ',', T[0][1], '*', viterbi[i - 1][1], ')');
  console.log(observTrue, '*', nj.max(T[0][0] * viterbi[i - 1][0], T[0][1] * viterbi[i - 1][1]));
  console.log(observTrue * nj.max(T[0][0] * viterbi[i - 1][0], T[0][1] * viterbi[i - 1][1]));
  console.log("\n")

  console.log(observFalse, "* max(", T[0][1], "*", viterbi[i - 1][0], ",", T[0][0], "*", viterbi[i - 1][1], ")");
  console.log(observFalse, '*', nj.max(T[0][1] * viterbi[i - 1][0], T[0][0] * viterbi[i - 1][1]))
  console.log(observFalse * nj.max(T[0][1] * viterbi[i - 1][0], T[0][0] * viterbi[i - 1][1]));
  console.log("\n")



  viterbi.push([
    observTrue * nj.max(T[0][0] * viterbi[i - 1][0], T[0][1] * viterbi[i - 1][1]), //rain
    observFalse * nj.max(T[1][0] * viterbi[i - 1][0], T[1][1] * viterbi[i - 1][1]) //no rain
    ]);


}

/*
Reverse array to make it easier to iterate through
*/

viterbi = viterbi.reverse();

/*
Make viterbi path with text
*/
var viterbiText = [];
for (var i = 0; i < viterbi.length; i++) {
  if (nj.max(viterbi[i]) == viterbi[i][0]) {
    viterbiText.push('Rain: ' + viterbi[i][0]);
  } else {
    viterbiText.push('No Rain: ' + viterbi[i][1]);
  }
}

viterbi = viterbi.reverse();


/*
Print the results
*/
console.log('---------------Forwards----------------');
console.table(forward);
console.log('---------------Backwards----------------');
console.table(backward);
console.log('---------------Smoothed----------------');
console.table(smoothed);

console.log('---------------Viterbi----------------');
console.table(viterbi);

console.log('Most likely viterbi path in reverse order: \n');
for (var i = 0; i < viterbiText.length; i++) {
  console.log(viterbiText[i]);
}
