/*
  Code modified from:
  http://www.lostdecadegames.com/how-to-make-a-simple-html5-canvas-game/
  using graphics purchased from vectorstock.com
*/

/* Initialization.
Here, we create and add our "canvas" to the page.
We also load all of our images. 
*/


let canvas;
let ctx;

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 500;
canvas.style.border = "thick solid #66b3ff";
document.body.appendChild(canvas);

let bgReady, heroReady, monsterReady, obstacle1Ready, obstacle2Ready ;
let bgImage, heroImage, monsterImage, obstacle1Image, obstacle2Image ;

//Add background music to the game
document.addEventListener('click', musicPlay);
function musicPlay() {
    document.getElementById('myAudio').play();
    // document.removeEventListener('click', musicPlay);
}

function loadImages() {
  bgImage = new Image();
  bgImage.onload = function () {
    // show the background image
    bgReady = true;
  };
  bgImage.src = "images/ocean-background.jpg";

  heroImage = new Image();
  heroImage.onload = function () {
    // show the hero image
    heroReady = true;
  };
  heroImage.src = "images/mermaid.png";

  monsterImage = new Image();
  monsterImage.onload = function () {
    // show the monster image
    monsterReady = true;
  };
  monsterImage.src = "images/fish-1.png";

  obstacle1Image = new Image();
  obstacle1Image.onload = function () {
    // show the obstacle image 1
    obstacle1Ready = true;
  };
  obstacle1Image.src = "images/obstacle-1.png";

  obstacle2Image = new Image();
  obstacle2Image.onload = function () {
    // show the obstacle image 2
    obstacle2Ready = true;
  };
  obstacle2Image.src = "images/obstacle-2.png";
}

/** 
  Setting up our characters.
  Note that heroX represents the X position of our hero.
  heroY represents the Y position.
  We'll need these values to know where to "draw" the hero.
  The same applies to the monster.
*/

let heroX = canvas.width / 2; //X position of hero  
let heroY = canvas.height / 2; // Y position of hero

// let monsterX = 100; //X position of monster
// let monsterY = 100; //Y position of monster

let monsterX = Math.floor((Math.random() * canvas.width - 100)); //X position of monster
let monsterY = Math.floor((Math.random() * canvas.height - 100)); //Y position of monster
 
// Speed and direction movement of monster
let monsterSpeed = 5;
let monsterDirectionX = 1;
let monsterDirectionY = 1;

// Position of obstacle1 and obstacle2
let obstacle1X = Math.floor((Math.random() * canvas.width - 100)); //X position of obstacle1
let obstacle1Y = Math.floor((Math.random() * canvas.height - 100)); //Y position of obstacle1
let obstacle2X = Math.floor((Math.random() * canvas.width - 100)); //X position of obstacle2
let obstacle2Y = Math.floor((Math.random() * canvas.height - 100)); //Y position of obstacle2


/** 
 * Keyboard Listeners
 * You can safely ignore this part, for now. 
 * 
 * This is just to let JavaScript know when the user has pressed a key.
 */
let keysDown = {};

function setupKeyboardListeners() {
  // Check for keys pressed where key represents the keycode captured
  // For now, do not worry too much about what's happening here. 
  addEventListener("keydown", function (key) {
    keysDown[key.keyCode] = true;
  }, false);

  addEventListener("keyup", function (key) {
    delete keysDown[key.keyCode];
  }, false);
}


/**
 *  Update game objects - change player position based on key pressed
 *  and check to see if the monster has been caught!
 *  
 *  If you change the value of 5, the player will move at a different rate.
 */

/** 38 is keycode of arrowUp;
   40 is keycode of arrowDown;
   37 is keycode of arrowLeft;
   39 is keycode of arrowRight;
*/

let score = 0;
let previousTime = 0;
let time = 0;

//Setting up timer
let count = 30;
let finished = false;
// timer interval is every second (1000 = 1s)
let timer = setInterval(countingTime, 1000);

function countingTime(){
  count--; // countown by 1 every second
  // when counter reaches 0 clear the timer, hide monster and
  // hero and finish the game
    if (count <= 0)
    {
      // stop the timer
       clearInterval(countingTime);
       // set game to finished
       finished = true;
       count = 0;
       // hide monster and hero
      //  monsterReady = false;
       heroReady = false;
    }
}

let startTime = Date.now();
let roundStartTime = Date.now();
// let roundTime = 0;

// Update time spent on playing.
function updateTime() {
  let currentTime = Date.now();
  time = Math.floor((currentTime - startTime) / 1000);
}

// Movement direction of heroX
let obstacle1DirectionX = 1;
let obstacle1DirectionY = 1;
let obstacle2DirectionX = 1;
let obstacle2DirectionY = 1;

let update = function () {
    if (38 in keysDown) { // Player is holding up key
      heroY -= 5; //
    }
    if (40 in keysDown) { // Player is holding down key
      heroY += 5;
    }
    if (37 in keysDown) { // Player is holding left key
      heroX -= 5;
    }
    if (39 in keysDown) { // Player is holding right key
      heroX += 5;
    }

    // Movement of monster
    if(monsterX + 40 >canvas.width || monsterX <= 0) {
      monsterDirectionX = monsterDirectionX * -1;
    }
    monsterX += (monsterSpeed * monsterDirectionX);
    
    if(monsterY + 40 > canvas.height || monsterY <= 0) {
      monsterDirectionY = monsterDirectionY * -1;
    }
    monsterY += (monsterSpeed * monsterDirectionY);

    // Check if player and monster collided. Our images
    // are about 40 pixels big.

    if (
      heroX <= (monsterX + 40) &&
      monsterX <= (heroX + 40) &&
      heroY <= (monsterY + 40) &&
      monsterY <= (heroY + 40)
    ) {
      // Pick a new location for the monster.
      // Note: Change this to place the monster at a new, random location.
      // Also update score.
      monsterX = Math.floor(Math.random() * canvas.width);
      monsterY = Math.floor(Math.random() * canvas.height);
      score = score + 1;
      roundStartTime = Date.now();
    }

    if (
      heroX <= (obstacle1X + 40) &&
      obstacle1X <= (heroX + 80) &&
      heroY <= (obstacle1Y + 40) &&
      obstacle1Y <= (heroY + 80)
    ) {
      // Pick a new location for the hero whenever hero reaches obstacle1
      obstacle1DirectionX = obstacle1DirectionX * -1;
      heroX += (100 * obstacle1DirectionX); 
      obstacle1DirectionY = obstacle1DirectionY * -1;
      heroY += (100 * obstacle1DirectionY); 
    }

    if (
      heroX <= (obstacle2X + 40) &&
      obstacle2X <= (heroX + 80) &&
      heroY <= (obstacle2Y + 40) &&
      obstacle2Y <= (heroY + 80)
    ) {
      // Pick a new location for the hero whenever hero reaches obstacle2 
      obstacle2DirectionX = obstacle2DirectionX * -1;
      heroX += (100 * obstacle2DirectionX); 
      obstacle2DirectionY = obstacle2DirectionY * -1;
      heroY += (100 * obstacle2DirectionY); 
    }

    if (score >= 3 && score <10) {
      monsterImage.src = "images/fish-2.png";
    }
    if (score > 10 && score <20) {
      monsterImage.src = "images/fish-3.png";
    }

    //The hero will not move out side of the canvas
    if (heroX >= canvas.width) {
      heroX = 0;
    }
    if (heroX < 0) {
      heroX = canvas.width;
    }
    if (heroY >= canvas.height) {
      heroY = 0;
    }
    if (heroY < 0) {
      heroY = canvas.height;
    }
};

    /**
     * This function, render, runs as often as possible.
     */
    let render = function () {
      if (bgReady) {
        ctx.drawImage(bgImage, 0, 0, 800, 500);
      }
      if (heroReady) {
        ctx.drawImage(heroImage, heroX, heroY, heroImage.width = 40, heroImage.height = 40);
      }
      if (monsterReady) {
        ctx.drawImage(monsterImage, monsterX, monsterY, monsterImage.width = 40, monsterImage.height = 40);
      }
      if (obstacle1Ready) {
        ctx.drawImage(obstacle1Image, obstacle1X, obstacle1Y, obstacle1Image.width = 80, obstacle1Image.height = 80);
      }
      if (obstacle2Ready) {
        ctx.drawImage(obstacle2Image, obstacle2X, obstacle2Y, obstacle2Image.width = 80, obstacle2Image.height = 80);
      }
      ctx.font = "20px Arial";
      ctx.fillText(`Your score: ${score}`, 10, 50);
      ctx.fillText(`Time spend: ${time} seconds`, 10, 80);
      ctx.fillText(`Time left per round: ${count} seconds`, 10, 110);

      if(finished==true){
        ctx.fillStyle = 'black';
        ctx.font = "40px Arial";
        ctx.fillText("Game over!", 170, 220);
        clearInterval(timer);
      }
    };

    /**
     * The main game loop. Most every game will have two distinct parts:
     * update (updates the state of the game, in this case our hero and monster)
     * render (based on the state of our game, draw the right things)
     */
    var main = function () {
      updateTime();
      update();
      render();
      // Request to do this again ASAP. This is a special method
      // for web browsers. 
      if (score < 20) {
        requestAnimationFrame(main);
      }
      if (score >= 20) {
        ctx.font = "30px Arial";
        ctx.fillText('Wow, it took this long to catch 20 of us! :D', 10, canvas.height / 2);
      }
    };

    // Cross-browser support for requestAnimationFrame.
    // Safely ignore this line. It's mostly here for people with old web browsers.
    var w = window;
    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    // Let's play this game!
    loadImages();
    setupKeyboardListeners();
    main();