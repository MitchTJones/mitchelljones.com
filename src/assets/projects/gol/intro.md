## Conway's Game of Life
Conway's Game of Life is a Cellular Automaton that demonstrates *emergence.* Emergence, in this context, means the emergence of complex properties from simple parts of a system. A really great example of emergence is in animal life on Earth; individual cells are very basic and can't really get a whole lot done on their own, but when you put a bunch of identical cells in a big group together - ***bam!*** - you get a human. Okay, it doesn't quite work like that, but its the general idea that matters. A lot of simple parts can come together to create an incredibly complex whole. Really any matter is also an example of emergence, considering that its all made up of tiny atoms that are *very* simple, and then, going further, even simpler subatomic particles.

[Click here to play my demo](https://mitchtjones.github.io/JS-Game-of-Life/); keep reading if you have no idea what's going on.

### The Game of Life
In Conway's Game, there is a grid of square cells. Each cell has eight neighbors (the cells directly adjacent to it horizontally, vertically, and diagonally), and is either dead or alive (0 or 1, false or true, etc.). All computations done within the system are done by the individual cells. Each cell is capable of looking at its neighbors, counting how many are alive, and reacting with the following set of simple logic:

If a live cell has fewer than two living neighbors, it dies.

If a live cell has more than three living neighbors, it dies.

If a dead cell has exactly three living neighbors, it is revived.

If none of the above are true, the cell retains its current state.

Every cell updates at the same time based on the previous states of its neighboring cells. Each update is called a *generation*.

### So what?
Because Conway's Game of Life is dependent entirely on the very basic capabilities of each cell, any functions outside of those very few listed above are demonstrations of emergence - more complex characteristics developing from the combination of many basic parts. And there are a *lot* of emergent functions in the Game of Life. In fact, theoretically, the Game of Life can perform any function your computer can, because it's "Turing complete" - I'll talk more about that in a bit, though. For now, lets look at some interesting structures we can set up in the Game of Life.

There are three main categories of structure in the Game of Life: Still lifes, which don't do anything; Oscillators, which do funky things but always return to their original state after a set period; and Spaceships, which can move themselves across the grid. Here are a few of the most common structures:

| **Still Lifes** | **Oscillators** | **Spaceships** |
| :---------------------------------:|:---------------------------------:|:-----------------------------:|
| ![](https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Game_of_life_boat.svg/82px-Game_of_life_boat.svg.png) | ![](https://upload.wikimedia.org/wikipedia/commons/9/95/Game_of_life_blinker.gif) | ![](https://upload.wikimedia.org/wikipedia/commons/f/f2/Game_of_life_animated_glider.gif) |
| ![](https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Game_of_life_beehive.svg/98px-Game_of_life_beehive.svg.png) | ![](https://upload.wikimedia.org/wikipedia/commons/1/12/Game_of_life_toad.gif) | ![](https://upload.wikimedia.org/wikipedia/commons/3/37/Game_of_life_animated_LWSS.gif) |
| ![](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/Game_of_life_loaf.svg/98px-Game_of_life_loaf.svg.png) | ![](https://upload.wikimedia.org/wikipedia/commons/1/1c/Game_of_life_beacon.gif) |
| ![](https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Game_of_life_boat.svg/82px-Game_of_life_boat.svg.png) | ![](https://upload.wikimedia.org/wikipedia/commons/0/07/Game_of_life_pulsar.gif) |
| ![](https://upload.wikimedia.org/wikipedia/commons/thumb/3/31/Game_of_life_flower.svg/82px-Game_of_life_flower.svg.png) | ![](https://upload.wikimedia.org/wikipedia/commons/f/fb/I-Column.gif) |

Now that we've gone through the most common basic structures, let's get a little bit more complex. Here's a glider gun - a structure that periodically shoots off gliders. This and gliders themselves are the foundation for a lot of complex structures in Game of Life, and are instrumental in creating logic gates like we talk about in the next section.

![](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Gospers_glider_gun.gif/220px-Gospers_glider_gun.gif)

*(Images from [Wikipedia](https://en.wikipedia.org/wiki/Conway's_Game_of_Life))*

### Turing Completeness
Conway's Game of Life is "Turing Complete" - but what does this actually mean?

"Turing Completeness is the ability for a system of instructions to simulate a Turing Machine" ([Wikipedia](https://en.wikipedia.org/wiki/Turing_machine)). What this means is that, if something is Turing Complete, it is capable of expressing all tasks accomplishable by computers. We know that all a computer can really do is simulate logical gates, like NOT (if true, then false), AND(if all inputs true, then true), and OR (if an input is true, then true). Believe it or not, we can actually simulate any of these logical gates within Conway's Game of Life using gliders as inputs and outputs!

Now, this is where things get complicated and you're probably better off reading about it from people who know a lot more than me - here's a great, pretty easy-to-read [paper on logic gates in Game of Life](http://www.rennard.org/alife/CollisionBasedRennard.pdf).

When you're ready to get your mind absolutely blown, check out a few of my favorite ridiculously cool Game of Life states:

[Digital Clock](https://www.youtube.com/watch?v=3NDAZ5g4EuU)

[Full Turing Machine](https://www.youtube.com/watch?v=DD0B-4KNna8)

And last, but not least, my personal favorite: [Conway's Game of Life in Conway's Game of Life](https://www.youtube.com/watch?v=xP5-iIeKXE8)