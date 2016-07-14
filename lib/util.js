const Util = {
  // Normalize the length of the vector to 1, maintaining direction.
  dir (vec) {
    var norm = Util.norm(vec);
    return Util.scale(vec, 1 / norm);
  },

  //gets random number in range
  randomInRange(min, max){
    return Math.random() * (max - min) + min;
  },
  // Find distance between two points.
  dist (pos1, pos2) {
    return Math.sqrt(
      Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2)
    );
  },


  randomFloat (min, max){
  	return min + Math.random()*(max-min);
  },

  // Find the length of the vector.
  norm (vec) {
    return Util.dist([0, 0], vec);
  },

  //finds vector between two points
  findVector(point1, point2) {
    return [(point2[0] - point1[0]), (point2[1] - point1[1])]
  },


  // Return a randomly oriented vector with the given length.
  randomVec (length) {
    var deg = 2 * Math.PI * Math.random();
    return Util.scale([Math.sin(deg), Math.cos(deg)], length);
  },
  // Scale the length of a vector by the given amount.
  scale (vec, m) {
    return [vec[0] * m, vec[1] * m];
  },
  inherits (ChildClass, BaseClass) {
    function Surrogate () { this.constructor = ChildClass; }
    Surrogate.prototype = BaseClass.prototype;
    ChildClass.prototype = new Surrogate();
  },

  wrap (coord, max) {
    if (coord < 0) {
      return max - (coord % max);
    } else if (coord > max) {
      return coord % max;
    } else {
      return coord;
    }
  }
};

module.exports = Util;
