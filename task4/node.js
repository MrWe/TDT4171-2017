//Each node in the tree structure
function Node(index) {
  this.index = index;
  this.children = [];

  //called on root to recursive print tree as json
  this.prettyPrint = function() {
    var tree = {};
    tree[this.index] = {};

    if(this.children.length === 0){
      return this.index;
    }
    else{
      var children = [];
      for (var i = 0; i < this.children.length; i++) {
        if(this.children[i]){
          children.push(this.children[i].prettyPrint());
        }
        tree[this.index] = children;
      }
    }
    return tree;
  }
}
module.exports = Node;
