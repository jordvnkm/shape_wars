const GameView = function (game, ctx) {
  this.ctx = ctx;
  this.game = game;
  // this.ship = this.game.addShip();
  let self = this;
  $("#mouseArea").on("mousemove", function(event){
    const mouseX = event.pageX;
    const mouseY = event.pageY;
    self.game.mousePos = [mouseX, mouseY];
  });

  $(document).on('click', function(event){
    console.log(event);
  })

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
