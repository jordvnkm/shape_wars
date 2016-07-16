const MovingObject = require("./moving_object");
const Util = require("./util");


const Ship = function(options){
  options.radius = Ship.RADIUS;
  options.vel = options.vel || [0,0];
  options.color = "white";
  options.shape = "circle";

  MovingObject.call(this, options);
}

Ship.RADIUS = 15;

Util.inherits(Ship, MovingObject);

// Ship.prototype.power = function(impulse) {
//   this.vel[0] += impulse[0];
//   this.vel[1] += impulse[1];
// }


Ship.prototype.max_accel = function(accel){
  if (accel[0] > 20){
    accel[0] = 20;
  }
  else if (accel[0] < -20){
    accel[0] = -20;
  }
  if (accel[1] > 20){
    accel[1] = 20
  }
  else if (accel[1] < -20){
    accel[1] = -20;
  }
  return accel;
}

Ship.prototype.move = function(){
  const mouseX = this.pos[0];
  const mouseY = this.pos[1];
  if (this.game.mousePos){
    let accel = Util.findVector(this.pos, [this.game.mousePos[0], this.game.mousePos[1]]);
    // if (this.game.mousePos[0] < 0 || this.game.mousePos[0] > 1000 || this.game.mousePos[1] <= 0 || this.game.mousePos[1] > 600){
    //   console.log(this.game.mousePos[1]);
    //   accel = Util.findVector(this.pos, [this.game.mousePos[0] - 100, this.game.mousePos[1] - 100]);
    // }
    // else if (this.game.mousePos[1] <= 50){
    //   console.log("HELLO WORLD");
    // }
    let accel_maxed = this.max_accel(accel);
    let newPos = [(this.pos[0] + accel_maxed[0]), (this.pos[1] + accel_maxed[1])];
    let oldPos = this.pos.slice();
    if (this.game.isOutOfBounds(newPos)){
      if (newPos[0] <= 0 || newPos[0] >= 1000){
        accel_maxed[0] = 0;
      }
      if (newPos[1] <= 0 || newPos[1] >= 600){
        accel_maxed[1] = 0;
      }
      this.pos = oldPos;
    }
    this.pos = [(this.pos[0] + accel_maxed[0]), (this.pos[1] + accel_maxed[1])];
  }
}


module.exports = Ship;
