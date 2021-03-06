/* Adapted from https://codepen.io/anon/pen/rdwExX */
(function(){
	let cvs, ctx;

	let color = $('#about').css('background-color');

	let div = document.getElementsByTagName('BODY')[0];

	let mouse = new Vector(0,0);
	let lastMouse = new Vector(0,0);
	let moused= false;
	
	let presets = {};

	presets.o = function (x, y, s, dx, dy) {
		return {
			x: x,
			y: y,
			r: 12 * s,
			w: 5 * s,
			dx: dx,
			dy: dy,
			draw: function(ctx, t) {
				this.x += this.dx;
				this.y += this.dy;
				
				ctx.beginPath();
				ctx.arc(this.x + Math.sin((50 + x + (t / 10)) / 100) * 3, this.y + Math.sin((45 + x + (t / 10)) / 100) * 4, this.r, 0, 2 * Math.PI, false);
				ctx.lineWidth = this.w;
				ctx.strokeStyle = color;
				ctx.stroke();
			}
		};
	};

	presets.x = function (x, y, s, dx, dy, dr, r) {
		r = r || 0;
		return {
			x: x,
			y: y,
			s: 20 * s,
			w: 5 * s,
			r: r,
			dx: dx,
			dy: dy,
			dr: dr,
			draw: function(ctx, t) {
				this.x += this.dx;
				this.y += this.dy;
				this.r += this.dr;
				
				let _this = this;
				let line = function(x, y, tx, ty, c, o) {
					o = o || 0;
					ctx.beginPath();
					ctx.moveTo(-o + ((_this.s / 2) * x), o + ((_this.s / 2) * y));
					ctx.lineTo(-o + ((_this.s / 2) * tx), o + ((_this.s / 2) * ty));
					ctx.lineWidth = _this.w;
					ctx.strokeStyle = c;
					ctx.stroke();
				};
				
				ctx.save();
				
				ctx.translate(this.x + Math.sin((x + (t / 10)) / 100) * 5, this.y + Math.sin((10 + x + (t / 10)) / 100) * 2);
				ctx.rotate(this.r * Math.PI / 180);
				
				line(-1, -1, 1, 1, color);
				line(1, -1, -1, 1, color);
				
				ctx.restore();
			}
		};
	};

	presets.hex = function (x, y, s, dx, dy) {
		return {
			x: x,
			y: y,
			r: 12 * s,
			w: 5 * s,
			dx: dx,
			dy: dy,
			draw: function(ctx, t) {
				this.x += this.dx;
				this.y += this.dy;
				ctx.beginPath();
				ctx.moveTo(this.x + this.s * Math.cos(0), this.y + this.s * Math.sin(0));

				for (let side = 0; side < 7; side++) {
					ctx.lineTo(this.x + this.s * Math.cos(side * 2 * Math.PI / 6), this.y + this.s * Math.sin(side * 2 * Math.PI / 6));
				}
				ctx.lineWidth = this.w;
				ctx.strokeStyle = color;
				ctx.stroke();
			}
		};
	};

	$(document).ready(function() {
		let elements;

		div.addEventListener('mousemove', function(e) {
			let rect = cvs.getBoundingClientRect();
			mouse.set(e.clientX - rect.left, e.clientY - rect.top);
			if (!moused) {
				lastMouse = mouse.clone();
				moused = true;
			}
		});

		function setup(cv, ct) {
			cvs = cv;
			ctx = ct;
			w = cvs.width;
			h = cvs.height;
			elements = [];
			for(let x = 0; x < w; x++) {
				for(let y = 0; y < h; y++) {
					if(Math.round(Math.random() * 8000) == 1) {
						let s = ((Math.random() * 5) + 1) / 10;
						let shape = Math.round(Math.random()*3);
						if(shape == 1)
							elements.push(presets.o(x, y, s, 0, 0));
						else if (shape == 2)
							elements.push(presets.x(x, y, s, 0, 0, ((Math.random() * 3) - 1) / 10, (Math.random() * 360)));
						else if (shape == 3)
							elements.push(presets.hex(x, y, s, 0, 0));
					}
				}
			}
		}

		init('bg', setup, tick);

		function tick() {
			let vel = {x: mouse.x - lastMouse.x, y:mouse.y - lastMouse.y};
			let time = new Date().getTime();
			for (let i in elements) {
				let e = elements[i];
				let aw = w+10;
				let ah = h+10;
				let sm = -10;
				if (e.x > aw)
					e.x = sm;
				if (e.x < sm)
					e.x = aw;
				if (e.y > ah)
					e.y = sm;
				if (e.y < sm)
					e.y = ah;
				e.dx = vel.x/25;
				e.dy = vel.y/25;
				// e.dy += 0.5;
				e.draw(ctx, time);
			}
			lastMouse = mouse.clone();
		}
	});
})();