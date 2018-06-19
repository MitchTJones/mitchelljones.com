## Devblog 1 - 09/24/2017

Since this is the first weekly devblog for a game that I've been working on for much more than a week, it'll serve as a sort of introduction and be much longer than these will be in the future.

### Introduction

Welcome to the *[insert clever and catchy game title here]* developer blog! Here's the basic premise of the game:

This project explores a combination of the turn-based strategy of classic games like Chess and video games like Pokémon and Hearthstone with the generic "shoot 'em up" genre that has dominated gaming since its inception.

### Game Design and Mechanics

*Okay...*, you say, *cool idea*

I agree...

*but how does it work?*



There is a 30-45 second period (I haven't decided yet) for each player to play their turn. During this period, neither player can see what the other is doing. Each turn is 300-600 (again, haven't decided) *frames* recorded and played at 60 FPS (5-10 seconds). If you decide you don't like your turn, you can reset and re-record it at any point during the 30-45 second prep period. Once either the time runs out or both players voluntarily end their prep periods, both turns will be played simultaneously for both players. The timers reset and this process repeats itself over and over.

*Okay......*

oh no, that's more dots than before

*but how does a player win?*

So this is one I haven't thought quite as much about. Obviously, in accordance with the "shoot 'em up" genre, you win by killing the other player. The problem with this concept is the same problem that's plagued the world for millenia: there are *a lot* of ways to kill people. The simplest solution and the one that I'm going with for the moment is that each player gets 1 shot per turn and if a player is hit they die immediately, increasing the killer's score and resetting the round.

In the future, however, there are a lot more possibilities to explore:

* An hp system, where it takes multiple shots to kill someone. Hitting certain body parts like headshots would deal more damage
* An armor system, where you have to shoot off the enemy's body armor before you can hit them
* Different guns
	* A sniper, which deals more damage (if using an hp system) and is very accurate but can only fire once every two turns.
	* A shotgun, which fires a random spray of bullets that deal little damage each.
	* An assault rifle, which fires in bursts of 3 or so, but has recoil and is less accurate
	* An SMG, which full-auto fires a volley of somewhat innacurate, low damage bullets
	* A machine gun that takes a turn to be set up and needs to be set up again if moved, but fires many rounds per turn and still hits hard
	* Could also be a stationary item in the map that can be 'mounted' (for lack of a better word)
Something like the shotgun would be ridiculously strong in the 1-hit-kill setup, and the sniper would be too weak, but the machine gun and assault rifle could be interesting.

Another thing to think about is the appropriateness of the game. While games like Battlefield and Call of Duty are bestsellers, their markets are severely limited by the high age-rating on their games. Games like Splatoon are "shoot 'em up" style games that are specifically targeted at attracting that younger audience that isn't allowed to play more mature games. There are also some middle-of-the-road games, like the incredibly successful Overwatch, which has human characters and shows them dying, but never shows any blood or actually uses the words "die" or "kill," preferring words like "eliminate." Right now, I'm leaning towards the side of a more appropriate, less violent game - expecially since this is a school project. I'm not sure I'd like to go as far as Splatoon specifically for the low maturity audience, and I feel like something just a little below Overwatch on the scale of appropriateness would be great, as I think Splatoon's ridiculousness takes away from the game a bit.

### Player Movement
Instead of using Unity's built-in player controller scripts, I've decided to adapt mine from the simpler and more customizable scripts from [Sebastian Lague's 2D Platformer Tutorial Series](https://www.youtube.com/watch?v=MbWK8bCAU2w). I chose this controller for it's effectiveness in dealing with climbing and descending slopes, as well as it's customizability, which has enabled me to make numerous adaptations and changes to Sebastian's robust base. I won't go into too much detail on this point as you can get all the information you need from the link above.

<video autoplay loop><source src='/projects/dsgame/video/PlayerControllerDemo.mp4'></video>

(The red lines are just for debugging collision, they will not appear in the final product)

### Networking
Having dealt with both uNet and Photon in the past, I decided that Unity's standard networking solutions were simply unecessary for my game. I have no need for latency-free real-time multiplayer in a turn-based game, and I decided that instead of trying to adapt these standard, complex networking solutions to my unique, simple game, I'd be better off simply writing my own networking solution.

I chose [nodejs](https://nodejs.org) and [socket.io](https://socket.io) for their ease of use and also because I'm familiar with both and have used them in the past. I use the [Socket.IO for Unity](https://assetstore.unity3d.com/en/#!/content/21721) plugin to communicate between the Unity client and my node.js server.

**Challenges**

I very quickly realized that the most prominent issue in my networking plan was the communication between Node.js (JavaScript) and Unity (C#). JavaScript is a dynamic language, while C# is a static language. C# is a much more structured and strict language than JavaScript, while JavaScript lets you get away with a lot more. In JavaScript, I can write a function that accepts *a variable* as an argument, while in C#, the argument must be an *int*, *string*, *bool*, etc. Because of this difference in languages, there's a lot of decoding to be done on the Unity end. Luckily, Unity does have built-in JSON support, so that helps bridge the gap somewhat and simplify the issue.

**Goals**

The server really only serves to accomplish a few basic tasks:

* Exchange information between the players (usernames, plays, etc.)
* Start and stop the game and individual turns appropriately
* Keep track of score
* Light anti-cheat functionality

The most advanced and difficult of these tasks by far is the anti-cheat. The server should be able to spot suspicious activity (too many frames in a turn, player moving too fast, only one client registered bullet hit, etc.) and react appropriately, either by booting the offending player from the game or simply remedying the effects of their cheating. The issue of bullet hit registration is probably the trickiest in this category. One of the advantages of using uNet would have been that it uses Unity's engine and can calculate collisions authoritatively. Hopefully, since my game is only 2D, I should be able to do some basic calculations on the server-end should something go wrong, but ideally both clients would report the bullet hit and the server wouldn't have to do any extra work.

### Graphics, UI and other Artwork
Art and Design is an integral part of any software - regardless of how great your code is, if the user can't effectively interact with it, it's useless. Unfortunately, I have little to no experience with art and design of any kind, and really don't know where to even start here. This will probably be the most challenging aspect of this project for me.

**Challenges**

I don't know the first thing about graphic design. I also don't know the first thing about artwork. I don't even have an idea for the aesthetic or theme of my game's art! At this point, it could be a sci-fi shooter with plasma rifles, and it could just as easily become a cowboy-western game with shotguns and revolvers. Hell, I could have the characters not be human at all.

**Goals**

My goal is to have a polished, responsive UI and unique, custom artwork and visuals. I want to create all of the art myself and try to be as unique as possible - that is, not tracing other people's sprites from DeviantArt or downloading characters from the Unity Asset Store.