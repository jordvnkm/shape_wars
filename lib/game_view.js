const GameView = function (game, ctx) {
  this.ctx = ctx;
  this.game = game;
  this.ship = this.game.addShip();
  let self = this;
  $(document).on("mousemove", function(event){
    const mouseX = event.pageX;
    const mouseY = event.pageY;
    self.game.mousePos = [mouseX, mouseY];
  });
};


GameView.prototype.start = function(){
  this.lastTime = 0;
  requestAnimationFrame(this.animate.bind(this));
}

GameView.prototype.animate = function(time){
  const timeDelta = time - this.lastTime;
  this.game.step(timeDelta);
  this.game.draw(this.ctx, time);
  this.lastTIme = time;

  requestAnimationFrame(this.animate.bind(this));
}

module.exports = GameView;
