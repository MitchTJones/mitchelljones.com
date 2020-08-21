var mouseLoc = new Vector();

var planetAmount = 100;
var starAmount = 3;
var planets = []

var gFactor = 1

var sFactors = [0.9, 1.1];

var lineStrengthMax = 0.75;
var lineStrengthMin = 0.000001;

var Planet = (function () {
    function Planet(x, y, r, c, _id) {
        this.loc = new Vector(x,y);
        this.speed = new Vector(0,0);
        this.radius = r;
        this.color = c;
        this.id = _id
    }
    Planet.prototype.move = function() {
    	this.loc.add(this.speed);
    }
    Planet.prototype.addSpeed = function(_x,_y) {
        this.speed.add(_x,_y);
    }
    Planet.prototype.setSpeed = function(_x,_y) {
    	this.speed.set(_x,_y);
    }
    Planet.prototype.shiftSpeed = function(_x,_y) {
        this.speed.x = _x*this.speed.x;
        this.speed.y = _y*this.speed.y;
    }
    Planet.prototype.display = function() {
        cEllipse(this.loc, this.radius, this.color);
    }
    return Planet;
}());

var cvs, ctx;

//Initial Setup Function
function setup() {
	onResize();
	window.requestAnimationFrame(draw);
}

function onResize() {
	scaleCanvas(cvs,getWinSize());
	ctx.translate(cvs.width/2, cvs.height/2);
	initialize();
}

bare('canvas', setup, onResize);

function draw() {
	ctx.save();
	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height);
	ctx.restore()
	if (isReset) {
		isReset = false;
		reset();
	}
	for (p = 0; p < planets.length; p++) {
		for (_p = 0; _p < planets.length; _p++) {
			if (p != _p) {
				var gravity = grav(planets[p], planets[_p]).times(gFactor);
				planets[p].addSpeed(gravity);
				// var gSum = Math.abs(gravity.sum());
				// if (gSum > lineStrengthMin) {
				// 	var dif = lineStrengthMax - lineStrengthMin;
				// 	var ratio = gSum/dif;
				// 	coLine(planets[p].loc, planets[_p].loc, '#ffffff', ratio);
				// }
			}
		}
		planets[p].move();
		planets[p].display();
	}
	window.setTimeout(window.requestAnimationFrame(draw));
}

function initialize() {
	planets = []
	for (i = 0; i < starAmount; i++) {
		// Stars originate near center of canvas
		planets.push(new Planet(canvas.width/4-Math.random()*canvas.width/2, canvas.height/4-Math.random()*canvas.height/2, 50+Math.random()*30, '#ffff00', 'star'));
	}
	for (i = 0; i < planetAmount; i++) {
		// Planets originate randomly on canvas
		planets.push(new Planet(canvas.width/2-Math.random()*canvas.width, canvas.height/2-Math.random()*canvas.height, 1+Math.random()*15, '#ffffff', 'planet'));
	}
}

function reset() {
	planets = []
	initialize();
}

function coll(planet1, planet2) {
	return planet1.speed.plus(planet2.speed.times(planet2.radius)).div(planet1.radius);
}

function grav(planet1, planet2) {
	var speed = new Vector(0,0);
	if (dist(planet1.loc, planet2.loc) > 1) {	
		var d  = dist(planet1.loc, planet2.loc);				//get distance between points
		var dX = xDist(planet1.loc, planet2.loc);				//get x distance (run)
		var dY = yDist(planet1.loc, planet2.loc);				//get y distance (rise)
		var xS = -(Math.abs(dX)/dX)*(Math.sqrt(1-sq(dY/(d))));	//Pythagorean theorem-ish
		var yS = -(Math.abs(dY)/dY)*(Math.sqrt(1-sq(dX/(d))));	//''
		speed.set(xS,yS);
		speed = speed.times(sVolfromRad(planet2.radius));		//Volume of a sphere
		speed = speed.div(sVolfromRad(planet1.radius));
		speed = speed.div(sq(d));								//Inverse square law
	}
	return speed;
}

//Track mouse location
window.addEventListener('mousemove', function(e) {
	var rect = canvas.getBoundingClientRect();
	mouseLoc.set(e.clientX-rect.left, e.clientY-rect.top);
});

window.addEventListener('keypress', function(e) {
	var keyC = e.which;
	if (keyC == 45) {	//-
		ctx.scale(sFactors[0], sFactors[0]);
	}
	if (keyC == 61) {	//+
		ctx.scale(sFactors[1], sFactors[1]);
	}
	// if (keyC == 32) {	//Space
	// 	ctx.translate(planets[0].loc.x, planets[0].loc.y);
	// }
});