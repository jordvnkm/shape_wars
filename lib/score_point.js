const MovingObject = require("./moving_object");
const Util = require("./util");
const Ship = require("./ship");


const ScorePoint = function(options){
  options.radius = ScorePoint.RADIUS;
  options.color = 'yellow';
  options.shape = "circle";
  options.vel = Util.randomVec(1);
  this.time = 0;

  MovingObject.call(this , options);
}

ScorePoint.RADIUS = 3;

Util.inherits(ScorePoint, MovingObject);

ScorePoint.prototype.maxVelocity = function(xvel, yvel){
  let finalx = xvel;
  let finaly = yvel;
  if (xvel > 1.0){
    finalx = 1.0;
  }
  else if (xvel < -1.0){
    finalx = -1.0;
  }

  if (yvel > 1.0){
    finaly = 1.0;
  }
  else if (yvel < -1.0){
    finaly = -1.0;
  }
  return [finalx, finaly];
}

const NORMAL_FRAME_TIME_DELTA = 1000/60;
ScorePoint.prototype.move = function(timeDelta){
  //timeDelta is number of milliseconds since last move
  //if the computer is busy the time delta will be larger
  //in this case the MovingObject should move farther in this frame
  //velocity of object is how far it should move in 1/60th of a second

  if (this.time == 160){
    this.game.remove(this);
    return;
  }
  if (this.time == 96){
    this.color = 'green';
  }
  if (this.time == 104){
    this.color = 'yellow';
  }

  if (this.time == 140){
    this.color = 'green';
  }

  if (this.time == 150){
    this.color = 'yellow';
  }

  this.time += 1;



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

ScorePoint.prototype.collideWith = function(otherObject){
  if (otherObject instanceof Ship){
    this.game.remove(this);
    this.game.score += 1;
  }
}



module.exports = ScorePoint;
