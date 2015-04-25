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
	this.maxSpeed			= 160; // максимальная скорость
	this.minSpeed			= -100; // минимальная скорость
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
	
	return {x: speed_x - this.speed.x, y: speed_y - this.speed.y};
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