//TODO

//Create bat                  done   .
//Move bat using keyboard     done   .
//Create ball                 done   .
//Move ball                   done   https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Bounce_off_the_walls
//Let ball bounch             done   https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Bounce_off_the_walls
//Create collision on wall    done   https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Bounce_off_the_walls
//Make use of object          done
//Create collision on bat     open
//Create blocks               open
//Remove blocks               open
//Create collision on blocks  open
//Create score                open
//Create menu                 open
//Create levels               open


// http://stackoverflow.com/questions/11368477/dynamically-resize-canvas-window-with-javascript-jquery
// https://scotch.io/tutorials/default-sizes-for-twitter-bootstraps-media-queries

//Help for collision detection 
// ? https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection

//   var boxes = [];
//   //Box object to hold data for all drawn rects
//   function Box() {
//     this.x = 0;
//     this.y = 0;
//     this.w = 1; // default width and height?
//     this.h = 1;
//     this.fill = '#444444';
//   }
// 


$( document ).ready(function() {

  var canvas  = document.getElementById('gameCanvas');
  var ctx     = canvas.getContext('2d');

  var ballRadius  = 10;
  var ballX       = canvas.width/2;
  var ballY       = canvas.height-60;
  var dx          = 2;
  var dy          = -2;

  var batW        = 100;                          //Width of the bat
  var batY        = 550;                          //Pos Y of the bat. Always 550px in this case;
  var batX        = (canvas.width/2) - (batW/2);  //Pos X of the bat, starting point. Center of the canvas
  var batS        = 5;                            //Speed of the bat movement

  var bat         = null;
  var ball        = null;

  //Init the game. Set default values
  init();

  //Run the game
  console.log('Running game');


  //The game loop
  setInterval(run, 10);


  //Functions we can use
  //Draw some debug information
  function drawDebug() {
    $('#data-bat-x').text(batX);
    $('#data-bat-y').text(batY);
    $('#data-ball-x').text(ballX);
    $('#data-ball-y').text(ballY);
    $('#key').text(key);
  }

  function init() {

    console.log('Init game');

    bat = new objectBat();
    if (!bat) {
      console.log('ERROR: Unable to create bat object');
    }
    bat.init(batX, batY, batW, batS, 'black', 'white');

    ball = new objectBall();
    if (!ball) {
      console.log('ERROR: Unable to create ball object');
    }
    ball.init(ballX, ballY, ballRadius, '#0095DD', dx, dy);
    ball.changeXSpeed(dx);
    ball.changeYSpeed(dy);
   
  }


  function run() {
    collision();

    bat.changePosition(batX, batY);
    ball.changePosition(ballX, ballY);

    getInput();

    draw();
  }

  function draw() {

    //Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ball.draw();
    bat.draw();

    if ($('#debug').is(':checked') === true) {
      drawDebug();
    }

  }

  function getInput() {

    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

    if (Key.isDown(Key.UP))    batS = bat.changeSpeed(1.1);  //this.moveUp();
    if (Key.isDown(Key.LEFT))  bat.changePosition(bat.batX - bat.batS, bat.batY);   //this.moveLeft();
    if (Key.isDown(Key.DOWN))  bat.changeWidth(200);                                //this.moveDown();
    if (Key.isDown(Key.RIGHT)) bat.changePosition(bat.batX + bat.batS, bat.batY);   //this.moveRight();
  }


  function collision() {

    //Make sure the bat is not going out of the canvas
    if (batX < 0)                     batX = 0;
    if (batX > (canvas.width-bat.w))  batX = (canvas.width-bat.w);

    //Doe stuiter-shit met the ball
    if(ballX + dx > canvas.width-ballRadius || ballX + dx < ballRadius) {
        dx = -dx;
    }
    if(ballY + dy > canvas.height-ballRadius || ballY + dy < ballRadius) {
        dy = -dy;
    }

    // if (distance < circle1.radius + circle2.radius) {
    // // collision detected!
    // }
    
    ballX += dx;
    ballY += dy;

  }

  //Object Ball
  function objectBall(x, y, r, color, sX, sY){
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color
    this.sX = sX;
    this.sY = sY;

    objectBall.prototype.init = function(x, y, r, color, sX, sY) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.color = color;
      this.sX = sX;
      this.sY = sY;
    };

    objectBall.prototype.changePosition = function(x, y) {
      this.x = x;
      this.y = y;
    };

    objectBall.prototype.changeRadius = function(r) {
      this.r = r;
    };

    objectBall.prototype.changeColor = function(color) {
      this.color = color;
    };

    objectBall.prototype.changeXSpeed = function(sX) {
      this.sX = sX;
    };

    objectBall.prototype.changeYSpeed = function(sY) {
      this.sY = sY;
    };

    objectBall.prototype.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = this.color; //'#0095DD';
      ctx.fill();
      ctx.closePath();
    };


  };

  //Object Bat
  function objectBat(x, y, w, s, borderColor, fillColor){
    this.x = x;
    this.y = y;
    this.w = w;
    this.s = s;
    this.border = borderColor;
    this.fill = fillColor;

    objectBat.prototype.init = function(x, y, w, s, borderColor, fillColor) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.s = s;
      this.border = borderColor;
      this.fill = fillColor;
    };

    objectBat.prototype.changePosition = function(x, y) {
      this.x = x;
      this.y = y;
    };

    objectBat.prototype.changeWidth = function(w) {
      this.w = w;
    };

    objectBat.prototype.changeColor = function(borderColor, fillColor) {
      this.border = borderColor;
      this.fill = fillColor;
    };

    objectBat.prototype.changeSpeed = function(multiplierS) {
      this.s = this.s*multiplierS;
      return this.s;
    };

    objectBat.prototype.draw = function() {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.w, 20);
      ctx.fillStyle = this.fill;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.border;
      ctx.stroke();
    };
   
  };

  //Create key-object
  var Key = {
    _pressed: {},

    LEFT:   37,
    UP:     38,
    RIGHT:  39,
    DOWN:   40,
    
    isDown: function(keyCode) {
      return this._pressed[keyCode];
    },
    
    onKeydown: function(event) {
      this._pressed[event.keyCode] = true;
    },
    
    onKeyup: function(event) {
      delete this._pressed[event.keyCode];
    }
  };

});