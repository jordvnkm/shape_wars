/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const GameView = __webpack_require__(10);
	
	document.addEventListener("DOMContentLoaded", function(){
	  const canvasEl = document.getElementsByTagName("canvas")[0];
	  canvasEl.width = Game.DIM_X;
	  canvasEl.height = Game.DIM_Y;
	
	  const ctx = canvasEl.getContext("2d");
	  const game = new Game();
	  new GameView(game, ctx).start();
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// const Asteroid = require("./asteroid");
	// const Bullet = require("./bullet");
	const EngineParticle = __webpack_require__(2);
	const Ship = __webpack_require__(3);
	const Bomb = __webpack_require__(6);
	const Enemy = __webpack_require__(7);
	const Util = __webpack_require__(5);
	const Particle = __webpack_require__(8);
	const ScorePoint = __webpack_require__(9);
	
	const Game = function () {
	  this.enemies = [];
	  this.bombs = [];
	  this.ships = [];
	  this.wave = 1;
	  this.particles = []
	  this.scorePoints = [];
	  this.engineParticles = [];
	  this.score = 0;
	  this.playing = false;
	
	  this.addBombs();
	  this.addShip();
	  // this.addEnemies();
	  setInterval(this.addBombs.bind(this), 5000);
	  setInterval(this.addEnemies.bind(this), 2000);
	};
	
	Game.BG_COLOR = "green";
	Game.DIM_X = 1000;
	Game.DIM_Y = 600;
	Game.FPS = 32;
	
	Game.prototype.reset = function(){
	  this.enemies = [];
	  this.bombs = [];
	  this.ships = [];
	  this.wave = 1;
	  this.particles = []
	  this.scorePoints = [];
	  this.engineParticles = [];
	  this.score = 0;
	  this.addBombs();
	  this.addShip();
	  // this.addEnemies();
	}
	
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
	  if (this.bombs.length >= 15){
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


/***/ },
/* 2 */
/***/ function(module, exports) {

	function EngineParticle ()
	{
		this.scale = 1.0;
		this.x = 0;
		this.y = 0;
		this.radius = 20;
		this.color = '#fff';
		this.velocityX = 0;
		this.velocityY = 0;
		this.scaleSpeed = 0.5;
	
		this.update = function()
		{
			// shrinking
			this.scale -= this.scaleSpeed * 20 / 1000.0;
	
			if (this.scale <= 0)
			{
				this.scale = 0;
			}
			// moving away from explosion center
			this.x += this.velocityX * 20 /1000.0;
			this.y += this.velocityY * 20 /1000.0;
		};
	
		this.draw = function(context2D)
		{
			// translating the 2D context to the particle coordinates
			context2D.save();
			context2D.translate(this.x, this.y);
			context2D.scale(this.scale, this.scale);
	
			// drawing a filled circle in the particle's local space
			context2D.beginPath();
			context2D.arc(0, 0, this.radius, 0, Math.PI*2, true);
			context2D.closePath();
			context2D.fillStyle = this.color;
			context2D.fill();
	
			context2D.restore();
		};
	}
	
	module.exports = EngineParticle;


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(5);
	
	
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
	    const accel = Util.findVector(this.pos, [this.game.mousePos[0], this.game.mousePos[1]]);
	    const accel_maxed = this.max_accel(accel);
	    const newPos = [(this.pos[0] + accel_maxed[0]), (this.pos[1] + accel_maxed[1])];
	    const oldPos = this.pos.slice();
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


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	const Game = __webpack_require__(1);
	const Util = __webpack_require__(5);
	
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


/***/ },
/* 5 */
/***/ function(module, exports) {

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


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(5);
	const Ship = __webpack_require__(3);
	
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
	  if (xvel > 1){
	    finalx = 1;
	  }
	  else if (xvel < -1){
	    finalx = -1;
	  }
	
	  if (yvel > 1){
	    finaly = 1;
	  }
	  else if (yvel < -1){
	    finaly = -1;
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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(5);
	const Ship = __webpack_require__(3);
	
	
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


/***/ },
/* 8 */
/***/ function(module, exports) {

	function Particle ()
	{
		this.scale = 1.0;
		this.x = 0;
		this.y = 0;
		this.radius = 20;
		this.color = "#000";
		this.velocityX = 0;
		this.velocityY = 0;
		this.scaleSpeed = 0.5;
	
		this.update = function()
		{
			// shrinking
			this.scale -= this.scaleSpeed * 20 / 1000.0;
	
			if (this.scale <= 0)
			{
				this.scale = 0;
			}
			// moving away from explosion center
			this.x += this.velocityX * 20 /1000.0;
			this.y += this.velocityY * 20 /1000.0;
		};
	
		this.draw = function(context2D)
		{
			// translating the 2D context to the particle coordinates
			context2D.save();
			context2D.translate(this.x, this.y);
			context2D.scale(this.scale, this.scale);
	
			// drawing a filled circle in the particle's local space
			context2D.beginPath();
			context2D.arc(0, 0, this.radius, 0, Math.PI*2, true);
			context2D.closePath();
	
			context2D.fillStyle = this.color;
			context2D.fill();
	
			context2D.restore();
		};
	}
	
	module.exports = Particle;


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	const MovingObject = __webpack_require__(4);
	const Util = __webpack_require__(5);
	const Ship = __webpack_require__(3);
	
	
	const ScorePoint = function(options){
	  options.radius = ScorePoint.RADIUS;
	  options.color = '#66ff33';
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
	    this.color = 'white';
	  }
	  if (this.time == 104){
	    this.color = '#66ff33';
	  }
	
	  if (this.time == 140){
	    this.color = 'white';
	  }
	
	  if (this.time == 150){
	    this.color = '#66ff33';
	  }
	
	  this.time += 1;
	
	
	
	  const velocityScale = timeDelta / NORMAL_FRAME_TIME_DELTA,
	      offsetX = this.vel[0] * velocityScale,
	      offsetY = this.vel[1] * velocityScale;
	
	  const maxVel = this.maxVelocity(offsetX, offsetY)
	
	  const distToShip = Util.dist(this.pos, this.game.ships[0].pos);
	  if (distToShip < 100){
	    let impulse = Util.findVector(this.pos, this.game.ships[0].pos);
	    let maxImpulse = Util.dir(impulse);
	    let newVel = [this.vel[0] + maxImpulse[0], this.vel[1] + maxImpulse[1]];
	    let maxVel = this.maxVelocity(newVel[0], newVel[1]);
	    this.vel = maxVel;
	    this.pos = [this.pos[0] + this.vel[0] , this.pos[1] + this.vel[1]];
	    return;
	  }
	
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


/***/ },
/* 10 */
/***/ function(module, exports) {

	const GameView = function (game, ctx) {
	  this.ctx = ctx;
	  this.game = game;
	  // this.ship = this.game.addShip();
	  let self = this;
	  $(document).on("mousemove", function(event){
	    const mouseX = event.offsetX;
	    const mouseY = event.offsetY;
	    self.game.mousePos = [mouseX, mouseY];
	  });
	
	  $('#startButton').on('click', function(event){
	    self.game.playing = true;
	    self.game.mousePos = [event.pageX, event.pageY];
	    $('#startModal').css("visibility", "hidden");
	  })
	
	  $('#reset').css("visibility","hidden");
	
	  $('#restartButton').on('click', function(event){
	    self.game.reset();
	    self.game.playing = true;
	    self.game.mousePos = [event.pageX, event.pageY];
	    $('#reset').css("visibility", "hidden");
	  })
	};
	
	
	GameView.prototype.start = function(){
	  this.lastTime = 0;
	  requestAnimationFrame(this.animate.bind(this));
	}
	
	GameView.prototype.animate = function(time){
	  if (this.game.playing){
	    const timeDelta = time - this.lastTime;
	    this.game.step(timeDelta);
	    this.game.draw(this.ctx, time);
	    this.lastTIme = time;
	
	  }
	  requestAnimationFrame(this.animate.bind(this));
	}
	
	module.exports = GameView;


/***/ }
/******/ ]);
//# sourceMappingURL=bundle.js.map