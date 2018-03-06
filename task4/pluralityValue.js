//Finds the most common class
exports.pluralityValue = function(examples){
  var ones = 0;
  var twos = 0;

  for (var i = 0; i < examples.length; i++) {
    if(examples[-1] == '1'){
      ones++;
    }
    else{
      twos++;
    }
  }

  if (ones > twos){
		return 1
  }
	else if( twos > ones){
		return 2
  }
	else{
    return Math.floor(Math.random() * 2) + 1
  }
}
