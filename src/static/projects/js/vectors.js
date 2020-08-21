var mouseLoc = new Vector();

var tool = 0;

var PULL  = 0;
var PUSH = 1;
var TWIST = 2;

var frozen = false;

var nodeAmount;
var nodeRows;
var nodeCols;

var holeSize  = 30;
var holeGRate = -0.25;
var holeG = true;

var nodes = [];
var holes = [];

var resetting = false;

var cvs, ctx;

//Initial Setup Function
function setup(cvs1, ctx1) {
	cvs = cvs1;
	ctx = ctx1;
	//scaleCanvas(getWinSize());  //scale canvas to window
	initialize();
	//window.requestAnimationFrame(draw);	//run draw every frame
}

init('canvas', setup, draw);

//Draw every frame
function draw() {
	if (isReset) {
		isReset = false;
		onClick_reset();
	}

	for (i = 0; i < nodes.length; i++) {
		nodes[i].tick();
		if (!frozen) {
			nodes[i].move();
		}
		if (nodes[i].loc.x+nodes[i].radius > cvs.width  || nodes[i].loc.x-nodes[i].radius < 0) { //If hitting left/right wall, invert xSpeed
			nodes[i].shiftSpeed(-1,1);
		}
		if (nodes[i].loc.y+nodes[i].radius > cvs.height || nodes[i].loc.y-nodes[i].radius < 0) { //If hitting top/bottom wall, invert ySpeed
			nodes[i].shiftSpeed(1,-1);
		}
	}
	for (i = 0; i < holes.length; i++) {
		holes[i].tick();
		for (n = 0; n < nodes.length; n++) {
			if (tool == TWIST) {
				nodes[n].speed.add(twist(nodes[n].loc, holes[i].loc, 5*holes[i].radius/sq(dist(nodes[n].loc, holes[i].loc))));
			} else {
				var multiplier = 1;
				if (tool == PUSH) {
					multiplier = 1;
				} else if (tool == PULL) {
					multiplier = -1;
				}
				nodes[n].speed.add(grav(nodes[n].loc, holes[i].loc, 5*holes[i].radius/sq(dist(nodes[n].loc, holes[i].loc))).times(multiplier));
			}
		}
		if (holeG) {
			if (holes[i].radius > Math.abs(holeGRate)) {  //Radius < 0 causes error
				holes[i].grow(holeGRate);
			} else {									  //Remove with splice() if too small to shrink
				holes.splice(i,1);
			}
		}
	}
}

function initialize() {
	nodeCols = Math.floor(cvs.width/60);
	nodeRows = Math.floor(cvs.height/53);
	for (r = 0; r < nodeRows; r++) {
		for (c = 0; c < nodeCols; c++) {
			nodes.push(new Node((c+1)*cvs.width/(nodeCols+1), (r+1)*cvs.height/(nodeRows+1), 10, getRandomColor())); //add equidistant nodes
		}
	}
}

function onClick_reset() {
	nodes = [];
	initialize();
}

function reset() {
	scaleCanvas(getWinSize());
	setup();
	onClick_reset();
}

function grav(vector1, vector2, factor) {
	var d  = dist(vector1, vector2);		//get distance between points
	var dX = xDist(vector1, vector2);		//get x distance (run)
	var dY = yDist(vector1, vector2);		//get y distance (rise)
	var xS = (Math.abs(dX)/dX)*(Math.sqrt(1-sq(dY/(Math.sqrt(sq(dX)+sq(dY))))));	//Pythagorean theorem-ish
	var yS = (Math.abs(dY)/dY)*(Math.sqrt(1-sq(dX/(Math.sqrt(sq(dX)+sq(dY))))));	//''
	var output = new Vector(xS,yS);
	if (d > 10) {
		output = output.times(factor);
	} else {
		output.set(0,0);
	}
	return output;
}

function twist(vector1, vector2, factor) {
	var d  = dist(vector1, vector2);		//get distance between points
	var dX = xDist(vector1, vector2);		//get x distance (run)
	var dY = -yDist(vector1, vector2);		//get y distance (rise)
	var yS = (Math.abs(dX)/dX)*(Math.sqrt(1-sq(dY/(Math.sqrt(sq(dX)+sq(dY))))));	//Pythagorean theorem-ish
	var xS = (Math.abs(dY)/dY)*(Math.sqrt(1-sq(dX/(Math.sqrt(sq(dX)+sq(dY))))));	//''
	var output = new Vector(xS,yS)
	if (d > 10) {
		output = output.times(factor);
	} else {
		output.set(0,0);
	}
	return output;
}

//Register click
window.addEventListener('click', function(e) {
	var rect = cvs.getBoundingClientRect();
	mouseLoc.set(e.clientX-rect.left, e.clientY-rect.top);
	if (!hovering && !frozen) {
		holes.push(new Node(mouseLoc.x, mouseLoc.y, holeSize, "#20094C"))	//On click, make a new hole
	}
});

//Track mouse location
window.addEventListener('mousemove', function(e) {
	var rect = cvs.getBoundingClientRect();
	mouseLoc.set(e.clientX-rect.left, e.clientY-rect.top);
});

$(window).resize(function() {
	reset();
});

//Keyboard input
document.addEventListener('keydown', function(event) {
    if(event.keyCode == 32) {		//Space
    	resetting = !resetting;
    }
    else if(event.keyCode == 39) {
        alert('Right was pressed');
    }
});