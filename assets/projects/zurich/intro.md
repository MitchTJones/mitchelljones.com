## Introduction

The Institute of Neuroinformatics is a joint venture between the University of Zürich and ETH Zürich. It is a hugely culturally and intellectually diverse community of global leaders in the study of cortical computation and artificial intelligence.

Funded by my Paul Mellon Scholarship, I spent my two weeks of Senior Spring break in Zürich, Switzerland at INI. During my time, I worked with [Professor Matt Cook](https://www.ini.uzh.ch/people/cook), the leader of INI's Cortical Computation Group, and [Julien Martel](https://www.ini.uzh.ch/people/jmartel), a PhD student specializing in Machine Vision.

#### Cortical Computation

The conventional computers in use today run all of their computations through a powerful centralized processor, which then uses billions of binary transistors to complete these computations very quickly. These devices consume lots of power and aren't very small.

Human and other animal brains are not only *much* more efficient and compact, but are capable of learning, reasoning, and original thought. Rather than having a very complex central processor through which all computation is done, animal brains have billions of simple ones, called neurons, which can't do much on their own, but form the basis of conciousness when combined together.

The goal of the Institute of Neuroinformatics, put simply, is to create and study "neuromorphic" machines - computers that work more similarly to animal brains. The possibilities created by such devices are incredible. These devices are much more efficient and modular, and open the door for much more advanced machine learning, artificial intelligence, and vision applications.

#### Machine Vision

Traditional cameras scan their subject over a very short span of time and produce an single-frame image. This can be useful in many scenarios, but it's horribly ineffective for capturing most of the important information about a scene. Traditional images are incapable of properly capturing depth, motion, accurate luminosity, and a bunch of other important data that humans and other animals *can* understand about what we see. Images are a "high-level" simplification of what we receive as visual input - we really see a whole lot more.

The eye doesn't work like a camera. Retinal cones in your eyes are sensitive to photons, and send data to your brain when they receive input. Your brain then uses this data to understand the world around it and, eventually, show you what appears to be an image. [Julien Martel](https://www.ini.uzh.ch/people/jmartel), the student that I worked most closely with at the Institute of Neuroinformatics, has spent his time there developing "unconventional" sensors, often based on animal biology, that give machines much more data about the world around them than traditional cameras are capable of.

##### Event-based sensors, liquid lenses, and neuromorphic cameras

The first and, in my opinion, most interesting vision sensor I was allowed to get my hands on at the Institute of Neuroinformatics was an "event camera". While regular cameras open and close, and then create an image from what they saw while the shutter was open, event-based sensors remain always "open," and report any change in luminosity that they detect; they work very similarly to the human eye. What this means is: by moving the camera around and seeing which pixels change and which stay the same, we can see the edges of objects. Also, by seeing the differences in the way certain objects move, it can determine depth. Already, the sensor is able to provide data that allows us to distinguish objects with edges, understand motion, and see depth. With the understanding of luminosity, depth, and motion that these cameras are able to provide, we can extrapolate almost any piece of information we need about a scene, and much more effectively reconstruct our scene for our machine to understand. [Here](http://rpg.ifi.uzh.ch/research_dvs.html) are some more interesting and in-depth demonstrations of what I'm talking about from the Institute's website.

Other unconventional vision sensors I got to play with included [the use of a liquid lense for depth perception](http://ieeexplore.ieee.org/abstract/document/8050715/), a "neuromorphic" camera using local update rules for each pixel to accurately measure luminosity, and a two-eyed, laser-firing camera demon.