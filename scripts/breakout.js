// //TODO

// //Create bat                  done   .
// //Move bat using keyboard     done   .
// //Create ball                 done   .
// //Move ball                   done   https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Bounce_off_the_walls
// //Let ball bounch             done   https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Bounce_off_the_walls
// //Create collision on wall    done   https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Bounce_off_the_walls
// //Create collision on bat     open
// //Create blocks               open
// //Remove blocks               open
// //Create collision on blocks  open
// //Create score                open
// //Create menu                 open
// //Create levels               open


// http://stackoverflow.com/questions/11368477/dynamically-resize-canvas-window-with-javascript-jquery
// ? https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
// https://scotch.io/tutorials/default-sizes-for-twitter-bootstraps-media-queries

// 
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

  //768, 800*600, ratio: 0.75 (small devices, tablets)
  //var canvas_width = 640;
  //var canvas_height = 480;
  
  //992 medium devices > resolution: 800*600
  //var canvas_width = 768;
  //var canvas_height = 576;


  var canvas  = document.getElementById('gameCanvas');
  var ctx     = canvas.getContext('2d');

  var ballRadius  = 10;
  var x           = canvas.width/2;
  var y           = canvas.height-30;
  var dx          = 2;
  var dy          = -2;
  var batX        = 100;
  var batY        = 550;
  var batW        = 100;
  var key         = '';

  var bat         = null;
  var ball        = null;

  init();

  $(document).keydown(function(e){

    switch(e.keyCode || e.which) {
      case 37:                //left
        key = 'left';
        batX = batX - 10;
        break;
      case 38:                //up
        key = 'up';
        bat.changeWidth(200);
        break;
      case 39:                //right
        key = 'right';
        batX = batX + 10;
        break;
      case 40:                //down
        key = 'down';
        bat.changeWidth(100);
        break;
      case 27:                //escape
        key = 'Escape';
        break;
    }

    if (batX < 0) batX = 0;
    if (batX > (canvas.width-bat.w)) batX = (canvas.width-bat.w);
  });

  function drawDebug() {
    $('#data-bat-x').text(batX);
    $('#data-bat-y').text(batY);
    $('#data-ball-x').text(x);
    $('#data-ball-y').text(y);
    $('#key').text(key);
  }


  function init() {

    console.log('Init game');

    bat = new objectBat();
    if (!bat) {
      console.log('ERROR: Unable to create bat object');
    }
    bat.setDimension(batX, batY, batW, 'black', 'yellow');

    ball = new objectBall();
    if (!ball) {
      console.log('ERROR: Unable to create ball object');
    }
    ball.setDimension(x, y, ballRadius, '#0095DD');

  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    //drawBall();

    ball.drawIt(x, y);
    bat.drawIt(batX, batY);


    collision();


    if ($('#debug').is(':checked') === true) {
      drawDebug();
    }
  }

  function collision() {
    //Doe stuiter-shit met the ball
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
        dy = -dy;
    }


    // if (distance < circle1.radius + circle2.radius) {
    // // collision detected!
    // }
    
    x += dx;
    y += dy;

  }


  //Object Ball
  function objectBall(x, y, r, color){
    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color

    objectBall.prototype.drawIt = function(x, y) {
      this.x = x;
      this.y = y;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = this.color; //'#0095DD';
      ctx.fill();
      ctx.closePath();
    };

    objectBall.prototype.setDimension = function (x, y, r, color) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.color = color;
    };
  };

  //Object Bat
  function objectBat(x, y, w, borderColor, fillColor){
    this.x = x;
    this.y = y;
    this.w = w;
    this.border = borderColor;
    this.fill = fillColor;

    objectBat.prototype.drawIt = function(x, y) {
      this.x = x;
      this.y = y;

      ctx.beginPath();
      ctx.rect(this.x, this.y, this.w, 20);
      ctx.fillStyle = this.fill;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = this.border;
      ctx.stroke();
    };

    objectBat.prototype.setDimension = function (x, y, w, borderColor, fillColor) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.border = borderColor;
      this.fill = fillColor;
    };

    objectBat.prototype.changeWidth = function(w) {
      this.w = w;
    }

  };

  setInterval(draw, 10);

});