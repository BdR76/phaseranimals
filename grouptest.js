// examples taken from:
// http://gamemechanicexplorer.com/#homingmissiles-5

// -------------------------------------
// START THE GAME
// -------------------------------------
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var ANIMAL_COUNT = 20;
var ANIMAL_SPEED = 2;

var game = new Phaser.Game(CANVAS_WIDTH, CANVAS_HEIGHT, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var player;
var animalsGroup;

// -------------------------------------
// PHASER GAME FUNCTIONS
// -------------------------------------
function preload() {
	game.load.spritesheet('zookeeper', 'zookeeper.png', 80, 80);
}

function create() {
	// arcade physics
	game.physics.startSystem(Phaser.Physics.ARCADE);

	// blue background
	game.stage.backgroundColor = 0xbada55;

	//  The hero!
	player = game.add.sprite((CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 2), 'zookeeper');
	player.frame = 4; // frame with zookeeper
	player.anchor.setTo(0.5, 0.5);
	game.physics.enable(player, Phaser.Physics.ARCADE);

	//  The animals!
	animalsGroup = game.add.group();
	animalsGroup.enableBody = true;
	animalsGroup.physicsBodyType = Phaser.Physics.ARCADE;

	createSomeAnimals();	
}

function update() {
	//  Run collision
	game.physics.arcade.overlap(animalsGroup, player, playerHitsAnimal, null, this);
}

function render() {
	// for (var i = 0; i < animalsGroup.length; i++)
	// {
	//	 game.debug.body(animalsGroup.children[i]);
	// }
}

// -------------------------------------
// GAME LOGIC
// -------------------------------------
function createSomeAnimals () {

	for (var i = 0; i < ANIMAL_COUNT; i++)
	{
		// which type of animal 0..3
		var antype = (i % 4); // i modulo 4, will cycle through values 0..3 
		// random position
		var x = game.rnd.integerInRange(0, CANVAS_WIDTH-80);
		var y = game.rnd.integerInRange(0, CANVAS_HEIGHT-80);
		
		// get inactive animal from animals object pool
		var animal = this.animalsGroup.getFirstDead();

		// if there aren't any available, create a new one
		if (animal === null) {
			animal = new Animal(this.game, x, y, antype);
			this.animalsGroup.add(animal);
		};

		// else revive the animal (set it's alive property to true)
		animal.revive();
		animal.x = x;
		animal.y = y;
		animal.AnimalType = antype;
	};
}

function playerHitsAnimal (player, animal) {
	//  player hits an animal, remove the animal
	animal.kill();
}

// -------------------------------------
// ANIMAL OBJECT
// -------------------------------------
// animal constructor
var Animal = function(game, x, y, animaltype) {
	//this.sprite = game.add.sprite((CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 2), 'zookeeper');
	Phaser.Sprite.call(this, game, x, y, 'zookeeper');
	
	// set animal fields
	this.xspeed = 1;
	this.yspeed = 1;
	this.AnimalType = animaltype;

	// Note: Animal extend the Sprite class so we can access Sprite.frame directly here
	this.frame = animaltype; // animal frame 0..3
	
	// enable physics for animal
	game.physics.enable(this, Phaser.Physics.ARCADE);
}

// Specific JavaScript object/construcor stuff going on here(?)
// Animals are a type of Phaser.Sprite
Animal.prototype = Object.create(Phaser.Sprite.prototype);
Animal.prototype.constructor = Animal;

// animal update move around
Animal.prototype.update = function() {
	// If this animal is disabled then don't do anything
	if (this.alive) {
		// move animals around
		switch (this.AnimalType) {
			case 0: // not moving
				break;
			case 1: // move away from player
				if (this.x > this.game.input.activePointer.x) {this.x = this.x + ANIMAL_SPEED;};
				if (this.x < this.game.input.activePointer.x) {this.x = this.x - ANIMAL_SPEED;};
				if (this.y > this.game.input.activePointer.y) {this.y = this.y + ANIMAL_SPEED;};
				if (this.y < this.game.input.activePointer.y) {this.y = this.y - ANIMAL_SPEED;};
				// don't move outside screen bounds
				if (this.x < 0)			       {this.x = 0};
				if (this.x > CANVAS_WIDTH-80)  {this.x = CANVAS_WIDTH-80};
				if (this.y < 0)			       {this.y = 0};
				if (this.y > CANVAS_HEIGHT-80) {this.y = CANVAS_HEIGHT-80};
				break;
			case 2: // move left-right
				this.x = this.x + this.xspeed;
				// move in opposite direction when on screen bounds
				if ( (this.x < 0) || (this.x > CANVAS_WIDTH-80) ) {this.xspeed = -1 * this.xspeed;};
				break;
			case 3: // move all over screen
				this.x = this.x + this.xspeed;
				this.y = this.y + this.yspeed;
				// move in opposite direction when on screen bounds
				if ( (this.x < 0) || (this.x > CANVAS_WIDTH-80)  ) {this.xspeed = -1 * this.xspeed;};
				if ( (this.y < 0) || (this.y > CANVAS_HEIGHT-80) ) {this.yspeed = -1 * this.yspeed;};
				break;
		};
	};
}
