Track = function(width, position, color) {
	this.width 		= width || 300;
	this.position 	= position || {x: 0, y: 0};
	this.color 		= color || '#000';
};

Track.prototype.draw = function(ctx) {
	var ctx = ctx || window.ctx;
	ctx.restore();
	ctx.setTransform(1,0,0,1,0,0);
	ctx.strokeStyle = this.color;
	ctx.lineWidth = 6;
	ctx.beginPath();
	ctx.strokeStyle 	= '#fff';
	ctx.fillRect(0, 0, ctx.width, ctx.height);
	ctx.strokeRect(0, 0, ctx.width, ctx.height);
	ctx.strokeStyle 	= '#000';
	ctx.beginPath();
	ctx.arc((this.position.x + canvas.width / 2) - 750, this.position.y + canvas.height / 2, 600 + this.width, 0, Math.PI * 2, false);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc((this.position.x + canvas.width / 2) - 750, this.position.y + canvas.height / 2, 600, 0, Math.PI * 2, false);	
	ctx.stroke();
	ctx.closePath();	
};