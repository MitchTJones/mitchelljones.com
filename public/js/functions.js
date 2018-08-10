var colors = {white:'#FFFFFF', grey:'#808080', black:'#000000', red:'#FF0000', green:'#00FF00', blue:'#0000FE', yellow:'#FFFF00', aqua:'#00FFFF', pink:'#FFC0CB', purple:'#800080', orange:'#FFA500', silver:'#C0C0C0'};

var Vector = (function () {
	function Vector(i1, i2) {
		if (typeof i1 == 'object') {
			this.x = i1.x;
			this.y = i1.y;
		} else {
			this.x = i1;
			this.y = i2;
		}
	};
	Vector.prototype.set = function(i1, i2) {
		if (typeof i1 == 'object') {
			this.x = i1.x;
			this.y = i1.y;
		} else {
			this.x = i1;
			this.y = i2;
		}
		return this;
	};
	Vector.prototype.add = function(input) {
		if (typeof input == 'object') {
			this.x = this.x+input.x;
			this.y = this.y+input.y;
		} else {
			this.x = this.x+input;
			this.y = this.y+input;
		}
		return this;
	};
	Vector.prototype.mult = function(input) {
		if (typeof input == 'object') {
			this.x = this.x*input.x;
			this.y = this.y*input.y;
		} else {
			this.x = this.x*input;
			this.y = this.y*input;
		}
		return this;
	};
	Vector.prototype.plus = function(input) {
		if (typeof input == 'object')
			return new Vector(this.x+input.x,this.y+input.y);
		else
			return new Vector(this.x+input,this.y+input);
	};
	Vector.prototype.div = function(input) {
		if (typeof input == 'object')
			return new Vector(this.x/input.x,this.y/input.y);
		else
			return new Vector(this.x/input,this.y/input);
	};
	Vector.prototype.times= function(input) {
		if (typeof input == 'object')
			return new Vector(this.x*input.x,this.y*input.y);
		else
			return new Vector(this.x*input,this.y*input);
	};
	Vector.prototype.print = function() {
		return "("+this.x+", "+this.y+")";
	};
	Vector.prototype.equalTo = function(v) {
		return this.x == v.x && this.y == v.y;
	}
	Vector.prototype.clone = function() {
		return new Vector(this.x, this.y);
	}
	Vector.prototype.heading = function() {
		return Math.atan2(this.y, this.x);
	}
	Vector.prototype.pyth = function() {
		return sqrt(sq(this.x)+sq(this.y));
	}
	Vector.prototype.sum = function() {
		return this.x+this.y;
	}
	return Vector;
}());

function bare(id, setup, onResize) {
	if (typeof onResize == 'undefined')
		onResize = setup;
	getCanvas(id);
	setup();
	window.onresize = function() {
		onResize();
	}
}

function custom(id, setup, onResize) {
	if (typeof onResize == 'undefined')
		onResize = setup;
	var c = document.getElementById(id);
	var o = {cvs:c, ctx:c.getContext('2d')};
	parentScale(o.cvs);
	setup(o.cvs, o.ctx);
	$(window).resize(function() {
		parentScale(o.cvs);
		onResize(o.cvs,o.ctx);
	});
}

function init(id, setup, tick, onResize) {
	if (typeof onResize == 'undefined')
		onResize = setup;
	var c = document.getElementById(id);
	var o = {cvs:c, ctx:c.getContext('2d')};
	parentScale(o.cvs);
	setup(o.cvs, o.ctx);
	anim(tick, o.cvs, o.ctx);
	$(window).resize(function() {
		parentScale(o.cvs);
		onResize(o.cvs,o.ctx);
	});
}

function anim(func, cvs, ctx) {
	window.requestAnimationFrame(function() {
		ctx.clearRect(0,0,cvs.width,cvs.height);
		func();
		anim(func, cvs, ctx);
	});
}

function getCanvas(id) {
	cvs = document.getElementById(id);
	ctx = cvs.getContext('2d');
}

function properScale(cvs) {
	scaleCanvas(cvs, {x:cvs.clientWidth,y:cvs.clientHeight});
}

function parentScale(cvs) {
	var parent = cvs.parentElement;
	scaleCanvas(cvs, {x:parent.clientWidth,y:parent.clientHeight});
}

function rgbToHex(rgb) {
	return "#" + componentToHex(rgb.r) + componentToHex(rgb.g) + componentToHex(rgb.b);
}

function componentToHex(c) {
	if (c < 0)
		c = 0;
	var hex = c.toString(16);
	return hex.length == 1 ? "0" + hex : hex;
}

function gradients(hexes, f) {
	var mF = f*(hexes.length-1);
	var lI = Math.floor(mF);
	var uI = lI+1;
	var lC = hexes[lI];
	if (uI == hexes.length)
		var uI = lI;
	var uC = hexes[uI];
	return gradient(hexToRgb(lC),hexToRgb(uC),mF-lI);
}

function gradient(c1, c2, l) {
	return {r:Math.floor(degree(c1.r, c2.r, l)), g:Math.floor(degree(c1.g, c2.g, l)), b:Math.floor(degree(c1.b, c2.b, l))};
}

function hexToRgb(hex) {
	var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	} : null;
}

function sign(input) {
	if (input < 0) {
		return -1;
	} else {
		return 1;
	}
}

function diff(n1, n2) {
	return Math.abs(n1-n2);
}

function vel(o,n) {
	return new Vector(n.x-o.x,n.y-o.y);
}

function angle(c,n) {
	var dx = n.x-c.x;
	var dy = n.y-c.y;
	return Math.atan2(dy,dx);
}

function velToPoint(c,n,f) {
	var a = angle(c,n);
	if (dist(c,n) > 0)
		return new Vector(f*Math.cos(a),f*Math.sin(a));
	else
		return new Vector(0,0);
}

function triangle(loc1, loc2, loc3) {
	ctx.beginPath();
	ctx.lineTo(loc1.x, loc1.y);
	ctx.lineTo(loc2.x, loc2.y);
	ctx.lineTo(loc3.x, loc3.y);
	ctx.closePath();
}

function cTriangle(loc1, loc2, loc3, color) {
	triangle(loc1, loc2, loc3);
	ctx.fillStyle = color;
	ctx.fill();
}

function ellipse(location, radius) {
	ctx.beginPath();
	ctx.strokeWidth="2";
	ctx.arc(location.x, location.y, radius, 0, 2*Math.PI);
	ctx.fill();
}

function cEllipse(location, radius, color) {
	var pC = ctx.fillStyle;
	ctx.fillStyle=color;
	ellipse(location, radius);
	ctx.fillStyle = pC;
}

function lesser(than, input) {
	if (typeof input == 'object') {
		var output = new Vector(input.x, input.y);
		if (output.x < than)
			output.x = than;
		if (output.y < than)
			output.y = than;
		return output;
	} else {
		if (input < than)
			return than;
		else
			return input;
	}
}

function greater(than, input) {
	if (input > than)
		return than;
	else
		return input;
}

function rect(location, size) {
	ctx.fillRect(location.x-size.x/2, location.y-size.y/2, size.x, size.y);
}

function cRect(location, size, color) {
	var pC = ctx.fillStyle;
	ctx.fillStyle=color;
	rect(location, size);
	ctx.fillStyle=pC;
}

function line(loc1, loc2) {
	ctx.beginPath();
	ctx.moveTo(loc1.x, loc1.y);
	ctx.lineTo(loc2.x, loc2.y);
	ctx.stroke();
}

function cLine(loc1, loc2, color) {
	var pC = ctx.strokeStyle;
	ctx.strokeStyle=color;
	line(loc1,loc2);
	ctx.strokeStyle=pC;
}

function coLine(loc1, loc2, color, alpha) {
	var pA=ctx.globalAlpha;
	ctx.globalAlpha=alpha;
	cLine(loc1,loc2,color);
	ctx.globalAlpha=pA;
}

function scaleCanvas(cvs, iVector) {
	cvs.width  = iVector.x;
	cvs.height = iVector.y;
}

function getWinSize() {
	var winSize = new Vector(window.innerWidth, window.innerHeight);
	return winSize;
}

function getCanvasSize() {
	var canSize = new Vector(canvas.width, canvas.height);
	return canSize;
}

function degree(n1, n2, l) {
	return (n1 * (1-l)) + (n2 * l);
}

function vDegree(v1,v2,l) {
	return new Vector(degree(v1.x,v2.x,l), degree(v1.y,v2.y,l));
}

function iDegree(n1, n2, l) {
	var d1 = diff(n1,l);
	var d2 = diff(n2,l);
	return d1/(d1+d2);
	// return least(n1,n2)-l
	// return l/diff(n1,n2);
	// return least(n1,n2) + diff(n1,n2)*l;
}

function viDegree(v1,v2,l) {
	var d1 = dist(v1,l);
	var d2 = dist(v2,l);
	return d1/(d1+d2)
}

function least() {
	var output = arguments[0];
	for (i = 0; i < arguments.length; i++)
		if (arguments[i] < output)
			output = arguments[i];
	return output;
}

function greatest() {
	var output = arguments[0];
	for (i = 0; i < arguments.length; i++)
		if (arguments[i] > output)
			output = arguments[i];
	return output;
}

function vDegree(v1, v2, l) {
	return new Vector(degree(v1.x, v2.y, l.x), degree(v1.y, v2.y, l.y));
}

function sqrt(i) {
	return Math.sqrt(i);
}

function dist(v1, v2) {
	return sqrt(sq(v1.x - v2.x)+sq(v1.y - v2.y));
}

function dists(v1,v2) {
	return new Vector(xDist(v1,v2),yDist(v1.v2));
}

function xDist(v1,v2) {
	return v1.x - v2.x;
}

function yDist(v1,v2) {
	return v1.y - v2.y;
}

function sq(x) {
	return x*x;
}

function cb(x) {
	return x*x*x;
}

function sVolfromRad(radius) {
	return (4/3*Math.PI)*cb(radius);
}

function sRadfromVol(volume) {
	return Math.pow((volume/Math.PI)*(3/4),1/3)
}

function vectorAverage() {
	var xAvg = 0;
	var yAvg = 0;
	for (i = 0; i < arguments.length; i++) {
		xAvg += arguments[i].x;
		yAvg += arguments[i].y;
	}
	return new Vector(xAvg/arguments.length, yAvg/arguments.length);
}

function average() {
	var avg = 0;
	for (i = 0; i < arguments.length; i++) {
		avg += arguments[i];
	}
	return avg/arguments.length;
}

function getRandomColor() {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

var Node = (function () {
	function Node(x, y, r, c) {
		this.loc = new Vector(x,y);
		this.oLoc = new Vector(x,y);
		this.speed = new Vector(0,0);
		this.radius = r;
		this.color = c;
	}
	Node.prototype.move = function() {
		this.loc.add(this.speed);
	}
	Node.prototype.grow = function(factor) {
		this.radius += factor;
	}
	Node.prototype.addSpeed = function(_x,_y) {
		this.speed.add(_x,_y);
	}
	Node.prototype.setSpeed = function(_x,_y) {
		this.speed.set(_x,_y);
	}
	Node.prototype.shiftSpeed = function(_x,_y) {
		this.speed.x = _x*this.speed.x;
		this.speed.y = _y*this.speed.y;
	}
	Node.prototype.tick = function() {
		cEllipse(this.loc, this.radius, this.color);
	}
	return Node;
}());

function loadScript(url, callback) {
    jQuery.ajax({
        url: url,
        dataType: 'script',
        success: callback,
        async: true
    });
}