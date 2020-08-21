### Interstellar

I had a friend who was struggling to understand how orbits work, and my explanation ended up evolving into this little visualization.

3 'stars' and 100 'planets' are created at random coordinates on the screen with no forces or speeds whatsoever. Planets have a random radius between 1 and 15 pixels, and stars between 50 and 80.

Mass is calculated based on radius assuming density as 1 (so basically just volume). Gravity is calculated with the basic equation (G*M*m)/r^2, but I made up my own gravitational constant because the real one was really slow and you can do that kind of stuff in a computer simulation.

Nothing else is done, no external forces are added, just gravity is calculated and applied between every object in the scene, and things like orbits naturally develop (and also sometimes even binary stars that orbit around each other!)

**Controls:**

*'+' and '-'* : zoom in and out *(If not working, click on the gray area then try again)*

***(click on the gear in the top right)***

*Reset button* : re-run the simulation

*Slider* : adjusts gravity level; bottom is no gravity, top is 2x gravity

<center><iframe style='width:50vw;height:30vw;' src='/projects/js/gravity.html'></iframe></center>
<center><a href='/projects/js/gravity.html'>Full Page</a></center>