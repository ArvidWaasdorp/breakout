//TODO
//==================================
//Create bat                    done   .
//Move bat using keyboard       done   http://nokarma.org/2011/02/27/javascript-game-development-keyboard-input/ (works great!)
//Create ball                   done   .
//Move ball                     done   https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Bounce_off_the_walls
//Let ball bounch               done   https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Bounce_off_the_walls
//Create collision on wall      done   https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Bounce_off_the_walls
//Make use of object            done
//Create collision on bat       done

//Re-use bat-object for blocks  open
//Create blocks                 open
//Remove blocks                 open
//Create collision on blocks    open
//Create score                  open
//Create menu                   open
//Create levels                 open
//Change angle > hit on site    open
//Change speed of ball          open
//Add power-ups                 open
//Launch game on [space]        open
//Add lives                     open


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
//  var ballX       = canvas.width/2;
//  var ballY       = canvas.height-60;
  var dx          = 2;
  var dy          = -2;

  //Moet beter
  var lives       = 3;
  var gameSpeed   = 1;

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
    $('#data-bat-x').text(bat.x);
    $('#data-bat-y').text(bat.y);
    $('#data-ball-x').text(ball.x);
    $('#data-ball-y').text(ball.y);
  }

  function init() {

    console.log('Init game');

    bat = new objectBat();
    if (!bat) {
      console.log('ERROR: Unable to create bat object');
    }
    bat.init((canvas.width/2) - (100/2), 550, 100, 10, 5, 'black', 'blue');

    ball = new objectBall();
    if (!ball) {
      console.log('ERROR: Unable to create ball object');
    }
    ball.init(canvas.width/2, canvas.height-60, 10, '#0095DD', 2, -2);
    ball.changeXSpeed(dx);
    ball.changeYSpeed(dy);

    //Set some interface value
    $('#lives').text(lives);
   
  }

  function run() {

    getInput();

    getCollision();

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

    if (Key.isDown(Key.UP))    bat.changeSpeed(1.1);  //this.moveUp();
    if (Key.isDown(Key.LEFT))  bat.x = bat.x - bat.s; //this.moveLeft();
    if (Key.isDown(Key.DOWN))  bat.changeWidth(200);  //this.moveDown();
    if (Key.isDown(Key.RIGHT)) bat.x = bat.x + bat.s; //this.moveRight();

    //code to increase gameSpeed
    //Input here :D
    if (Key.isDown(Key.A))       {  gameSpeed = gameSpeed + 0.1;   console.log('A : '   + gameSpeed);   }
    if (Key.isDown(Key.Z))       {  gameSpeed = gameSpeed - 0.1;   console.log('Z : '   + gameSpeed);   }
    if (Key.isDown(Key.ESCAPE))  {  gameSpeed = gameSpeed - 0.1;   console.log('ESC : ' + gameSpeed);   }

  }


  function getCollision() {

    //Make sure the bat is not going out of the canvas
    if (bat.x < 0)                     bat.x = 0;
    if (bat.x > (canvas.width-bat.w))  bat.x = (canvas.width-bat.w);

    //Doe stuiter-shit met the ball
    if(ball.x + dx > canvas.width-ballRadius || ball.x + dx < ballRadius) {
        dx = -dx;
    }

    if(ball.y + dy > canvas.height-ballRadius || ball.y + dy < ballRadius) {
        dy = -dy;

        if (dy < 0) {
          lives--;
          //Draw interface bouwen
          $('#lives').text(lives);
        }
    }


    


    //Collision algemeen


    $('#data-debug_1').text('dx: ' + dx + ' | dy: ' + dy);


    if (((ball.x+ball.r/2 > bat.x) && (ball.x-ball.r/2 < bat.x+bat.w)) && ((ball.y+ball.r/2 >= bat.y) && (ball.y-ball.r/2 <= bat.y+bat.h))) {

      if ((ball.x > bat.x) && (ball.x < (bat.x+bat.w)) && ((ball.y > bat.y) && (ball.y < bat.y+bat.h))) {
        console.log ('Side');
           dx = -dx;
           dy = +dy;
           ball.changePosition(ball.x + dx, ball.y + dy);
      }

      if ((ball.x > bat.x) && (ball.x < (bat.x+bat.w)))  {
        if (ball.y <= bat.y) {
           console.log ('Top');
           dx = +dx;
           dy = -dy;
           ball.changePosition(ball.x + dx, ball.y + dy);
        } 
         if ((ball.x <= bat.x+bat.w) && (ball.y >= bat.y+bat.h)) {
           console.log ('Bottom');
           dx = +dx;
           dy = -dy;
           ball.changePosition(ball.x + dx, ball.y + dy);
        }
      }


    }

    //Speed aanpassen
    //Speed aanpassen
    //Speed aanpassen
//    ballX += dx;
//    ballY += dy;

    ball.changePosition(ball.x + dx, ball.y + dy);

    //Speed aanpassen
    //Speed aanpassen
    //Speed aanpassen

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
  function objectBat(x, y, w, h, s, borderColor, fillColor){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.s = s;
    this.border = borderColor;
    this.fill = fillColor;

    objectBat.prototype.init = function(x, y, w, h, s, borderColor, fillColor) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.s = s;
      this.border = borderColor;
      this.fill = fillColor;
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
    };

    objectBat.prototype.draw = function() {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.w, this.h);
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
    A:      65,
    Z:      90,
    ESCAPE: 27,
    SPACE:  13,
    
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