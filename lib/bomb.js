const MovingObject = require("./moving_object");
const Util = require("./util");
const Ship = require("./ship");

const Bomb = function(options){
  options.radius = Bomb.RADIUS;
  options.color = "#FFA318";
  options.shape = "triangle";
  options.vel = Util.randomVec(10);
  options.pos = options.game.randomPosition();

  MovingObject.call(this, options);
}

Bomb.RADIUS = 15;

Util.inherits(Bomb, MovingObject);

Bomb.prototype.maxVelocity = function(xvel, yvel){
  let finalx = xvel;
  let finaly = yvel;
  if (xvel > 0.75){
    finalx = 0.75;
  }
  else if (xvel < -0.75){
    finalx = -0.75;
  }

  if (yvel > 0.75){
    finaly = 0.75;
  }
  else if (yvel < -0.75){
    finaly = -0.75;
  }
  return [finalx, finaly];
}


const NORMAL_FRAME_TIME_DELTA = 1000/60;
Bomb.prototype.move = function(timeDelta){
  //timeDelta is number of milliseconds since last move
  //if the computer is busy the time delta will be larger
  //in this case the MovingObject should move farther in this frame
  //velocity of object is how far it should move in 1/60th of a second
  const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
      offsetX = this.vel[0] * velocityScale,
      offsetY = this.vel[1] * velocityScale;

  const maxVel = this.maxVelocity(offsetX, offsetY)

  const oldPos = this.pos.slice();
  this.pos = [this.pos[0] + maxVel[0], this.pos[1] + maxVel[1]];

  if (this.game.isOutOfBounds(this.pos)) {
    if (this.pos[0] <= 0 || this.pos[0] >= 1000){
      this.vel[0] *= -1;
    }
    if (this.pos[1] <= 0 || this.pos[1] >= 600){
      this.vel[1] *= -1;
    }
    this.pos = oldPos;
  }
}

Bomb.prototype.collideWith = function(otherObject){
  if (otherObject instanceof Ship){
    this.game.explode(this);
    return true;
  }
}

module.exports = Bomb;
