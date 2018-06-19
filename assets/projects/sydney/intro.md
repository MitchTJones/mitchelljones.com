## Introduction
For the past few years, those interested in Astronomy have been hearing a lot about "Goldilocks planets," planets that are within the "habitable zone" - the range of distances from a star where planets could have liquid water, a crucial ingredient for life. The first exoplanet within the habitable zone of a sun-like star was Kepler-22b, discovered in part by my advisor and mentor for this project, Professor Tim Bedding.

Recently, discoveries like [TRAPPIST-1](https://en.wikipedia.org/wiki/TRAPPIST-1), a system with 7 Goldilocks planets, have gained a lot of media attention and are often accompanied by pictures like this:

<img src='/projects/sydney/trappist-1_2.jpg' style='width:25% !important;'/>

When, in fact, even the highest resolution pictures we have of this system look like this:

<img src='/projects/sydney/trappist-1.jpg' style='width:25% !important;'/>

*So*, you ask, *how do we know anything about the planets if we can barely see the star??* One answer to this question, and the focus of my project in Sydney, is light curves.

### Light Curves
A light curve is a simple graph that shows the brightness of an object over time. Despite their simplicity, light curves are incredibly powerful tools for Astronomers.

As an example, here's a processed light curve for EPIC 211342524 - one of the stars I worked with in my project.

<img src='/projects/sydney/k2sc-curve.jpg' style='width:25% !important;'/>

As you can see, there are distinct dips with similar depths and periods. These are called transits, and they happen when a planet passes in front of the star, blocking part of its light. Based on the period and the depth, we can tell how close the planet is to its star, how fast it's moving and how big it is.

There are a few different pipelines that analyze and process images of these stars to create the data sets needed to make light curves. The 3 main ones are everest, k2sc and k2sff. My project was to analyze and compare the outputs of each one. The final program that I created - in Python, a new language I had never used before - imported and analyzed data files, outputting specific point data and graphics showing differences visually. I've got a few of these presentation-friendly visual comparisons of filtered light curves for each of the three stars I studied, [EPIC 211342524](EPIC_211342524), [EPIC 211509553](EPIC_211509553) and [EPIC 212521166](EPIC_212521166).