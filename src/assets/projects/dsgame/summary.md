## Battle Blocks - A Summary

The term has ended, and this is my final recap of what I've worked on. I plan to continue work on this project going forward, fixing the few minor bugs that remain and adding in a ton of new content. I'll try to document this work as best I can in devblogs in the future.

### Table of Contents

* [Summary](#summary)
* [Networking](#summ_networking)
* [The Unity End](#summ_unity)
* [Shooting](#summ_shooting)
	* [Collision](#summ_collision)
* [Art & Design](#summ_artdesign)
* [Map](#summ_map)
* [Music](#summ_music)

### Video Demo

This video shows one round of the game playing out, where the enemy wins the round.

<video autoplay loop>
<source src='/projects/dsgame/video/FinalDemo1.mp4'>
</video>

<a name='summary'></a>
### Summary

Battle Blocks is a melding of the traditional turn-based style of board and card games with the modern shooter video game genre.

Each player is given 20 seconds to play their turn, where they control their character just like a regular game and each of their movements are recorded, but neither player can see what the other player is doing. After 20 seconds, or once both players have voluntarily ended their turns, both characters' turns are played back simultaneously for both of them.

This creates a very interesting dynamic of having to predict your opponent's thoughts, moves and positions. When played in a LAN environment where both players are actually in a room together, it makes for really cool psychological gameplay.

<a name='summ_networking'></a>
### Networking

Having dealt with both uNet and Photon in the past, I decided that Unity's standard networking solutions were simply unecessary for my game. I have no need for latency-free real-time multiplayer in a turn-based game, and I decided that instead of trying to adapt these generic, complex networking solutions to my unique, simple game, I'd be better off simply writing my own networking solution.

I chose [nodejs](https://nodejs.org) and [socket.io](https://socket.io) for their ease of use and also because I'm familiar with both and have used them in the past. I use the [Socket.IO for Unity](https://assetstore.unity3d.com/en/#!/content/21721) plugin to communicate between the Unity client and my node.js server.

##### Networking Challenges

Node.js and Socket.IO use JavaScript, while Unity uses C#. JavaScript is a dynamic language, while C# is a static language, this means that C# is much more structured and strict  than JavaScript, while JavaScript lets you get away with a lot more. In JavaScript, I can write a function that accepts *a variable* as an argument, while in C#, the argument must be an *int*, *string*, *bool*, etc. Because of this difference in languages, there's a lot of decoding to be done on the Unity end. Luckily, Unity does have built-in JSON support, so that helps bridge the gap somewhat and simplify the issue.

The biggest networking hurdle that I had to deal with was one that I've seen a few complaints about on the internet, but I actually couldn't find a single solution. I did, however, manage to figure one out myself.

The issue was extremely weird and circumstantial. Some socket.io messages from the server to the client caused the client to disconnect and continue rapidly reconnecting and disconnecting until either the server or client was closed. After looking through each socket.io message being sent, I isolated that messages sending JS objects were fine, but messages that sent individual variables, like strings or ints, outside of an object, crashed the Unity end. This was a very simple fix once I discovered what the problem was, just changing ```var myVar = 5``` to ```var myVar = {x:5}```.

In a broader sense, I would say that challenges stemming from the multiplayer nature of the game were by far the most time-consuming and frustrating aspects of this project. Having to build and launch multiple instances of the game each time I needed to test some minute change became extremely frustrating.

The first time I tested my game between two computers, it broke spectacularly. Strange issues from different resolution screens, and especially different aspect ratio screens, made UI creation and fullscreen settings quite difficult, while random and unexplained bugs on other computers that I simply couldn't replicate on my own machine became incredibly frustrating.

<a name='summ_unity'></a>
### Managers, Singletons and GameObjects: The Unity End

Unity works on a basis of scenes, GameObjects and scripts.

##### GameObjects

Unity is based around GameObjects. GameObjects can take the form of UI elements, sprites, empties, lights, cameras and shapes.

GameObjects can have attached scripts, which tell the object what to do and when to do it - these are where most of the work goes.

##### Scenes

A Scene is a loadable portion of the game that's almost entirely isolated on its own; my game consists of 3 scenes:

* Main Menu
* Lobby
* Game

##### Managers

To organize everything in my game, I developed a system of "Managers" - GameObjects that control the scene and hold important values that many GameObjects need to access. My game has a Manager for each scene, an overall Manager and a NetworkManager.

The Manager and NetworkManager are something called singletons. This means that only one can exist at a time, it isn't destroyed when a new scene is loaded, and it is accessible universally by every script.

Manager handles things like the Options menu, which is unified throughout every scene; music, which loops consistently and continually throughout the game, and handles the loading and checking of scenes.

<a name='summ_shooting'></a>
### Shooting

##### Local
In Unity, hitting the spacebar instantiates a 'Projectile' GameObject - just a purple square that moves forward when you tell it to (*Surprise: we tell it to*). It's fired with a velocity of (10*x* , 0), the x being either 1 or -1 depending on where the player is facing.

A 'Shot' C# object is also created to record the properties of the shot - this is later sent to the server as part of the turn. The 'Shot' object holds values like what frame the shot was fired on, its initial speed (10*x* , 0) and its type (if I choose to put in different types in the future). The necessity for the 'Shot' object is elaborated on in the next section:

##### Networking
This is where things get tricky. Before this week, the way turns were networked was simply that the player's movements were recorded into an array of Vector2's ([x,y]) and that array was sent to the enemy player when the turns were played.

Initially, I thought to approach shooting the same way, and actually got pretty far with my plan before realizing its glaring problems. I created a 'TurnFrame' object that holds two Vector2 arrays - one for the player and one for the player's shot. This method has a multitude of flaws, like lots of unnecessary data and a lack of versatility in the future.

So, I thought, if projectiles behave the exact same way on both clients, don't I just need to send the frame that the player fired along with the original turn Vector2 array, and then when the replay of the turn reaches that frame it fires? This is a big improvement, but there are two issues in that the projectile doesn't know which direction to go (the enemy player object on the client-side is just a red box that gets moved according to the Vector2 array - it has no properties so we don't know where it's facing).

So I settled for a compromise between the two - for now, the 'Turn' object that is sent to the server has two parts: a Vector2 array for the players positions, and the 'Shot' C# object.

<a name='summ_collision'></a>
#### Collision

Collision is actually one of the main reasons I chose to go with a well-developed engine like Unity instead of a more from-scratch approach. Collision can be incredibly easy or remarkably complicated, depending on how efficient and effective you want it to be. Here's an example of a really simple collision detection check between two rectangles:

	if (rect1.x < rect2.x + rect2.width  &&
		rect1.x + rect1.width > rect2.x  &&
		rect1.y < rect2.y + rect2.height &&
		rect1.height + rect1.y > rect2.y) {
		//collision detected
	}

While this works just fine, it's very inefficient, since the function is being run *every single frame* regardless of any other factors. Even if the two objects are on the opposite side of the screen, we're still checking every frame whether they're colliding, which is unnecessary and inefficient. Unity's collision is developed and advanced to an excellent point of efficiency and effectiveness.

##### Challenges

One challenge with using Unity's collision is that I haven't used any of Unity's other physics mechanics. Player movement and physics are handled by the custom script discussed in [devblog 1](devblog1). Unity's collision, however, is made to work with something called a RigidBody, a component of a GameObject that handles physics. This created some weird issues when I tried to use a collider without a RigidBody.

After playing with a test project I made in Unity for a while, I figured out an effective and simple solution that had little effect on my game's other mechanics. Adding a RigidBody only to the Projectile and then using Unity's [Trigger](https://docs.unity3d.com/ScriptReference/Collider.OnTriggerEnter.html) mechanics instead of its traditional collision mechanics, I could make the projectile the only RigidBody. I then set the Projectile's RigidBody type to *kinematic*, telling it to sit still and not try any physics stuff.

<a name='summ_artdesign'></a>
### Art & Design

First things first: starting the artwork in the last week was a *big* mistake. Luckily, I'm really happy with the results. The first thing I did was open up Adobe Illustrator and did my best to make some characters and terrain:

|![](/projects/dsgame/img/BluePlayer-determined.png)| ![](/projects/dsgame/img/BluePlayer-worried.png)	| ![](/projects/dsgame/img/BluePlayer-dead.png)	|
|:---------------------------------:|:---------------------------------:|:-----------------------------:|
|![](/projects/dsgame/img/RedPlayer-determined.png)	| ![](/projects/dsgame/img/RedPlayer-worried.png)	| ![](/projects/dsgame/img/RedPlayer-dead.png)	|
|![](/projects/dsgame/img/grass-1.png)  			| ![](/projects/dsgame/img/grass-2.png) 			| ![](/projects/dsgame/img/grass-3.png)			|
|![](/projects/dsgame/img/dirt-1.png)  				| ![](/projects/dsgame/img/dirt-2.png) 				| ![](/projects/dsgame/img/dirt-3.png)			|

#### Triangulation
I wasn't super happy with the terrain, and had no idea what to do for a background - so I turned to my favorite art style: low-poly triangulation. I found a few online resources for automatic triangulation like [Trianglify Generator](https://qrohlf.com/trianglify/#gettingstarted), [Halftone Pro](https://www.halftonepro.com) and [DMesh](dmesh.thedofl.com), my favorite for its versatility.

So, using these tools, I was able to turn this:

![](/projects/dsgame/img/bgpre.png)

into this:

![](/projects/dsgame/img/bg.png)

This kind of processing allowed me to really easily vary my sprites. I followed suit with each of my terrain sprites:

![](/projects/dsgame/img/lowpoly/grass1.png) | ![](/projects/dsgame/img/lowpoly/grass2.png) | ![](/projects/dsgame/img/lowpoly/grass3.png)
:---------------------------:|:----------------------------:|:----------------------------:
![](/projects/dsgame/img/lowpoly/stone1.png) | ![](/projects/dsgame/img/lowpoly/stone2.png) | ![](/projects/dsgame/img/lowpoly/stone3.png)
![](/projects/dsgame/img/lowpoly/dirt1.png)  | ![](/projects/dsgame/img/lowpoly/dirt2.png)  | ![](/projects/dsgame/img/lowpoly/dirt3.png)

Ultimately, this triangulation made for a really cool, unified style for my game:

![](/projects/dsgame/img/overall.png)

I also made simple gradient triangulations for the home screen and lobby backgrounds:

![](/projects/dsgame/img/menubg.png)

![](/projects/dsgame/img/lobbybg.png)

Overall, I'm incredibly happy with the way the artwork turned out. I've never really worked on an independent graphic design project, and I've always struggled artistically, but this project allowed me to work with a very simple art-style and still make something that I'm genuinely very proud of.

<a name='summ_map'></a>
### Map

One of my favorite scripts, partially because its functionality is genuinely really cool and partly because it was the only script that actually worked properly on my first try, is my map generation script.

When I started implementing my artwork into my game, I realized that materials are really complicated in Unity and designed to work with 3D games. It's sprites that are designed for 2D. So, after porting everything else in my game over to a Sprite-system, I needed to make individual GameObjects for every square sprite in my terrain. The easiest way to do this was using a script that allowed me to write out my map in a text file, and then have it generate the map on being loaded. This saved me from having to drag and drop individual blocks into place and calculate their positions to line up, and also made map creation and customization an absolute breeze. Since it's a relatively short and reader-friendly script, I'll just show it here:

	public List<TextAsset> maps;
	public int map = 0;
	public GameObject grassPrefab;
	public GameObject dirtPrefab;
	public GameObject stonePrefab;
	public GameObject tiltedDirtPrefab;
	public GameObject tiltedStonePrefab;
	public List<Vector2> spawnPoints;

	public int colNo = 51;
	public int rowNo = 28;

	void Start()
	{
		string[] rows = maps[map].text.Split('\n');
		if (rows.Length != rowNo)
		{
			Debug.LogError("Map Corrupted!");
			return;
		}
		for (int r = 0; r < rowNo; r++)
		{
			string[] row = rows[r].Split(' ');
			for (int c = 0; c < colNo; c++)
			{
				string item = row[c];
				Vector2 coords = new Vector2(c - (colNo / 2), (rowNo-r) - (rowNo / 2));
				switch (item)
				{
					case "1":
						PlaceTile(grassPrefab, coords);
						break;
					case "2":
						PlaceTile(dirtPrefab, coords);
						break;
					case "3":
						PlaceTile(stonePrefab, coords);
						break;
					case ">":
						PlaceTiltedTile(tiltedDirtPrefab, coords, 1,1);
						break;
					case "<":
						PlaceTiltedTile(tiltedDirtPrefab, coords, -1,1);
						break;
					case "[":
						PlaceTiltedTile(tiltedStonePrefab, coords, -1, -1);
						break;
					case "]":
						PlaceTiltedTile(tiltedStonePrefab, coords, 1, -1);
						break;
					case "8":
						spawnPoints.Add(coords);
						break;
					case "9":
						spawnPoints.Add(coords);
						break;
				}
			}
		}
		if (spawnPoints.Count == 2)
		{
			Manager.Instance.gameManager.SetSpawnpoints(spawnPoints.ToArray());
		}
	}

	public GameObject PlaceTile(GameObject prefab, Vector2 loc)
	{
		GameObject tile = Instantiate(prefab, gameObject.transform);
		tile.transform.position = loc;
		return tile;
	}

	public void PlaceTiltedTile(GameObject prefab, Vector2 loc, float xS, float yS)
	{
		GameObject tile = PlaceTile(prefab, loc);
		tile.transform.localScale = new Vector3(xS, yS, tile.transform.localScale.z);
	}

And here's what a map.txt file looks like:

	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	. . . . . . . . . . . . . . . . . < 1 1 > . . . . . . . . . < 1 1 > . . . . . . . . . . . . . . . . .
	. . . . . . . . . . . . . . . . < 2 2 2 2 1 1 1 1 1 1 1 1 1 2 2 2 2 > . . . . . . . . . . . . . . . .
	. . . . . . . . . . . . . . . . 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 . . . . . . . . . . . . . . . .
	. . 1 1 1 > . . . . . . . . . . . . [ 3 3 3 3 3 3 3 3 3 3 3 3 3 ] . . . . . . . . . . . . < 1 1 1 . .
	. . 2 2 2 2 1 1 > . . . . . . . . . . . . [ 3 3 3 3 3 3 3 ] . . . . . . . . . . . . < 1 1 2 2 2 2 . .
	. . [ 3 3 3 3 2 2 > . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . < 2 2 3 3 3 3 ] . .
	. . . . [ 3 3 3 3 ] . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . [ 3 3 3 3 ] . . . .
	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	. . . . . . . . . . . . 1 1 1 1 1 1 1 1 . . . . . . . . . . . 1 1 1 1 1 1 1 1 . . . . . . . . . . . .
	. . . . . . . . . . . . [ 3 3 3 3 3 3 ] . . . . . . . . . . . [ 3 3 3 3 3 3 ] . . . . . . . . . . . .
	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	. . . 1 8 . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . 9 1 . . .
	. . . 2 1 1 1 1 1 1 1 1 > . . . . . . . . . . . . . . . . . . . . . . . . . < 1 1 1 1 1 1 1 1 2 . . .
	. . . [ 3 3 2 2 2 2 2 2 2 1 1 1 1 > . . . . . . . . . . . . . . . < 1 1 1 1 2 2 2 2 2 2 2 3 3 ] . . .
	. . . . [ 3 3 3 2 2 2 2 2 2 2 2 2 2 1 1 1 1 1 1 2 2 2 1 1 1 1 1 1 2 2 2 2 2 2 2 2 2 2 3 3 3 ] . . . .
	. . . . . . [ 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 ] . . . . . .
	. . . . . . . . . [ 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 ] . . . . . . . . .
	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .
	. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .


#### Sprite variance

The way I put my very varied sprites to good use was with a simple sprite randomizer script attached to the prefabs that were instantiated by the MapMaker script above. When each GameObject is instantiated, it chooses a random sprite from the array given to it.

	public List<Sprite> sprites;
	public int index;
	void Start () {
		index = (int)(Random.value * (sprites.Count));
		GetComponent<SpriteRenderer>().sprite = sprites[index];
	}

<a name='summ_music'></a>
### Music

I'm going to conclude with music because it represents the only failure of my project. While the final product does incorporate a really cool music loop, it was mostly worked on by my friend, Ben Dreier. When I sat down with [Bosca Ceoil](https://www.distractionware.com), a simple music making software, it didn't take long to realize that making music is *hard*. Having absolutely no background in music whatsoever and with time running out, I asked my friend Ben for help with making the music; he ended up doing a bulk of the work on the music, and I can't really take credit for it.

Here's a sample of the background loop of music for the game:

<audio controls loop>
  <source src="/projects/dsgame/music/music.wav" type="audio/wav">
Your browser does not support the audio element.
</audio>

### [Reflection](reflection)

^ Click that link to see my concluding reflection on my Directed Study.