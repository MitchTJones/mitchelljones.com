## Devblog 3 - 10/08/2017
### Shooting
This week I worked on shooting mechanics - they're just a *little* bit important to a shooter game.

<video autoplay loop>
<source src='/projects/dsgame/video/ShootingDemo1.mp4'>
</video>

Oh yeah, and I also fixed that pesky bug seen at the end of the demo from [the last devblog](devblog2) where players float in the air if their turn ends while they are falling - now the turn can exceed 300 frames, but only to complete actions started within the 300, like falling; player control is disabled when the 300 frames are exhausted.

#### Approach
In my mind, there are two fundamentally different ways of approaching the issue of shooting:

* [Spacebar] shoots straight in the direction you're facing (jump is rebound to [W]/[up])

* [Mouseclick] shoots where your cursor is pointing

The second option would give the player more control, but *more* isn't always *better*. I really like the simplicity of the first option and the idea that this can be a mouse-less game - there are too few games that can be played solely on a keyboard.

I plan on revisiting this in the future, especially if the special weapons from [my first devblog](devblog1) end up being implemented. For now, though, I'm going with option 1 for its elegance and simplicity.
#### Implementation
##### Local
In Unity, hitting the spacebar instantiates a 'Projectile' GameObject - just a purple square that moves forward when you tell it to (*Surprise: we tell it to*). It's fired with a speed vector of (10*x* , 0), the x being either 1 or -1 depending on where the player is facing.
<a name='skippoint-shotobject'></a>
A 'Shot' object is also created to record the properties of the shot - this is later sent to the server as part of the turn. The 'Shot' object holds values like what frame the shot was fired on, its initial speed (10*x* , 0) and its type (if I choose to put in different types in the future). The necessity for the 'Shot' object is elaborated on in the next section:

##### Networking
This is where things get tricky. Before this week, the way turns were networked was simply that the player's movements were recorded into an array of Vector2's ([x,y]) and that array was sent to the enemy player when the turns were played.

Initially, I thought to approach shooting the same way, and actually got pretty far with my plan before realizing its stupidity. I created a 'TurnFrame' object that holds two Vector2 arrays - one for the player and one for the player's shot. This method has a multitude of flaws:

* It doubles the amount of data sent to and from the server for turn communications
* There's no effective way of handling if the player decided not to shoot
* There's no effective way of implementing different weapons and bullets in the future

So, I thought, if projectiles behave the exact same way on both clients, don't I just need to send the frame that the player fired along with the original turn Vector2 array, and then when the replay of the turn reaches that frame it fires? This is a big improvement, but there are two issues in that the projectile doesn't know which direction to go (the enemy player object on the client-side is just a red box that gets moved according to the Vector2 array - it has no properties so we don't know where it's facing).

So I settled for a compromise between the two - for now, the 'Turn' object that is sent to the server has two parts: a Vector2 array for the players positions, and the ['Shot' object](#skippoint-shotobject). There's probably a more efficient way of handling this, but this method works great for now.