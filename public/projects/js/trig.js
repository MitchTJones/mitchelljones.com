var clumps;
var clumpRows = 3;
var clumpCols = 5;

var nodeAmount = 12;
var nodes = [];
var growthRate = -0.05;
var initSize = 5
var speedFactor = 0.1;

var rand = 1;

var startTime;

function initClumps() {
	nodes = []
	var winSize = getWinSize()
	clumpCols = Math.floor(winSize.x / 240);
	clumpRows = Math.floor(winSize.y / 212);
	clumps = clumpRows*clumpCols;
	for (r = 0; r < clumpRows; r++) {
		for (c = 0; c < clumpCols; c++) {
			nodes.push([]);
			for (n = 0; n < nodeAmount; n++) {
				nodes[c+(r*clumpCols)][n] = new Node((c+1)*winSize.x/(clumpCols+1), (r+1)*winSize.y/(clumpRows+1), initSize, getRandomColor());
			}
		}
	}
}


var cvs, ctx;

//Initial Setup Function
function setup(cvs1, ctx1) {
	cvs = cvs1;
	ctx = ctx1;
	initClumps();
	startTime = (new Date()).getTime();
}

init('canvas', setup, draw);

function draw() {
	var time = ((new Date()).getTime() - startTime)/1000;
	var lastRad = nodes[nodes.length-1][nodes[0].length-1].radius
	if (lastRad < Math.abs(growthRate) || lastRad > 5) {
		growthRate = -growthRate
	}
	for (i = 0; i < nodes.length; i++) {
		for (n = 0; n < nodes[i].length; n++) {
			nodes[i][n].setSpeed(speedFactor*(rand*Math.sin(((time + n)*Math.PI)/(nodeAmount/2))), speedFactor*(Math.cos(((time + n)*Math.PI)/(nodeAmount/2))));
			nodes[i][n].move();
			nodes[i][n].tick();
			nodes[i][n].grow(growthRate);
		}
	}
}