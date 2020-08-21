(function(){
	const COLOR = 200;
	const SPACING = 6;
	const PADDING = 0;

	var div = document.getElementById('canvas');

	var cvs, ctx;

	var pm,moused,touched,m,draw,pulse,origin,nodes,num_nodes,w,h,rect,t;

	var pStart;

	function vector() {
		return  {p:new Vector(0,0),v:new Vector(0,0)};
	}

	function node(x,y) {
		var out = vector();
		out.o = new Vector(x,y);
		out.p = new Vector(x,y);
		return out;
	}

	function grav(p1,p2,f) {
		var d = dist(p1,p2);
		if (d > 0)
			return new Vector((p1.x-p2.x)*f,(p1.y-p2.y)*f);
		return new Vector(0,0);
	}

	div.addEventListener('mousemove', function(e) {
		rect = cvs.getBoundingClientRect();
		m.p.set(e.clientX-rect.left, e.clientY - rect.top);
		if (!moused) {
			pm.p = m.p.clone();
			moused = true;
		}
	});
	div.addEventListener('mousedown', function pull() {
		touched = false;
		draw = true;
	});
	div.addEventListener('mouseup', function release() {
		pulse = true;
		draw = false;
	});
	// div.addEventListener('touchstart', function onTouch() {
	// 	touched = true;
	// 	console.log('touch');
	// 	cvs.removeEventListener('touchstart', onTouch, false);
	// }, false);

	function setup(cv, ct) {
		cvs = cv;
		ctx = ct;
		t = 0;
		nodes = [];
		w = cvs.width;
		h = cvs.height;
		rect = cvs.getBoundingClientRect();
		origin = {x:w/2,y:h/2};
		touched = false;
		draw = false;
		pulse = false;
		m = vector();
		pm = vector();
		moused = false;
		for (y = -PADDING; y < h+PADDING; y+=SPACING) for (x = -PADDING; x < w+PADDING; x+=SPACING) nodes.push(node(x,y));
		num_nodes = nodes.length
	}

	init('canvas', setup, tick);

	function tick() {
		t++;
		var mo = m.p;
		m.v = vel(pm.p,mo);
		var mv = m.v.pyth()/20;
		d = (i = ctx.createImageData(w,h)).data;
		for (a = 0; a < num_nodes; a++) {
			n = nodes[a];
			var np = n.p;
			var no = n.o;
			if (pulse)
				n.v.add(velToPoint(np,mo,25).times(-1));
			else if (draw)
				n.v.add(velToPoint(np,mo,2.5));
			else
				n.v.add(velToPoint(np,mo,mv));
			n.p.add(n.v.mult(0.95).plus(grav(no,np,0.2)));
			if (dist(np,no) <= 1)
				np = no.clone();
			if (np.x < w)
				if (np.x > 0)
					d[b = (~~np.x + (~~np.y*w))*4] = d[b+1] = d[b+2] = d[b+3] = COLOR;
		}
		ctx.putImageData(i,0,0);
		pm.p = m.p.clone();
		pulse = false;
	}
})();