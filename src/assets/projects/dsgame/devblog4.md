## Devblog 4 - 11/05/2017

For the past month, I've been working simultaneously on a lot of different parts of the project, so the past three weekends have not produced a presentable product in any way.

Long story short, I've done a *ton* of work all over the place and am very close to the artwork-phase. Here's an example of a round so far:

<video autoplay loop>
<source src='/projects/dsgame/video/CompleteDemo1.mp4'>
</video>

As you can see, shooting works better, collision with players and the world has been implemented, a score system has been added as well as server-side handling of resetting player positions when a round is started.

There are also quite a few bugs that you can see in the video, like the projectile being shot randomly in the bottom right for the right-side player and how the score goes up by two instead of 1 - I'm working on tracking down what's causing these.

I've also worked a lot on optimizing both the server and client-end and worked on the foundation of a spectator system - but that's a little hard to test as I need more than two computers.

### Collision

The most important thing I worked on this month was collision. It took *way* longer than it had any right to but I'm very happy with the result.

#### Approach

Collision is actually one of the main reasons I chose to go with a well-developed engine like Unity instead of a more from-scratch approach. Collision can be incredibly easy or remarkably complicated, depending on how efficient and effective you want it to be. Here's an example of a really simple collision detection check between two rectangles:

	if (rect1.x < rect2.x + rect2.width  &&
	    rect1.x + rect1.width > rect2.x  &&
	    rect1.y < rect2.y + rect2.height &&
	    rect1.height + rect1.y > rect2.y) {
	    //collision detected
	}

While this works just fine, it's very inefficient, since the function is being run *every single frame* regardless of any other factors. Even if the two objects are on the opposite side of the screen, we're still checking every frame whether they're colliding, which is unnecessary and inefficient. Unity's collision is developed and advanced to an excellent point of efficiency and effectiveness.

#### Challenges

One challenge with using Unity's collision is that I haven't used any of Unity's other physics mechanics. Player movement and physics are handled by the custom script discussed in [devblog 1](devblog1). Unity's collision, however, is made to work with something called a RigidBody, a component of a GameObject that handles physics. This created some weird issues when I tried to use a collider without a RigidBody.

After playing with a test project I made in Unity for a while, I figured out an effective and simple solution that had little effect on my game's other mechanics. Adding a RigidBody only to the Projectile and then using Unity's [Trigger](https://docs.unity3d.com/ScriptReference/Collider.OnTriggerEnter.html) mechanics instead of its traditional collision mechanics, I could make the projectile the only RigidBody. I then set the Projectile's RigidBody type to *kinematic*, telling it to sit still and not try any physics stuff.

### Shooting, part 2

While I worked out most of the actual shooting mechanics in [my last devblog](devblog3), there was still some work to be done.

#### Turn Timing

One of the first issues I noticed with shooting was that it messed with the turn timing pretty badly both in the recording and the replaying stage, as both have their end triggered when each player runs out of moves. This means that, if both players complete their movements, the turn would reset and the projectiles wouldn't fully run their course.

To rectify this, I placed obstacles, the same GameObject type that the platformer map is made of, and placed them just out of view of the camera as a border that the projectile would destroy itself on. I then set the end of a turn to also require that all projectiles in the scene had been destroyed, so that all projectiles could run their course until they reach the edge of the game.

Another avenue I considered was Unity's [OnBecameInvisible](https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnBecameInvisible.html) instead of putting borders around the camera, but ultimately decided that the borders would stand to help solve issues in the future like players or other objects falling off the map, and are generally simpler and less likely to cause issues than checking whether the projectiles are being rendered or not.

#### Housekeeping

When I was working on the shooting, I tried to remain consistent with my other player control functions like movement and have the Player object handle shooting. This resulted in a lot of communication to and from the gameManager object to determine stuff like whether the scene was replaying or recording and sending information back and forth about the projectiles.

This became especially complicated once I started working on collision and shooting during the replay, and I decided that it was better to have the gameManager handle all shooting and keep track of all projectiles.

### Spectating

This is a pretty minor feature that might fall by the wayside in the name of other more important features, especially because of how difficult it will be to test. Nonetheless, I think it'd be cool for players who join a server that already has 2 players in it will be able to observe only the replay periods.

I've started work on some of the framework for this on the server-side, but with 2 weeks left until the end of the term, I think that my time will be better spent on more significant parts of the game, like artwork.

*(The remaining devblogs will be consolidated into the [summary](summary))*