## Devblog 2 - 10/01/2017
### Networking
#### Functionality
I spent an exorbitant amount of time working on this project early on in the week and got the basic functionality of the server almost completely finished.
Here's a demo:

<video autoplay loop>
<source src='/projects/dsgame/video/NetworkingDemo1.mp4'>
</video>

What you see above is two players connecting to a lobby, both declaring themselves ready and starting a game, then playing out their turns. When both players have finished their turns, their turn is sent to their opponent and both turns are played simultaneously for each client.

Note that both clients and the server were all running on the same machine, so there is no network latency in this demo.

##### Challenges
When I first started on this project, server-authored countdowns were one of the first things I tried to do. Every time I tried to test it, all clients would disconnect from the server for seemingly no reason. I had no idea if this was node kicking them off, Unity disconnecting or something in between. I canned that functionality for a later date - this week was that later date. I reached the point where I realized that something was going to have to be done about this if I was going to have a server-authored time limit for turns.

After a couple hours of questioning my own sanity, I realized that this issue stemmed from my arch-nemesis throughout this project: JavaScript to C# miscommunication. C# can't handle JavaScript variables, so when I was sending through an int for the time, my Unity end of things just died. I figured out that the only way to send data from node.js to Unity was if it was contained within an object. This was a very simple fix once I discovered what the problem was, just changing ```var lobbyCountdown = 5``` to ```var lobbyCountdown = {t:5}```. I'm extremely glad I figured this out early on, as this would have been a very prominent issue throughout the rest of the project.  

#### Housekeeping
**warning:** lots of possibly boring code ahead; if you don't care about code condensing and housekeeping, [skip it](#skippoint), don't worry, I'll understand :'(

My node server is *very* messy - let's clean it up a bit.

First order of business: these extremely repetitive "checking" functions:


	function checkReady() {
		var ready = true;
		for (i = 0; i < sockets.length; i++) {
			if (!sockets[i].ready) {
				ready = false;
			}
		}
		return gameReady;
	}
	function checkLoaded() {
		var ready = true;
		for (i = 0; i < sockets.length; i++) {
			if (!sockets[i].gameLoaded) {
				ready = false;
			}
		}
		return ready;
	}
	function checkTurnEnds() {
		var ready = true;
		for (i = 0; i < sockets.length; i++) {
			if (!sockets[i].turnEnded) {
				ready = false;
			}
		}
		return ready;
	}
	function checkNextTurnRequests() {
		var ready = true;
		for (i = 0; i < sockets.length; i++) {
			if (!sockets[i].nextTurn) {
				ready = false;
			}
		}
		return ready;
	}

Using the power of JavaScript, we should be able to condense all of these down into a single function that takes the boolean name in the form of a string as an argument:

	function check(bool) {
		var ready = true;
		for (i = 0; i < sockets.length; i++) {
			if (!sockets[i][bool]) {
				ready = false;
			}
		}
		return ready;
	}

The second aberration of repetitiveness is the handling of all my countdowns; this one will take a bit more work. Here's the original code:

	function loadGame() {
		lobbyCountdownTimer = setInterval(function() {
			console.log('   game loads in ' + lobbyCountdown.t);
			for (i = 0; i < sockets.length; i++) {
				sockets[i].emit('lobbycountdown', lobbyCountdown);
			}
			lobbyCountdown.t--;
			if (lobbyCountdown.t < 1) {
				for (i = 0; i < sockets.length; i++) {
					console.log(sockets[i].number + ': sending gameload information');
					sockets[i].emit('loadgame');
				}
				resetLobbyCountdown();
			}
		}, 1000);
	}
	function startGame() {
		gamestartCountdownTimer = setInterval(function() {
			console.log('   game starts in ' + gamestartCountdown.t);
			for (i = 0; i < sockets.length; i++) {
				sockets[i].emit('gamestartcountdown', gamestartCountdown);
			}
			gamestartCountdown.t--;
			if (gamestartCountdown.t < 1) {
				for (i = 0; i < sockets.length; i++) {
					console.log(sockets[i].number + ': starting game');
					sockets[i].emit('startturn');
				}
				console.log('   Game On!');
				resetGameStartCountdown();
			}
		}, 1000);
	}
	function startTurn() {
		turnCountdownTimer = setInterval(function() {
			console.log('   turn has started');
			for (i = 0; i < sockets.length; i++) {
				sockets[i].emit('turncountdown', turnCountdown);
			}
			turnCountdown.t--;
			if (turnCountdown.t < 1) {
				console.log('  turn over!');
				for (i = 0; i < sockets.length; i++) {
					sockets[i].emit('turnover');
				}
			}
		});
	}
	function resetLobbyCountdown() {
		for (i = 0; i < sockets.length; i++) {
			sockets[i].emit('lobbycountdown-cancel');
		}
		clearInterval(lobbyCountdownTimer);
		lobbyCountdown.t = 5;
	}
	
	function resetGameStartCountdown() {
		clearInterval(gamestartCountdownTimer);
		gamestartCountdown.t = 5;
	}
	
	function resetTurnCountdown() {
		clearInterval(turnCountdownTimer);
		turnCountdown = 45;
	}

This one was a little bit more complicated but I was effectively able to cram all these functions into these two:

	function setTimer(name, time, message) {
		var interval = setInterval(function() {
			console.log('   Timer ' + name + ': ' + time.t);
			for (i = 0; i < sockets.length; i++) {
				sockets[i].emit(name + 'countdown', time);
			}
			time.t--;
			if (time.t < 1) {
				console.log('  Timer ' + name + ': emitting ' + message);
				for (i = 0; i < sockets.length; i++) {
					sockets[i].emit(message);
					resetTimer(time, interval);
				}
			}
		}, 1000);
		return interval;
	}
	
	function resetTimer(time, interval) {
		clearInterval(interval);
		time.t = time.o;
	}

<a name='skippoint'></a>
### Future Plans

**Projectiles**

My most immediate task is to add projectile shooting - a simple task with a few issues to think about (I'll flesh these out a lot more in my [next devblog](devblog3):

* Controls and Functionality
* Turn Recording
* Rules/Limitations

**Art/Design/UI/Sound/Music**

Lingering in the back of my mind as I lay awake at night is the horror that soon I'll have to start working on *gasp*... **art**. As I mentioned [last devblog](devblog1), I have no idea where to even start with this and have no meaningful experience or talent of any kind in this area. **But wait! *There's More!*** I completely forgot that music and sound is also incredibly important, so now I have *two* terrifying challenges ahead of me, I can't wait!

*Disclaimer*: ^ that wasn't sarcasm; I've been wanting to try to hone my artistic abilities for a while now, I'm actually *really* excited to get to work on this since up until now I've just been doing code.

