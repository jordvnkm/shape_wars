const MovingObject = require("./moving_object");
const Util = require("./util");
const Ship = require("./ship");


const Enemy = function(options){
  options.radius = Enemy.RADIUS;
  options.color = 'red';
  options.shape = 'rectangle';
  options.vel = [0,0];
  this.start = 0;
  MovingObject.call(this, options);
}


Enemy.RADIUS = 10;

Util.inherits(Enemy, MovingObject);

Enemy.prototype.maxVelocity = function(xvel, yvel){
  let finalx = xvel;
  let finaly = yvel;
  if (xvel > 2){
    finalx = 2;
  }
  else if (xvel < -2){
    finalx = -2;
  }

  if (yvel > 2){
    finaly = 2;
  }
  else if (yvel < -2){
    finaly = -2;
  }
  return [finalx, finaly];
}

Enemy.prototype.maxImpulse = function(impulse){
  let finalx = impulse[0];
  let finaly = impulse[1];
  if (impulse[0] > 1){
    finalx = 1;
  }
  else if (impulse[0] < -1){
    finalx = -1;
  }

  if (impulse[1] > 1){
    finaly = 1;
  }
  else if (impulse[1] < -1){
    finaly = -1;
  }
  return [finalx, finaly];
}


const NORMAL_FRAME_TIME_DELTA = 1000/60;
Enemy.prototype.move = function(timeDelta){
  //timeDelta is number of milliseconds since last move
  //if the computer is busy the time delta will be larger
  //in this case the MovingObject should move farther in this frame
  //velocity of object is how far it should move in 1/60th of a second
  if (this.start < 100){
    this.start += 1;
    return;
  }
  this.color = '#00ffff'
  let impulse = Util.findVector(this.pos, this.game.ships[0].pos);
  let maxImpulse = Util.dir(impulse);
  let newVel = [this.vel[0] + maxImpulse[0], this.vel[1] + maxImpulse[1]];
  let maxVel = this.maxVelocity(newVel[0], newVel[1]);
  this.vel = maxVel;
  this.pos = [this.pos[0] + maxVel[0], this.pos[1] + maxVel[1]];
}


Enemy.prototype.collideWith = function(otherObject){
  if (this.color == 'red'){
    return false;
  }
  if (otherObject instanceof Ship){
    this.game.playing = false
    $('#reset').css("visibility", "visible");
    $('#score').text(`Your score: ${this.game.score}`)
    return true;
  }
}


module.exports = Enemy;
