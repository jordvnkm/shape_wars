// const Asteroid = require("./asteroid");
// const Bullet = require("./bullet");
const EngineParticle = require("./engine_particle");
const Ship = require("./ship");
const Bomb = require("./bomb");
const Enemy = require("./enemy");
const Util = require("./util");
const Particle = require("./particle");
const ScorePoint = require("./score_point");

const Game = function () {
  this.enemies = [];
  this.bombs = [];
  this.ships = [];
  this.wave = 1;
  this.particles = []
  this.scorePoints = [];
  this.engineParticles = [];
  this.score = 0;

  this.addBombs();
  // this.addShip();
  this.addEnemies();
  setInterval(this.addBombs.bind(this), 5000);
  setInterval(this.addEnemies.bind(this), 2000);
};

Game.BG_COLOR = "green";
Game.DIM_X = 1000;
Game.DIM_Y = 600;
Game.FPS = 32;

Game.prototype.add = function (object) {

  if (object instanceof Ship){
    this.ships.push(object);
  }
  else if (object instanceof Bomb){
    this.bombs.push(object);
  }
  else if (object instanceof Enemy){
    this.enemies.push(object);
  }
  else {
    throw "wtf";
  }
  // if (object instanceof Asteroid) {
  //   this.asteroids.push(object);
  // } else if (object instanceof Bullet) {
  //   this.bullets.push(object);
  // } else if (object instanceof Ship) {
  //   this.ships.push(object);
  // } else {
  //   throw "wtf?";
  // }
};

Game.prototype.addBombs = function () {
  if (this.bombs.length >= 20){
    return;
  }
  let amount = this.bombs.length / 2;
  if (amount < 5){
    amount = 4;
  }
  for (let i = 0; i < amount; i ++){
    this.add(new Bomb({game: this}));
  }
  // for (var i = 0; i < Game.NUM_ASTEROIDS; i++) {
  //   this.add(new Asteroid({ game: this }));
  // }
};

Game.prototype.randomInSection = function(section){
  let xcoord;
  let ycoord;
  if (section == 0){
    xcoord = Util.randomInRange(1,150);
    ycoord = Util.randomInRange(1,150);
  }
  else if (section == 1){
    xcoord = Util.randomInRange(Game.DIM_X - 150, Game.DIM_X);
    ycoord = Util.randomInRange(1, 150);
  }
  else if (section == 2){
    xcoord = Util.randomInRange(Game.DIM_X - 150, Game.DIM_X);
    ycoord = Util.randomInRange(Game.DIM_Y - 150, Game.DIM_Y);
  }
  else {
    xcoord = Util.randomInRange(1,150);
    ycoord = Util.randomInRange(Game.DIM_Y - 150, Game.DIM_Y);
  }
  return [xcoord, ycoord];
}


Game.prototype.addEnemies = function(){
  let amount = this.wave * 4
  if (amount > 40){
    amount = 40;
  }
  for (let i = 0 ; i < amount / 2; i ++){
    let position = this.randomInSection(this.wave % 4);
    this.add(new Enemy({game: this, pos: position}));
  }

  for (let i = 0; i < amount / 2; i ++){
    let position = this.randomInSection((this.wave + 2) % 4);
    this.add(new Enemy({game: this, pos: position}));
  }
  this.wave += 1;
}

Game.prototype.addShip = function () {
  const ship = new Ship({
    pos: this.middlePosition(),
    game: this
  });


  this.add(ship);

  return ship;
};


Game.prototype.checkCollisions = function () {
  const allObjects = this.allObjects();
  for (let i = 0; i < allObjects.length; i++) {
    for (let j = 0; j < allObjects.length; j++) {
      const obj1 = allObjects[i];
      const obj2 = allObjects[j];

      if (obj1.isCollidedWith(obj2)) {
        const collision = obj1.collideWith(obj2);
        if (collision) return;
      }
    }
  }
};

Game.prototype.createEngineParticles = function(x, y, color){
  var minSize = 2;
  var maxSize = 5;
  var count = 10;
  var minSpeed = 60.0;
  var maxSpeed = 200.0;
  var minScaleSpeed = 1.0;
  var maxScaleSpeed = 4.0;

  for (var angle=0; angle<360; angle += Math.round(360/count))
  {
    var particle = new EngineParticle();

    particle.x = x;
    particle.y = y;

    particle.radius = Util.randomFloat(minSize, maxSize);

    particle.color = color;

    particle.scaleSpeed = Util.randomFloat(minScaleSpeed, maxScaleSpeed);

    var speed = Util.randomFloat(minSpeed, maxSpeed);

    particle.velocityX = speed / 5 * Math.cos(angle * Math.PI / 180.0);
    particle.velocityY = speed / 5 * Math.sin(angle * Math.PI / 180.0);

    this.engineParticles.push(particle);
  }
};


Game.prototype.createExplosion = function(x, y, color){
	var minSize = 20;
	var maxSize = 50;
	var count = 10;
	var minSpeed = 60.0;
	var maxSpeed = 200.0;
	var minScaleSpeed = 1.0;
	var maxScaleSpeed = 4.0;

	for (var angle=0; angle<360; angle += Math.round(360/count))
	{
		var particle = new Particle();

		particle.x = x;
		particle.y = y;

		particle.radius = Util.randomFloat(minSize, maxSize);

		particle.color = color;

		particle.scaleSpeed = Util.randomFloat(minScaleSpeed, maxScaleSpeed);

		var speed = Util.randomFloat(minSpeed, maxSpeed);

		particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
		particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

		this.particles.push(particle);
	}
};



Game.prototype.middlePosition = function(){
  return [(Game.DIM_X / 2), (Game.DIM_Y / 2)];
};

Game.prototype.allObjects = function () {
  return [].concat(this.ships, this.bombs, this.enemies, this.scorePoints);
  // return [].concat(this.ships, this.asteroids, this.bullets);
};

Game.prototype.draw = function (ctx, delay) {
  ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
  // ctx.fillStyle = Game.BG_COLOR;
  // ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

  this.allObjects().forEach((object) => {
    object.draw(ctx);
  });

  let particleRemove = [];
  let engineRemove = [];

  for (let i=0; i<this.particles.length; i++)
  {
    let particle = this.particles[i];

    if (particle.scale == 0){
      particleRemove.push(particle);
    }
    else {
      particle.update();
      particle.draw(ctx);
    }
  }

  for (let i=0; i<this.engineParticles.length; i++)
  {
    let particle = this.engineParticles[i];

    if (particle.scale == 0){
      engineRemove.push(particle);
    }
    else {
      particle.update();
      particle.draw(ctx);
    }
  }

  engineRemove.forEach((particle) => {
    this.remove(particle);
  })



  particleRemove.forEach((particle) => {
    this.remove(particle);
  })



  ctx.font = "16px Arial";
  ctx.fillStyle = "yellow";
  ctx.fillText("Score: "+ this.score, 8, 20);
};


Game.prototype.isOutOfBounds = function (pos) {
  return (pos[0] < 0) || (pos[1] < 0) ||
    (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
};


Game.prototype.moveObjects = function (delta) {
  this.allObjects().forEach((object) => {

    if (object instanceof Ship){
      this.createEngineParticles(object.pos[0], object.pos[1], "white");
    }

    object.move(delta);
  });
};

Game.prototype.randomPosition = function () {
  return [
    Game.DIM_X * Math.random(),
    Game.DIM_Y * Math.random()
  ];
};

Game.prototype.remove = function (object) {
  if (object instanceof Ship){
    this.ships.splice(this.ships.indexOf(object), 1);
  }
  else if (object instanceof Bomb){
    this.bombs.splice(this.bombs.indexOf(object), 1);
  }
  else if (object instanceof Enemy){
    this.enemies.splice(this.enemies.indexOf(object), 1);
  }
  else if (object instanceof Particle){
    this.particles.splice(this.particles.indexOf(object), 1);
  }
  else if (object instanceof ScorePoint){
    this.scorePoints.splice(this.scorePoints.indexOf(object), 1);
  }
  else if (object instanceof EngineParticle){
    this.engineParticles.splice(this.engineParticles.indexOf(object), 1);
  }
  else {
    throw "WTF";
  }
  // if (object instanceof Bullet) {
  //   this.bullets.splice(this.bullets.indexOf(object), 1);
  // } else if (object instanceof Asteroid) {
  //   this.asteroids.splice(this.asteroids.indexOf(object), 1);
  // } else if (object instanceof Ship) {
  //   this.ships.splice(this.ships.indexOf(object), 1);
  // } else {
  //   throw "wtf?";
  // }
};

Game.prototype.removeInRadius = function(position){
  let radius = 125;
  // this.allObjects().forEach((obj) => {
  //   if (obj instanceof Ship){
  //     continue;
  //   }
  //   if (obj.pos[0] < (position[0] + radius) && obj.pos[0] > (position[0] - radius)){
  //     if (obj.pos[1] < (position[1] + radius) && obj.pos[1] > (position[1] - radius)){
  //       this.remove(obj);
  //     }
  //   }
  // })

  let objects = this.allObjects();
  let removeList = [];
  for (let i = 0 ; i < objects.length; i++){
    let obj = objects[i];
    if (obj instanceof Ship || obj instanceof Bomb || obj instanceof EngineParticle){
      continue;
    }
    let dist = Util.dist(position, obj.pos);
    if (dist <= radius){
      removeList.push(obj);
    }
    // if (obj.pos[0] < (position[0] + radius) && obj.pos[0] > (position[0] - radius)){
    //   if (obj.pos[1] < (position[1] + radius) && obj.pos[1] > (position[1] - radius)){
    //     removeList.push(obj);
    //   }
    // }
  }


  removeList.forEach((obj) => {
    let point = new ScorePoint({game: this, pos: obj.pos})
    this.scorePoints.push(point);
    this.remove(obj);
  })
}

Game.prototype.explode = function(bomb){
  this.removeInRadius(bomb.pos);
  this.createExplosion(bomb.pos[0], bomb.pos[1], "#FFA318");
  this.createExplosion(bomb.pos[0], bomb.pos[1], "#525252");
  this.remove(bomb);

}

Game.prototype.step = function (delta) {
  this.moveObjects(delta);
  this.checkCollisions();
};

Game.prototype.wrap = function (pos) {
  return [
    Util.wrap(pos[0], Game.DIM_X), Util.wrap(pos[1], Game.DIM_Y)
  ];
};

module.exports = Game;
