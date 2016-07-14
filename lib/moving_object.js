const Game = require('./game');
const Util = require('./util');

const MovingObject = function(options){
  this.pos = options.pos;
  this.vel = options.vel;
  this.radius = options.radius
  this.shape = options.shape;
  this.color = options.color;
  this.game = options.game;

}





MovingObject.prototype.collideWith = function (otherObject) {
  // default do nothing
};

MovingObject.prototype.isCollidedWith = function(otherObject){
  const centerDist = Util.dist(this.pos, otherObject.pos);
  if (centerDist < (this.radius + otherObject.radius)){
  }
  return centerDist < (this.radius + otherObject.radius);
};

MovingObject.prototype.isWrappable = false;


MovingObject.prototype.draw = function (ctx) {
  ctx.fillStyle = this.color;

  if (this.shape == "circle") {
    ctx.beginPath();
    ctx.arc(
      this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, true
    );
    ctx.fill();
  }
  else if (this.shape == "triangle"){
    ctx.beginPath();
    ctx.moveTo(this.pos[0] + this.radius , this.pos[1] + this.radius);
    ctx.lineTo(this.pos[0] , this.pos[1] - this.radius);
    ctx.lineTo(this.pos[0] - this.radius, this.pos[1] + this.radius);
    ctx.lineTo(this.pos[0] + this.radius, this.pos[1] + this.radius);
    ctx.fill();
  }
  else if (this.shape == "rectangle"){
    ctx.beginPath();
    ctx.moveTo(this.pos[0] - this.radius, this.pos[1] - this.radius);
    ctx.lineTo(this.pos[0] + this.radius, this.pos[1] - this.radius);
    ctx.lineTo(this.pos[0] + this.radius, this.pos[1] + this.radius);
    ctx.lineTo(this.pos[0] - this.radius, this.pos[1] + this.radius);
    ctx.lineTo(this.pos[0] - this.radius, this.pos[1] - this.radius);
    // ctx.rect(this.pos[0] - this.radius, this.pos[1] - this.radius, this.radius, this.radius)
    ctx.fill();
  }
};



MovingObject.prototype.remove = function(){
  this.game.remove(this);
}


module.exports = MovingObject;
