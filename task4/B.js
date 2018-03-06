//It will help to define B(q) as the entropy of a
//Boolean random variable that is true with probability q:

//Copied directly from the book, except that it returns 0 if q is 1 or 0
exports.B = function(q){
  return q >= 1 || q <= 0 ? 0 : (-(q * Math.log2(q) + (1-q) * Math.log2(1-q)));
}
