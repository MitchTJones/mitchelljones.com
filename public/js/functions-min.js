var colors={white:"#FFFFFF",grey:"#808080",black:"#000000",red:"#FF0000",green:"#00FF00",blue:"#0000FE",yellow:"#FFFF00",aqua:"#00FFFF",pink:"#FFC0CB",purple:"#800080",orange:"#FFA500",silver:"#C0C0C0"},Vector=function(){function t(t,e){"object"==typeof t?(this.x=t.x,this.y=t.y):(this.x=t,this.y=e)}return t.prototype.set=function(t,e){return"object"==typeof t?(this.x=t.x,this.y=t.y):(this.x=t,this.y=e),this},t.prototype.add=function(t){return"object"==typeof t?(this.x=this.x+t.x,this.y=this.y+t.y):(this.x=this.x+t,this.y=this.y+t),this},t.prototype.mult=function(t){return"object"==typeof t?(this.x=this.x*t.x,this.y=this.y*t.y):(this.x=this.x*t,this.y=this.y*t),this},t.prototype.plus=function(e){return"object"==typeof e?new t(this.x+e.x,this.y+e.y):new t(this.x+e,this.y+e)},t.prototype.div=function(e){return"object"==typeof e?new t(this.x/e.x,this.y/e.y):new t(this.x/e,this.y/e)},t.prototype.times=function(e){return"object"==typeof e?new t(this.x*e.x,this.y*e.y):new t(this.x*e,this.y*e)},t.prototype.print=function(){return"("+this.x+", "+this.y+")"},t.prototype.equalTo=function(t){return this.x==t.x&&this.y==t.y},t.prototype.clone=function(){return new t(this.x,this.y)},t.prototype.heading=function(){return Math.atan2(this.y,this.x)},t.prototype.pyth=function(){return sqrt(sq(this.x)+sq(this.y))},t.prototype.sum=function(){return this.x+this.y},t}();function bare(t,e,n){void 0===n&&(n=e),getCanvas(t),e(),window.onresize=function(){n()}}function custom(t,e,n){void 0===n&&(n=e);var i=document.getElementById(t),r={cvs:i,ctx:i.getContext("2d")};parentScale(r.cvs),e(r.cvs,r.ctx),$(window).resize(function(){parentScale(r.cvs),n(r.cvs,r.ctx)})}function init(t,e,n,i){void 0===i&&(i=e);var r=document.getElementById(t),o={cvs:r,ctx:r.getContext("2d")};parentScale(o.cvs),e(o.cvs,o.ctx),anim(n,o.cvs,o.ctx),$(window).resize(function(){parentScale(o.cvs),i(o.cvs,o.ctx)})}function anim(t,e,n){window.requestAnimationFrame(function(){n.clearRect(0,0,e.width,e.height),t(),anim(t,e,n)})}function getCanvas(t){cvs=document.getElementById(t),ctx=cvs.getContext("2d")}function properScale(t){scaleCanvas(t,{x:t.clientWidth,y:t.clientHeight})}function parentScale(t){var e=t.parentElement;scaleCanvas(t,{x:e.clientWidth,y:e.clientHeight})}function rgbToHex(t){return"#"+componentToHex(t.r)+componentToHex(t.g)+componentToHex(t.b)}function componentToHex(t){t<0&&(t=0);var e=t.toString(16);return 1==e.length?"0"+e:e}function gradients(t,e){var n=e*(t.length-1),i=Math.floor(n),r=i+1,o=t[i];if(r==t.length)r=i;var c=t[r];return gradient(hexToRgb(o),hexToRgb(c),n-i)}function gradient(t,e,n){return{r:Math.floor(degree(t.r,e.r,n)),g:Math.floor(degree(t.g,e.g,n)),b:Math.floor(degree(t.b,e.b,n))}}function hexToRgb(t){var e=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(t);return e?{r:parseInt(e[1],16),g:parseInt(e[2],16),b:parseInt(e[3],16)}:null}function sign(t){return t<0?-1:1}function diff(t,e){return Math.abs(t-e)}function vel(t,e){return new Vector(e.x-t.x,e.y-t.y)}function angle(t,e){var n=e.x-t.x,i=e.y-t.y;return Math.atan2(i,n)}function velToPoint(t,e,n){var i=angle(t,e);return dist(t,e)>0?new Vector(n*Math.cos(i),n*Math.sin(i)):new Vector(0,0)}function triangle(t,e,n){ctx.beginPath(),ctx.lineTo(t.x,t.y),ctx.lineTo(e.x,e.y),ctx.lineTo(n.x,n.y),ctx.closePath()}function cTriangle(t,e,n,i){triangle(t,e,n),ctx.fillStyle=i,ctx.fill()}function ellipse(t,e){ctx.beginPath(),ctx.strokeWidth="2",ctx.arc(t.x,t.y,e,0,2*Math.PI),ctx.fill()}function cEllipse(t,e,n){var i=ctx.fillStyle;ctx.fillStyle=n,ellipse(t,e),ctx.fillStyle=i}function lesser(t,e){if("object"==typeof e){var n=new Vector(e.x,e.y);return n.x<t&&(n.x=t),n.y<t&&(n.y=t),n}return e<t?t:e}function greater(t,e){return e>t?t:e}function rect(t,e){ctx.fillRect(t.x-e.x/2,t.y-e.y/2,e.x,e.y)}function cRect(t,e,n){var i=ctx.fillStyle;ctx.fillStyle=n,rect(t,e),ctx.fillStyle=i}function line(t,e){ctx.beginPath(),ctx.moveTo(t.x,t.y),ctx.lineTo(e.x,e.y),ctx.stroke()}function cLine(t,e,n){var i=ctx.strokeStyle;ctx.strokeStyle=n,line(t,e),ctx.strokeStyle=i}function coLine(t,e,n,i){var r=ctx.globalAlpha;ctx.globalAlpha=i,cLine(t,e,n),ctx.globalAlpha=r}function scaleCanvas(t,e){t.width=e.x,t.height=e.y}function getWinSize(){return new Vector(window.innerWidth,window.innerHeight)}function getCanvasSize(){return new Vector(canvas.width,canvas.height)}function degree(t,e,n){return t*(1-n)+e*n}function vDegree(t,e,n){return new Vector(degree(t.x,e.x,n),degree(t.y,e.y,n))}function iDegree(t,e,n){var i=diff(t,n);return i/(i+diff(e,n))}function viDegree(t,e,n){var i=dist(t,n);return i/(i+dist(e,n))}function least(){var t=arguments[0];for(i=0;i<arguments.length;i++)arguments[i]<t&&(t=arguments[i]);return t}function greatest(){var t=arguments[0];for(i=0;i<arguments.length;i++)arguments[i]>t&&(t=arguments[i]);return t}function vDegree(t,e,n){return new Vector(degree(t.x,e.y,n.x),degree(t.y,e.y,n.y))}function sqrt(t){return Math.sqrt(t)}function dist(t,e){return sqrt(sq(t.x-e.x)+sq(t.y-e.y))}function dists(t,e){return new Vector(xDist(t,e),yDist(t.v2))}function xDist(t,e){return t.x-e.x}function yDist(t,e){return t.y-e.y}function sq(t){return t*t}function cb(t){return t*t*t}function sVolfromRad(t){return 4/3*Math.PI*cb(t)}function sRadfromVol(t){return Math.pow(t/Math.PI*.75,1/3)}function vectorAverage(){var t=0,e=0;for(i=0;i<arguments.length;i++)t+=arguments[i].x,e+=arguments[i].y;return new Vector(t/arguments.length,e/arguments.length)}function average(){var t=0;for(i=0;i<arguments.length;i++)t+=arguments[i];return t/arguments.length}function getRandomColor(){for(var t="#",e=0;e<6;e++)t+="0123456789ABCDEF"[Math.floor(16*Math.random())];return t}var Node=function(){function t(t,e,n,i){this.loc=new Vector(t,e),this.oLoc=new Vector(t,e),this.speed=new Vector(0,0),this.radius=n,this.color=i}return t.prototype.move=function(){this.loc.add(this.speed)},t.prototype.grow=function(t){this.radius+=t},t.prototype.addSpeed=function(t,e){this.speed.add(t,e)},t.prototype.setSpeed=function(t,e){this.speed.set(t,e)},t.prototype.shiftSpeed=function(t,e){this.speed.x=t*this.speed.x,this.speed.y=e*this.speed.y},t.prototype.tick=function(){cEllipse(this.loc,this.radius,this.color)},t}();function loadScript(t,e){jQuery.ajax({url:t,dataType:"script",success:e,async:!0})}