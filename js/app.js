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

window.onload = function(event) {
	canvas 	= document.getElementById('canvas');
	canvas.setAttribute('width', window.innerWidth + 'px');
	canvas.setAttribute('height', window.innerHeight + 'px');
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
			update(player, {
				'speed': {
					x: player.getSpeed().x,
					y: player.getSpeed().y
				}	
			});
			update(track, {
				'position': {
					x: -player.speed.x / 10 * Math.sin(player.angle.inRad()),
					y: player.speed.y / 10 * Math.cos(player.angle.inRad())
				}	
			});
		} else if (KEY_STATE['down']) {
			player.direction = -1;
			update(player, {
				'speed': {
					x: player.getSpeed().x,
					y: player.getSpeed().y
				}	
			});
			update(track, {
				'position': {
					x: -player.speed.x / 10 * Math.sin(player.angle.inRad()),
					y: player.speed.y / 10 * Math.cos(player.angle.inRad())
				}	
			});
		} else {
			player.direction = 0;
			update(player, {
				'speed': {
					x: player.getSpeed().x,
					y: player.getSpeed().y
				}	
			});
			update(track, {
				'position': {
					x: -player.speed.x / 10 * Math.sin(player.angle.inRad()),
					y: player.speed.y / 10 * Math.cos(player.angle.inRad())
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
};

window.onresize = function(event) {
    canvas.setAttribute('width', window.innerWidth + 'px');
	canvas.setAttribute('height', window.innerHeight + 'px');
	hitMap.canvas_substrate.width 	= canvas.width;
	hitMap.canvas_substrate.height 	= canvas.height;
};