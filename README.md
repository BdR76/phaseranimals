Phaser Animals
==============
This is a html5/javascript test game to see how the general game structure work when using the Phaser framework.

The goal is to have animals moving around in 4 distinct different ways, and a player character moving around and catching the animals.

For more info see:
http://www.html5gamedevs.com/forum/14-phaser/

error accessing sprite
----------------------
There is a Animal constructor but there is an error when accessing the sprite.

At line 106, when setting the frame  
this.sprite.frame = animaltype; // animal frame 0..3  
It gives an error  
Uncaught TypeError: Cannot set property 'frame' of undefined

questions, comments: bdr1976@gmail.com