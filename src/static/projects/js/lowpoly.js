var winSize;
var center;

var nodeDist = 100;
var nodeRows;
var nodeCols;

var topLeft;
var topRight;
var botLeft;
var botRight;

var variancePct = 0.75;

var overflow = 3;

var prefs = [];
var gradColors = [];
if (location.hash === '') prefs = ['blue', 'white', 'black', 'white', 'red'];
else prefs = location.hash.split('#')[1].split('+');

initGradColors(prefs);

var gradMovement = true;
var nodeMovement = true;

var max_wander_offset = 0.3;
var max_wander_radius = 5;

var wander_theta = Math.random()*(2*Math.PI);
var wander_radius = Math.random()*max_wander_radius;

var Wanderer = (function() {
	function Wanderer(_x, _y, _w, m) {
		this.x = _x;
		this.y = _y;
		this.v = new Vector(_x,_y);
		this.wander = _w;
		this.origin = {x:_x, y:_y};
		if (m && !(this.x < 0 || this.y < 0 || this.x > winSize.x || this.y > winSize.y)) {
			this.moves = true;
		} else {
			this.moves = false;
		}
		// this.moves = !(this.x < 0 || this.y < 0 || this.x > winSize.x || this.y > winSize.y);
		this.wandered = 0;
		this.wander_theta = 0;
		this.wander_radius = 0;
		this.max_wander_offset = 5;
		this.max_wander_radius = 1000;
		this.wander_theta = Math.random()*(2*Math.PI);
		this.wander_radius = Math.random()*max_wander_radius;
	}
	Wanderer.prototype.move = function() {
		if (this.moves) {
			this.wander_offset = Math.random()*(2*max_wander_offset)-max_wander_offset;
			this.wander_theta += this.wander_offset;
			this.dX = Math.cos(this.wander_theta)/30;
			this.dY = Math.sin(this.wander_theta)/30;
			this.nX = this.x+this.dX;
			if (diff(this.nX, this.origin.x) > this.wander)
				this.dX = -this.dX;
			if (diff(this.nY, this.origin.y) > this.wander)
				this.dY = -this.dY;
			this.x += this.dX;
			this.y += this.dY;
			this.v.set(this.x,this.y);
		}
	}
	return Wanderer;
}());

var Circulator = (function() {
	function Circulator(_x, _y, _r, _a) {
		this.center = new Vector(_x,_y);
		this.radius = _r;
		this.x = 0;
		this.y = 0;
		this.v = new Vector(this.x, this.y);
		this.angle = _a;
	}
	Circulator.prototype.move = function() {
		this.x = this.center.x + Math.cos(this.angle)*this.radius;
		this.y = this.center.y + Math.sin(this.angle)*this.radius;
		this.v = new Vector(this.x, this.y);
		this.angle += Math.PI/5000;
	}
	Circulator.prototype.display = function() {
		cEllipse(this.v, 5, '#000000');
	}
	return Circulator;
}());

var rectMover = (function() {
	function rectMover(bound1, bound2, speed, startPos, moves) {
		this.min = bound1;
		this.max = bound2;
		this.speed = speed;
		this.moves = moves;
		this.v = new Vector(0,0);
		if (startPos == 0)
			this.v.set(bound1.x, bound1.y);
		else if (startPos == 1)
			this.v.set(bound2.x, bound1.y);
		else if (startPos == 2)
			this.v.set(bound2.x, bound2.y);
		else if (startPos == 3)
			this.v.set(bound1.x, bound2.y);
		this.vel = new Vector(0,0);
		if (this.v.y == bound1.y)
			this.vel.set(this.speed,0);
		else
			this.vel.set(-this.speed,0);
	}
	rectMover.prototype.move = function() {
		if (this.moves) {
			if (this.v.x > this.max.x) {
				this.v.x = this.max.x;
				this.vel.set(0,this.speed);
			} if (this.v.y > this.max.y) {
				this.v.y = this.max.y;
				this.vel.set(-this.speed,0);
			} if (this.v.x < this.min.x) {
				this.v.x = this.min.x;
				this.vel.set(0,-this.speed);
			} if (this.v.y < this.min.y) {
				this.v.y = this.min.y;
				this.vel.set(this.speed,0);
			}
			this.v.add(this.vel);
			this.x = this.v.x;
			this.y = this.v.y;
		}
	}
	rectMover.prototype.display = function() {
		cEllipse(this.v, 5, '#000000');
	}
	return rectMover;
}());

var Triangle = (function() {
	function Triangle(_l1, _l2, _l3) {
		this.l1 = _l1;
		this.l2 = _l2;
		this.l3 = _l3;
		this.c = vectorAverage(this.l1, this.l2, this.l3);
		this.color;
		this.sum = this.c.x+this.c.y;
	}
	Triangle.prototype.display = function() {
		cTriangle(this.l1,this.l2,this.l3,this.color);
	};
	return Triangle;
}());

var nodes = [];
var tris = [];

var gradVectors = [];

var cvs, ctx;

//Initial Setup Function
function setup(cvs1, ctx1) {
	cvs = cvs1;
	ctx = ctx1;
	initialize();
}

init('canvas', setup, draw)

function initialize() {
	winSize = getWinSize();
	center = winSize.div(2);
	var bigAngle = dist(new Vector(0,0), center);
	gradVectors[0] = new rectMover(new Vector(0,0), winSize, 0.33, 0, gradMovement);
	gradVectors[1] = new rectMover(new Vector(0,0), winSize, 0.33, 2, gradMovement);
	// gradVectors[0] = new Circulator(center.x, center.y, bigAngle, 0);
	// gradVectors[1] = new Circulator(center.x, center.y, bigAngle, Math.PI);
	nodeRows = Math.floor(winSize.y / nodeDist)+1;
	nodeCols = Math.floor(winSize.x / nodeDist)+1;
	var yNodeDist = winSize.y / (nodeRows-1);
	var xNodeDist = winSize.x / (nodeCols-1);
	var x = 0;
	var y = 0;
	nodes = [];
	for (r = 0; r < nodeRows+overflow; r++) {
		nodes.push([]);
		for (c = 0; c < nodeCols+overflow; c++) {
			var variance = variancePct*nodeDist;
			nodes[r].push(new Wanderer(((c-(overflow/2))*xNodeDist)+(Math.random()*variance-(variance/2)),((r-(overflow/2))*yNodeDist)+(Math.random()*variance-(variance/2)), 0.5, nodeMovement));
		}
	}
	topLeft = nodes[0][0].v;
	topRight = nodes[0][nodeCols-1].v;
	botLeft = nodes[nodeRows-1][0].v;
	botRight = nodes[nodeRows-1][nodeCols-1].v;
	triinitialize();
}

function draw() {
	for (r = 0; r < nodes.length; r++) {
		for (c = 0; c < nodes[r].length; c++) {
			nodes[r][c].move();
		}
	}
	for (t = 0; t < tris.length; t++) {
		tris[t].display();
	}
	for (i = 0; i < gradVectors.length; i++) {
		gradVectors[i].move();
		// gradVectors[i].display();
	}
	triColors();
}

function triinitialize() {
	tris = []
	for (r = 0; r < nodes.length; r++) {
		for (c = 0; c < nodes[r].length; c++) {
			if (!(r >= nodes.length-1 || c >= nodes[r].length-1) && !(r <= 0 || c <= 0)) {
				tris.push(new Triangle(nodes[r][c], nodes[r-1][c], nodes[r][c-1]));
				tris.push(new Triangle(nodes[r][c], nodes[r+1][c], nodes[r][c+1]));
			}
		}
	}
	triColors();
}

function triColors() {
	for (t = 0; t < tris.length; t++) {
		tris[t].color = rgbToHex(gradients(gradColors, viDegree(gradVectors[0].v, gradVectors[1].v, tris[t].c)));
	}
}

function initGradColors(arr) {
	gradColors = [];
	for (i = 0; i < arr.length; i++) {
		var c;
		if (arr[i].includes('#')) {
			gradColors.push(arr[i]);
		} else {
			c = colors[arr[i]];
			if (typeof c != 'undefined') {
				gradColors.push(colors[arr[i]]);
			}
		}
	}
}


function changeColors(arr_c) {
	initGradColors(arr_c);
}

function changeNodeMovement(bool) {
	nodeMovement = bool;
	for (x = 0; x < nodes.length; x++) {
		for (y = 0; y < nodes[x].length; y++) {
			nodes[x][y].moves = nodeMovement;
		}
	}
}

function changeGradMovement(bool) {
	gradMovement = bool;
	for (i = 0; i < gradVectors.length; i++) {
		gradVectors[i].moves = gradMovement;
	}
}

function changeVariance(float) {
	variancePct = float;
	initialize();
}

function changeNodeDist(float) {
	nodeDist = float;
	initialize();
}