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
