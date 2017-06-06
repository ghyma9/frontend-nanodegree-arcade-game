
// Generate a random interger number between two numbers
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Find an enemy in the enemy array in order to avoid more than one enemy in
// a position.
function findEnemy(enemies, newenemy) {
    var rval = false;

    if (enemies.length === 0) {
        return rval;
    }

    enemies.forEach(function(enemy) {
        if (newenemy.col === enemy.col && newenemy.row === enemy.row) {
            rval = true;
        }
    });

    return rval;
};

/********************************************************
 *                         ENEMY
 *********************************************************/

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.originalCol = -getRandomInt(2, 20);    // Generate random column position
    this.originalRow = getRandomInt(1, 3);      // Generate random row position
    this.imgHeight = 83;
    this.imgWidth = 101;
    this.originalX = this.originalCol * this.imgWidth;
    this.col = this.originalCol;
    this.row = this.originalRow;
    this.x = this.originalX;
    this.y = this.row * this.imgHeight;
    this.totalDistance = window.maxCols * this.imgWidth;    // Distance cross the canvas
    this.travelTime = getRandomInt(2, 5);  // Time in seconds - travel accross the canvas
    this.speed = this.totalDistance / this.travelTime;  // Speed of enemy

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += Math.floor(this.speed * dt);
    this.y = this.row * this.imgHeight;
    if (this.x > window.maxCols * this.imgWidth) {
        this.x = this.originalX;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/********************************************************
 *                         PLAYER
*********************************************************/

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

var Player = function() {
    this.row = window.maxRows - 1;
    this.col = Math.floor(window.maxCols / 2);
    this.x = this.col * 101;
    this.y = this.row * 83;

    this.sprite = 'images/char-boy.png';
};

Player.prototype.handleInput = function(keyMove) {
    var colMove = 0;
    var rowMove = 0;

    if (window.run === false) {
        return;
    }

    if (keyMove === "up") {
        if (this.row > 0) rowMove = -1;
    }
    else if (keyMove === "down") {
        if (this.row < window.maxRows - 1) rowMove = 1;
    }
    else if (keyMove === "right") {
        if (this.col < window.maxCols - 1) colMove = 1;
    }
    else if (keyMove === "left") {
        if (this.col > 0) colMove = -1;
    }

    if (colMove === 0 && rowMove === 0) {
        return;
    }

    this.col += colMove;
    this.row += rowMove;
    this.update();
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Player.prototype.update = function() {
    this.x = this.col * 101;
    this.y = this.row * 83;
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
var player = new Player();

// Generate a number of enemyies saved in allEnemies array.
function generateEnemies() {
    var numEnemies = window.totalEnemies;
    var enemy;
    var count = 0;

    if (allEnemies.length > 0) {
        allEnemies.splice(0, allEnemies.length);
    }
    while (count < numEnemies) {
        enemy = new Enemy();
        if (findEnemy(allEnemies, enemy) === false) {
            allEnemies.push(enemy);
            count++;
        }
    }
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
