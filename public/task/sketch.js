var forward = [[0.5, 0.5]];
var backward = [[1.0, 1.0]];
var smoothed = [];
/*
function setup() {
  createCanvas(1000, 500);
  background(0);
*/

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
Print the results
*/
console.log('Forwards: ');
console.table(forward);
console.log('Backwards: ');
console.table(backward);
console.log('Smoothed: ');
console.table(smoothed);

//}

/*

//Writing to canvas
function draw() {
  fill(255);
  var textTranslate = 0;
  for (var i = 0; i < forward.length; i++) {
    text("Forward", 50, height / 2 - 15);
    text("Day " + i + ":    " + Math.round(forward[i][0] * 1000) / 1000, 10, height / 2 + textTranslate);
    text(Math.round(forward[i][1] * 100) / 100, 90, height / 2 + textTranslate);
    textTranslate += 10;
  }

  textTranslate = 0;
  for (var i = 0; i < backward.length; i++) {
    text("Backward", 230, height / 2 - 15);
    text("Day " + i + ":    " + Math.round(backward[i][0] * 1000) / 1000, 200, height / 2 + textTranslate);
    text(Math.round(backward[i][1] * 1000) / 1000, 280, height / 2 + textTranslate);
    textTranslate += 10;
  }

  textTranslate = 0;
  for (var i = 0; i < smoothed.length; i++) {
    text("smoothed", 420, height / 2 - 15);
    text("Day " + i + ":    " + Math.round(smoothed[i][0] * 1000) / 1000, 390, height / 2 + textTranslate);
    text(Math.round(smoothed[i][1] * 1000) / 1000, 470, height / 2 + textTranslate);
    textTranslate += 10;
  }
}

*/
