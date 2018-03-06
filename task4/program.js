var importance = require('./importance')
  .importance;
var pluralityValue = require('./pluralityValue')
  .pluralityValue;
var Node = require('./node');
var loadFile = require('./loadFile');
var util = require('util')


//Change to enable random importance
var random_importance = false;


//Get training data
function getData(callback) {
  loadFile.loadFile('data/training.txt', function(data) {
    data = String(data)
      .replace(/\t/g, '')
      .split('\n');



    callback(data);
  });

}


//Get test data
function getTestData(callback) {
  loadFile.loadFile('data/test.txt', function(data) {
    data = String(data)
      .replace(/\t/g, '')
      .split('\n');



    callback(data);
  });

}

//Classify children based on having only one class
function setClass(examples) {
  var classification = examples[0].substr(-1);
  for (var i = 0; i < examples.length; i++) {
    if (examples[i].substr(-1) != classification) {
      return false;
    }
  }
  return true;
}


//Algorithm as found in the book
function decision_tree_learning(examples, attributes, parent_examples, callback) {

  if (examples.length < 1) {
    //If leaf node, set value
    return new Node(pluralityValue(parent_examples));
  } else if (setClass(examples)) {
    //If class can be set without importance
    return new Node(examples[0].substr(-1));
  } else if (attributes.length < 1) {
    //If no more attributes, sett value
    return new Node(pluralityValue(examples));
  } else {
    if (random_importance) {
      var A = attributes[Math.floor(Math.random() * attributes.length)];
    } else {
      var A = importance(examples, attributes)
    }

    //Set new root and remove this attribut from list
    var tree = new Node(A);
    attributes.splice(attributes.indexOf(A), 1);

    //Generate new examples
    for (var i = 1; i < 3; i++) {
      var list = [];
      for (var j = 0; j < examples.length; j++) {
        if (examples[j][A] == i) {
          list.push(examples[j]);
        }
      }
      //recursive call
      var sub_tree = decision_tree_learning(list, attributes, examples, callback);

      //set children if exists
      if (sub_tree) {
        tree.children[i] = sub_tree;
      }

    }

  }
  //Return total tree when done
  return tree;
}

//Classify children for testing
function classifyChildren(root, line) {
  var current = root;
  while (current.children.length > 0) {
    current = current.children[line[current.index]]
  }
  return current.index;
}


//Function to test the tree, simply counts each time the class in the test data corresponds to the childs class
function test_tree(tree, data) {
  var numCorrect = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i].substr(-1) == classifyChildren(tree, data[i])) {
      numCorrect++;
    }
  }

  console.log(numCorrect);

  return numCorrect;

}


//RUN
getData(function(data) {
  //Hard coded attributes
  var attributes = [0, 1, 2, 3, 4, 5, 6, 7];

  //Start the algorithm
  var tree = decision_tree_learning(data, attributes, []);

  //Test the tree
  getTestData(function(test_data) {
    console.log((test_tree(tree, test_data) / test_data.length)*100 + '%');
  });

  //Pretty print
  console.log(util.inspect(tree.prettyPrint(), {showHidden: false, depth: null}));

});
