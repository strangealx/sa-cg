// Переменные
var canvas,
	ctx, 
	player, 
	track;

// Константы
// Клавиши
KEY_VALUE = {
	87: 'up',
	83: 'down',
	65: 'left',
	68: 'right'
};
// Состояния клавиш
KEY_STATE = {
	keyPressed: false
};
for (value in KEY_VALUE) {
	KEY_STATE[KEY_VALUE[value]] = false;
}
// События клавиш

window.onkeydown = function(e) {
	if (KEY_VALUE[e.which]) {
		KEY_STATE.keyPressed 			= true;
		KEY_STATE[KEY_VALUE[e.which]] 	= true;
		e.preventDefault();
	}
};

window.onkeyup = function(e) {
	if (KEY_VALUE[e.which]) {
		KEY_STATE.keyPressed 			= false;
		KEY_STATE[KEY_VALUE[e.which]] 	= false;
		e.preventDefault();
	}
};

// новый метод Number inRad - переводит градусы в радианы

Object.defineProperty(Number.prototype, 'inRad', {
	enumerable: 	false,
	configurable: 	false,
	writable: 		false,
	value: 			function() {
		var value = this.valueOf();
		value = value - (Math.floor(value/360))*360;
		return value / 180 * Math.PI;
	}
});

Track = function(width, position, color) {
	this.width 		= width || 300;
	this.position 	= position || {x: canvas.width / 2, y: canvas.height / 2};
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
	ctx.arc(this.position.x - 750, this.position.y, 600 + this.width, 0, Math.PI * 2, false);
	ctx.stroke();
	ctx.beginPath();
	ctx.arc(this.position.x - 750, this.position.y, 600, 0, Math.PI * 2, false);	
	ctx.stroke();
	ctx.closePath();	
};

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
		this.ctx_substrate.arc(this.track.position.x - 750, this.track.position.y, 600 + this.track.width / 2, 0, Math.PI * 2, false);
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
				//console.log('hit');
			}
		}
	}
};

Car = function(color, position, number, angle) {
	this.position			= position 	|| {x: 0, y: 0}; // координаты
	this.color 				= color; // цвет
	this.number				= number 	|| 1; // номер
	this.angle				= angle 	|| 0; // угол поворота (в градусах)
	this.speed				= {	// вектор скорости							
		x: 0,
		y: 0
	};
	this.acc				= 2; // ускорение
	this.maxSpeed			= 120; // максимальная скорость
	this.minSpeed			= -80; // минимальная скорость
	this.direction 			= 0; // 0 - без движения, 1 - вперед, -1 - назад
};

Car.prototype.getCollisionPoints = function() {
	return [
		[canvas.width / 2 + 20, canvas.height / 2 + 45],
		[canvas.width / 2, Math.floor((canvas.height / 2 + 45 + canvas.height / 2 + 48) / 2)],
		[canvas.width / 2 - 20, canvas.height / 2 + 45],
	];
};

Car.prototype.getSpeed = function() {
	var speed_x = this.speed.x,
		speed_y = this.speed.y;
	if (speed_x > 0 && speed_y > 0) {
		speed_x -= this.acc;
		speed_y -= this.acc;
	} else if (speed_x < 0 && speed_y < 0) {
		speed_x += this.acc;
		speed_y += this.acc;
	}
	speed_x = speed_x + this.acc * 2 * this.direction;
	speed_y = speed_y + this.acc * 2 * this.direction;
	if (this.direction > 0) {
		speed_x = Math.min(speed_x, this.maxSpeed);
		speed_y = Math.min(speed_y, this.maxSpeed);
	} else if (this.direction < 0) {
		speed_x = Math.max(speed_x, this.minSpeed);
		speed_y = Math.max(speed_y, this.minSpeed);
	}
	this.speed.x = speed_x;
	this.speed.y = speed_y;
	return {x: this.speed.x / 10, y: this.speed.y / 10};
};

Car.prototype.draw = function() {
	ctx.strokeStyle 	= '#000';
	ctx.lineWidth 		= 1;
	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.rotate(this.angle.inRad());
	ctx.moveTo(this.position.x - 20, this.position.y + 45);
	ctx.save();
	// Контур машинки		
	ctx.beginPath();
    ctx.moveTo(this.position.x - 20, this.position.y + 45);
    ctx.quadraticCurveTo(this.position.x, this.position.y + 48, this.position.x + 20, this.position.y + 45);
    ctx.quadraticCurveTo(this.position.x + 25, this.position.y + 45, this.position.x + 25, this.position.y + 35);
    ctx.quadraticCurveTo(this.position.x + 30, this.position.y + 35, this.position.x + 30, this.position.y + 25);
    ctx.quadraticCurveTo(this.position.x + 30, this.position.y + 15, this.position.x + 25, this.position.y + 15);
    ctx.quadraticCurveTo(this.position.x + 22, this.position.y, this.position.x + 25, this.position.y - 15);
	ctx.quadraticCurveTo(this.position.x + 30, this.position.y - 15, this.position.x + 30, this.position.y - 25);
    ctx.quadraticCurveTo(this.position.x + 30, this.position.y - 35, this.position.x + 25, this.position.y - 35);
    ctx.quadraticCurveTo(this.position.x + 25, this.position.y - 45, this.position.x + 20, this.position.y - 45);
	ctx.quadraticCurveTo(this.position.x, this.position.y - 47, this.position.x - 20, this.position.y - 45);
	ctx.quadraticCurveTo(this.position.x - 25, this.position.y - 45, this.position.x - 25, this.position.y - 35);
	ctx.quadraticCurveTo(this.position.x - 30, this.position.y - 35, this.position.x - 30, this.position.y - 25);
	ctx.quadraticCurveTo(this.position.x - 30, this.position.y - 15, this.position.x - 25, this.position.y - 15);
	ctx.quadraticCurveTo(this.position.x - 22, this.position.y, this.position.x - 25, this.position.y + 15);
	ctx.quadraticCurveTo(this.position.x - 30, this.position.y + 15, this.position.x - 30, this.position.y + 25);
	ctx.quadraticCurveTo(this.position.x - 30, this.position.y + 35, this.position.x - 25, this.position.y + 35);
	ctx.quadraticCurveTo(this.position.x - 25, this.position.y + 45, this.position.x - 20, this.position.y + 45);
	ctx.closePath();
	// Красим машинку
	var ctxColor = ctx.createRadialGradient(this.position.x, this.position.y + 20, 0, this.position.x, this.position.y + 20, 35);
	ctxColor.addColorStop(0.0, this.color.gradientStart);
	ctxColor.addColorStop(0.5, this.color.gradientEnd);
	ctxColor.addColorStop(1.0, this.color.gradientStart);
	ctx.fillStyle = ctxColor;
	ctx.fill();
    ctx.stroke();
    // Номер машинки
    ctx.restore();
    ctx.moveTo(this.position.x, this.position.y + 25);
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y + 20, 10, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fillStyle = '#FFFDFF';
    ctx.fill();
    ctx.fillStyle = '#000';
    ctx.font = "14px Bad Script";
    ctx.fillText(this.number, this.position.x - 4, this.position.y + 24);
    // Заднее стекло
    ctx.restore();
	ctx.beginPath();
	ctx.moveTo(this.position.x - 15, this.position.y + 35);    	
    ctx.quadraticCurveTo(this.position.x, this.position.y + 40, this.position.x + 15, this.position.y + 35);
    ctx.lineTo(this.position.x + 15, this.position.y + 37);
    ctx.quadraticCurveTo(this.position.x, this.position.y + 42, this.position.x - 15, this.position.y + 37);
    ctx.lineTo(this.position.x - 15, this.position.y + 35);
    ctx.closePath();
    ctx.fillStyle = "#A4A9BA";
	ctx.fill();
    ctx.stroke();
    // Лобовое
    ctx.restore();
	ctx.beginPath();
	ctx.moveTo(this.position.x - 15, this.position.y + 5); 
	ctx.quadraticCurveTo(this.position.x, this.position.y, this.position.x + 15, this.position.y + 5);
	ctx.lineTo(this.position.x + 17, this.position.y - 7);
	ctx.quadraticCurveTo(this.position.x, this.position.y - 12, this.position.x - 17, this.position.y - 7);
	ctx.closePath();
	var ctxWindowColor = ctx.createRadialGradient(this.position.x, this.position.y + 5, 0, this.position.x, this.position.y - 7, 32);
	ctxWindowColor.addColorStop(0.0,'#DBE2F5');
	ctxWindowColor.addColorStop(1.0,'#676A81');
	ctx.fillStyle = ctxWindowColor;
	ctx.fill();
	ctx.stroke();
	// Капот
	ctx.restore();
	ctx.beginPath();
    ctx.moveTo(this.position.x - 13, this.position.y - 45); 
    ctx.lineTo(this.position.x - 13, this.position.y - 15);
    ctx.lineTo(this.position.x + 13, this.position.y - 15);
    ctx.lineTo(this.position.x + 13, this.position.y - 45);
    ctx.lineJoin = "round";
    ctx.lineWidth = 2;
    ctx.strokeStyle = this.color.shadows;
    ctx.stroke();
    
    ctx.restore();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    
   	ctx.beginPath();
   	ctx.strokeRect(this.position.x - 10, this.position.y - 43, 0, 24);
   	
   	ctx.beginPath();
   	ctx.strokeRect(this.position.x + 10, this.position.y - 43, 0, 24);
};

function update(el, attribs) {
	for (var attr in attribs) {
		if (el[attr].constructor.name == 'Object') {
			for (var attr_ in el[attr]) {
				el[attr][attr_] += attribs[attr][attr_];
				continue;
			}
		} else {
			el[attr] += attribs[attr];
		}
	}
}

$(window).load(function() {
	$('#canvas')
		.attr('width', $(window).width())
		.attr('height', $(window).height());	
	canvas 	= document.getElementById('canvas');
	ctx 	= canvas.getContext('2d');	
	player 	= new Car(
		{
			gradientStart: "rgb(0, 65, 139)", 
			gradientEnd: "rgb(0, 31, 109)", 
			shadows: "rgb(0, 35, 114)"
		}
	);
	track = new Track(300);
	hitMap = new HitMap();
	track.draw();
	hitMap.draw();
	player.draw();
	
	player.interval = setInterval(function() {
		if (KEY_STATE['up']) {
			player.direction = 1;
			update(track, {
				'position': {
					y: player.getSpeed().y * Math.cos(player.angle.inRad()),
					x: -player.getSpeed().x * Math.sin(player.angle.inRad())
				}	
			});
		} else if (KEY_STATE['down']) {
			player.direction = -1;
			update(track, {
				'position': {
					y: player.getSpeed().y * Math.cos(player.angle.inRad()),
					x: -player.getSpeed().x * Math.sin(player.angle.inRad())
				}	
			});
		} else {
			player.direction = 0;
			update(track, {
				'position': {
					y: player.getSpeed().y * Math.cos(player.angle.inRad()),
					x: -player.getSpeed().x * Math.sin(player.angle.inRad())
				}
			});
		}
		
		if (KEY_STATE['right']) {
			update(player, {'angle': 3});
		} else if (KEY_STATE['left']) {
			update(player, {'angle': -3});
		}
		ctx.setTransform(1,0,0,1,0,0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		hitMap.clear();
		track.draw();
		hitMap.draw();
		player.draw();
		hitMap.isHit(player.getCollisionPoints());
	}, 1000 / 30);
});