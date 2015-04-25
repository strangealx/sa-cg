HitMap = function(track) {
	this.track	= track || window.track;
	this.canvas_substrate 			= document.createElement('canvas');
	this.canvas_substrate.width 	= canvas.width;
	this.canvas_substrate.height 	= canvas.height;
	this.ctx_substrate 				= this.canvas_substrate.getContext('2d');
};

HitMap.prototype = {
	draw: function() {
		this.ctx_substrate.beginPath();
		this.ctx_substrate.strokeStyle 	= '#000';
		this.ctx_substrate.fillRect(0, 0, this.canvas_substrate.width, this.canvas_substrate.height);
		this.ctx_substrate.strokeRect(0, 0, this.canvas_substrate.width, this.canvas_substrate.height);
		this.ctx_substrate.strokeStyle 	= '#fff';
		this.ctx_substrate.beginPath();
		this.ctx_substrate.lineWidth = this.track.width;
		this.ctx_substrate.lineWidth = this.track.width;
		this.ctx_substrate.arc((this.track.position.x + this.canvas_substrate.width / 2) - 750, this.track.position.y + this.canvas_substrate.height / 2, 600 + this.track.width / 2, 0, Math.PI * 2, false);
		this.ctx_substrate.stroke();
		this.ctx_substrate.closePath();
	},
	clear: function() {
		this.ctx_substrate.clearRect(0, 0, this.canvas_substrate.width, this.canvas_substrate.height);		
	},
	isHit: function(points_array) {
		var pixel;
		for (var i = 0; i < points_array.length; i++) {
			pixel = this.ctx_substrate.getImageData(points_array[i][0], points_array[i][1], 1, 1);
			if (pixel.data[0] == 0 && pixel.data[1] == 0 && pixel.data[2] == 0) {
				console.log('hit');
			}
		}
	}
};