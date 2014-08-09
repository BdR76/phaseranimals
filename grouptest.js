// examples taken from:
// http://gamemechanicexplorer.com/#homingmissiles-5

// -------------------------------------
// START THE GAME
// -------------------------------------
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var ANIMAL_COUNT = 20;
var MOVE_SPEED = 2;
var SPRITE_SIZE = 80;
var SPRITE_HALF = 40;

var game = new Phaser.Game(CANVAS_WIDTH, CANVAS_HEIGHT, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, update: update, render: render });

var player;
var animalsGroup;
var cursors;

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
	player = new Player(game);
	game.world.add(player);

	// add controls to play the game
	cursors = game.input.keyboard.createCursorKeys();

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
			animal = new Animal(game, x, y, antype);
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
	if (animal.frame == 0) {console.log('Catch animal: elephant')};
	if (animal.frame == 1) {console.log('Catch animal: giraffe')};
	if (animal.frame == 2) {console.log('Catch animal: crocodile')};
	if (animal.frame == 3) {console.log('Catch animal: ape')};
	animal.kill();
}

// -------------------------------------
// PLAYER OBJECT
// -------------------------------------
// player constructor
var Player = function(pgame) {
	//this.sprite = pgame.add.sprite((CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 2), 'zookeeper');
	Phaser.Sprite.call(this, pgame, (CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 2), 'zookeeper');

	this.frame = 4; // frame with zookeeper
	this.anchor.setTo(0.5, 0.5);

	// enable physics for player
	pgame.physics.enable(this, Phaser.Physics.ARCADE);
}

// Specific JavaScript object/construcor stuff going on here(?)
// Player is a type of Phaser.Sprite
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

// player update and input
Player.prototype.update = function() {
	// player moves twice as fast as animals
	if (cursors.up.isDown)    {this.y = this.y - MOVE_SPEED*2;};
	if (cursors.down.isDown)  {this.y = this.y + MOVE_SPEED*2;};
	if (cursors.left.isDown)  {this.x = this.x - MOVE_SPEED*2;};
	if (cursors.right.isDown) {this.x = this.x + MOVE_SPEED*2;};
}

// -------------------------------------
// ANIMAL OBJECT
// -------------------------------------
// animal constructor
var Animal = function(pgame, x, y, animaltype) {
	//this.sprite = pgame.add.sprite((CANVAS_WIDTH / 2), (CANVAS_HEIGHT / 2), 'zookeeper');
	Phaser.Sprite.call(this, pgame, x, y, 'zookeeper');
	
	// set animal fields
	this.xspeed = 1;
	this.yspeed = 1;
	this.AnimalType = animaltype;

	// Note: Animal extend the Sprite class so we can access Sprite.frame directly here
	this.frame = animaltype; // animal frame 0..3
	
	// enable physics for animal
	pgame.physics.enable(this, Phaser.Physics.ARCADE);
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
				if (this.x+SPRITE_HALF > player.x) {this.x = this.x + MOVE_SPEED;};
				if (this.x+SPRITE_HALF < player.x) {this.x = this.x - MOVE_SPEED;};
				if (this.y+SPRITE_HALF > player.y) {this.y = this.y + MOVE_SPEED;};
				if (this.y+SPRITE_HALF < player.y) {this.y = this.y - MOVE_SPEED;};
				// don't move outside screen bounds
				if (this.x < 0)                {this.x = 0};
				if (this.x > CANVAS_WIDTH-80)  {this.x = CANVAS_WIDTH-80};
				if (this.y < 0)                {this.y = 0};
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
