### Light Fabric

When I decided to completely redesign my website (the old one can be found [here](https://old.mitchelljones.com)), I felt like I needed a sleek and interesting visual demo for the top of the page to keep some of the fun from the old demo-based homepage. So, it was back to HTML canvas and JavaScript - but, this time, I was determined to make the cleanest, fastest possible demo I could with everything I've learned between now and then.

**Controls:** *Click* and *hold* to attract, *release* to release.

<center><iframe style='width:50vw;height:30vw;' src='/projects/js/light.html'></iframe></center>
<center><a href='/projects/js/light.html'>Full Page</a></center>

### How It's Made

#### Priorities

Dissatisfied with the often subpar performance of one of my [old homepage demos](/projects/js/vectors), I went into this project with performance as my main priority. Knowing that this would be the first thing featured on my [cleaner homepage design](/), I also wanted it to look as clean and sleek as possible.

#### Making things easier

First things first, I rewrote most of my go-to "functions.js" file, which holds a ton of useful functions I've come up with throughout my canvas projects. The pride of these changes, the *init* and *anim* functions, make canvas demos much easier to get started with, and automate the repetitive aspects of making such demos, like clearing the canvas each run, handling window resizes and otherwise scaling the canvas, and getting the *canvas* and *context* objects from the Canvas element in the HTML DOM. Here are the functions:

~~~~

function init(id, setup, tick, onResize) {
	if (typeof onResize == 'undefined')			// Run the setup function on resize if no custom function is provided
		onResize = setup;
	var c = document.getElementById(id);		// Get canvas object
	var o = {cvs:c, ctx:c.getContext('2d')};	// Get context object
	parentScale(o.cvs);							// Scale the canvas properly to its parent element
	setup(o.cvs, o.ctx);						// Run the provided setup function and give it the canvas and context elements
	anim(tick, o.cvs, o.ctx);					// Start the animation loop
	$(window).resize(function() {				// Handle window resizing
		parentScale(o.cvs);
		onResize(o.cvs,o.ctx);
	});
}

function anim(func, cvs, ctx) {
	window.requestAnimationFrame(function() {
		ctx.clearRect(0,0,cvs.width,cvs.height);	// Clear the canvas for next frame
		func();										// Run the meat and potatoes
		anim(func, cvs, ctx);						// Loop this function
	});
}

~~~~

I know, I know - regular JS is better for setting the onresize function of the window, but using JQuery allows me to add multiple listeners easily, which is necessary considering there are two canvas demos on [my homepage](/) that need to react to being resized.

#### Getting mouse input and moving nodes
Step two was to collect information about the cursor. The gravitational pull of the cursor in the demo is based on how fast it's moving, so the two bits of info needed are the cursor's position and speed. This is super easy - just add a 'mousemove' listener to the canvas (or, in my case, the parent element (for a few reasons)) and compare the current position to the previous position. Then, I used a collection of functions and my own *Vector* object to make the nodes move:

***functions.js***

~~~~

Vector.prototype.add = function(input) {	// Add two vectors or a vector and a constant together
	if (typeof input == 'object') {
		this.x = this.x+input.x;
		this.y = this.y+input.y;
	} else {
		this.x = this.x+input;
		this.y = this.y+input;
	}
	return this;							// Return the modified vector
};

Vector.prototype.mult = function(input) {	// Multiply two vectors or a vector and a constant together
	if (typeof input == 'object') {
		this.x = this.x*input.x;
		this.y = this.y*input.y;
	} else {
		this.x = this.x*input;
		this.y = this.y*input;
	}
	return this;							// Return the modified vector
};

Vector.prototype.times= function(input) {	// Get the result of a multiplication between two vectors or a vector and a constant (doesn't affect the vector object)
	if (typeof input == 'object')
		return new Vector(this.x*input.x,this.y*input.y);
	else
		return new Vector(this.x*input,this.y*input);
};

function dist(v1, v2) {			// Get the distance between two points
	return sqrt(sq(v1.x - v2.x)+sq(v1.y - v2.y));
}

function angle(c,n) {			// Get the angle between two points
	var dx = n.x-c.x;
	var dy = n.y-c.y;
	return Math.atan2(dy,dx);
}

function velToPoint(c,n,f) {	// Get a vector (x,y) for the velocity between two points multiplied by some factor f
	var a = angle(c,n);
	if (dist(c,n) > 0)						// Handle " x/0 = undefined "
		return new Vector(f*Math.cos(a),f*Math.sin(a));
	else
		return new Vector(0,0);
}

function grav(p1,p2,f) {		//Get velocity for p1 to move towards p2
	var d = dist(p1,p2);
	if (d > 0)
		return new Vector((p1.x-p2.x)*f,(p1.y-p2.y)*f);
	return new Vector(0,0);
}

~~~~

***demo.js***

~~~~

/* np = node's current position | n.v = node's current velocity | no = nodes' original position */
/* mo = cursor's current position | mv = cursor's current velocity */
/* pulse = [mouse button was just released] | draw = [mouse button is being pressed] */

for (a = 0; a < num_nodes; a++) {
	if (pulse)
		n.v.add(velToPoint(np,mo,25).times(-1));	// Move away from cursor with a factor of 25
	else if (draw)
		n.v.add(velToPoint(np,mo,2.5));				// Move towards cursor with a factor of 2.5
	else
		n.v.add(velToPoint(np,mo,mv));				// Move towards cursor with a factor of cursor's speed
	n.p.add(n.v.mult(0.95).plus(grav(no,np,0.2)));	// Decrease velocity by 5% and move back towards node origin point
	if (dist(np,no) <= 1)							// If node is *really* close to its origin, teleport it to its origin (fixes silly bugs)
		np = no.clone();
}

~~~~

#### Drawing to the canvas

This is where things get really interesting. The most performance-heavy part of my previous projects, and most Canvas+JS projects out there, is actually drawing items to the canvas. I did a lot of online research, and found that the fastest way to draw to HTML canvas is to tell each specific subpixel how bright to be by using JavaScript's [ImageData](https://developer.mozilla.org/en-US/docs/Web/API/ImageData) object.

~~~~

d = (i = ctx.createImageData(w,h)).data;
/* for loop through all the nodes */ {
	/* Run all the calculations */
	d[b = (~~np.x + (~~np.y*w))*4] = d[b+1] = d[b+2] = d[b+3] = 255;
}
ctx.putImageData(i,0,0);

~~~~

Okay, that's a long, confusing line of code - let's break it down.

`d` is a big array of every subpixel within the frame. There are four subpixels to a pixel (red, green, blue, alpha). This means that the length of this array is ( 4 * (width * height) ). This will be important later.

`d[b = (~~np.x + (~~np.y * w)) * 4]...` Here, we're rounding the node's coordinates down (~~ is just like [Math.floor()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor)), then multiplying it by 4 (because there are 4 subpixels to a pixel, so the array is four times as just the amount of pixels and the indexes adjust accordingly). This gives us the index of our array at which the first of our four subpixels is located for this node (one node is represented by one pixel). Since every non-integer is rounded, our answer must be an integer and can be used as an index for an item in our `d` array.

`... = d[b+1] = d[b+2] = d[b+3] = 255;` Here, we just go through the next four after the one we just figured out, and set them all to maximum brightness, 255. This makes the pixel at the position of our node appear white.

`ctx.putImageData(i,0,0);` This one just writes the array that we just manipulated onto our actual canvas, drawing the frame.