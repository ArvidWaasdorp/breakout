//Setting the default values for the game
var Defaults = {

  fps  : 60,
  stats: false,

  game: {
    state     : 'start',
    level     : 1,
    score     : 0,
    lives     : 3,
    blocks    : 0,
    blocksLeft: 0,
  },

  ball: {
    x    : 400,
    y    : 550,
    r    : 10,
    color: '#0095DD',
    dx        : 2,
    dxMax     : 6,
    dy        : -3,
  },

  bat: {
    x          : 350,
    y          : 560,
    w          : 100,
    h          : 10,
    s          : 5,
    borderColor: 'black',
    fillColor  : 'blue',
  },

  blocks: {
    startBlockX : 0,
    startBlockY : 50,
    blockLength : 80,
    blockHeight : 20,
    blockSpacing: 5,
  },

  state: {
    initial: 'menu',
    events: [
      { name: 'play',    from: 'menu', to: 'game' },
      { name: 'abandon', from: 'game', to: 'menu' },
      { name: 'lose',    from: 'game', to: 'menu' }
  ]}
};


$( document ).ready(function() {

  var canvas    = document.getElementById('gameCanvas');
  var canvasUI  = document.getElementById('gameCanvas-ui');
  var ctx       = canvas.getContext('2d');
  var ctxUI     = canvas.getContext('2d');

  var levels       = [
                       ['0','0 is not a level'],
                       ['1', '101-1100101111-1111111111-0000000000-1100111010-1111111111-1111111111'],
                       ['2', '00101111-10101'],
                       ['3', '10101010-00111100'],
                       ['4', '00111100-11111111'],
                     ];

  // var startBlockX  = 0;
  // var startBlockY  = 50;
  // var blockLength  = 80; //default
  // var blockHeight  = 20; //default
  // var blockSpacing = 5;

  // var dx           = 2;
  // var dxMax        = 6;
  // var dy           = -3;

  //De objecten
  var game         = null;
  var bat          = null;
  var ball         = null;
  var block        = [];

  //Init the game. Set default values
  init();

  //Run the game
  console.log('Running game');
  setInterval(run, 10);          //The game loop

  //Functions we can use
  //Draw some debug information
  function drawDebug() {
    $('#data-bat-x').text(bat.x);
    $('#data-bat-y').text(bat.y);
    $('#data-ball-x').text(ball.x);
    $('#data-ball-y').text(ball.y);
    $('#data-debug_1').text('State: ' + game.state);
    $('#data-debug_2').text('Blocks left: ' + game.blocksLeft);
    
  }

  function updateUI() { 

    $('#level').text(game.level);
    $('#score').text(game.score);
    $('#lives').text(game.lives);
 
  }

  function init() {

    console.log('Init game');

    //New game object
    game = new gameSettings();
    game.init('play', Defaults.game.level, Defaults.game.score, Defaults.game.lives, Defaults.game.blocks, Defaults.game.blocksLeft);

    //New bat object
    bat = new objectBat();
    bat.init(Defaults.bat.x, Defaults.bat.y, Defaults.bat.w, Defaults.bat.h, Defaults.bat.s, Defaults.bat.borderColor, Defaults.bat.fillColor);

    ball = new objectBall();
    ball.init(Defaults.ball.x, Defaults.ball.y, Defaults.ball.r, Defaults.ball.color, Defaults.ball.dx, Defaults.ball.dxMax, Defaults.ball.dy);
    ball.changeXSpeed(Defaults.ball.dx);
    ball.changeYSpeed(Defaults.ball.dy);

    loadLevel();

  }

  function loadLevel() {
    var strLevel   = levels[game.level][1]; 
    var arrayLevel = 0;

    for (i=0; i<strLevel.length; i++) {

      if (strLevel[i] === '1') {
        block[arrayLevel] = new objectBlock();
        block[arrayLevel].init(Defaults.blocks.startBlockX, Defaults.blocks.startBlockY, Defaults.blocks.blockLength, Defaults.blocks.blockHeight, 'red', 'gray', 'alive');

        //console.log (arrayLevel + ' x: ', block[arrayLevel].x + ' y: ' + block[arrayLevel].y);

        Defaults.blocks.startBlockX = Defaults.blocks.startBlockX + Defaults.blocks.blockLength;
        arrayLevel++;
      }

      if (strLevel[i] === '0') {
        Defaults.blocks.startBlockX = Defaults.blocks.startBlockX + Defaults.blocks.blockLength;
      }

      if (strLevel[i] === '-') {
        Defaults.blocks.startBlockX = 0;
        Defaults.blocks.startBlockY = Defaults.blocks.startBlockY + Defaults.blocks.blockHeight + Defaults.blocks.blockSpacing;
      }
    }

    game.changeBlocks (arrayLevel);
    game.changeBlocksLeft (arrayLevel);
  }

  function run() {

    getInput();

    if (game.state === 'run') {

      countDown();


      getCollision();
    }

    draw();

  }


  function countDown() {
ctx.font = "20px Georgia";
ctx.fillText("Hello World!", 400, 300);
  }


  function draw() {

    //Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ball.draw();
    bat.draw();

    //Draw the bats. They are stored in a array which needs to be checked.
    //In case the bat is hit, the value will not be 'dead'. Only the alive values must be drawed

    for (i=0; i<game.blocks; i++) {
      if (block[i].status === 'alive') {
        block[i].draw();
      }
    }

    if ($('#debug').is(':checked') === true) {
      drawDebug();
    }

    updateUI();

  }

  function getInput() {

    window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);

    if (game.state === 'run') {
      if (Key.isDown(Key.LEFT))  bat.x = bat.x - bat.s; //this.moveLeft();
      if (Key.isDown(Key.RIGHT)) bat.x = bat.x + bat.s; //this.moveRight();
    }

    //Input here :D
    if (Key.isDown(Key.SPACE))   {
      switch (game.state) {
        case 'play':     game.state = 'run';   break;
        case 'restart':  game.state = 'run';   break;
      }
    }

    if (Key.isDown(Key.P))   {
      switch (game.state) {
        case 'run':     game.state = 'pauze'; break;
        case 'pauze':   game.state = 'run';   break;
      }
    }
  }


  function getCollision() {

    //Make sure the bat is not going out of the canvas
    if (bat.x < 0)                     bat.x = 0;
    if (bat.x > (canvas.width-bat.w))  bat.x = (canvas.width-bat.w);

    //Doe stuiter-shit met the ball
    if(ball.x + ball.dx > canvas.width-ball.r || ball.x + ball.dx < ball.r) {
        ball.dx = -ball.dx;
    }

    if(ball.y + ball.dy > canvas.height-ball.r || ball.y + ball.dy < ball.r) {
        ball.dy = -ball.dy;

        if (ball.dy < 0) {
          game.lives--;

          //Resetting ball and bat
          game.state = 'restart';
          ball.changePosition(Defaults.ball.x, Defaults.ball.y);
          ball.dx = Defaults.ball.dx;
          ball.dy = Defaults.ball.dy;
          bat.x   = Defaults.bat.x;
          bat.y   = Defaults.bat.y;
          bat.w   = Defaults.bat.w;

          if (game.lives === 0) {
            game.state = 'gameover';
          }
        }
    }

    //Collision of the bat
    if (((ball.x+ball.r/2 >= bat.x) && (ball.x-ball.r/2 <= bat.x+bat.w)) && ((ball.y+ball.r/2 >= bat.y) && (ball.y-ball.r/2 <= bat.y+bat.h))) {
      var posBallBat = ball.x - bat.x;

      if ((ball.x >= bat.x) && (ball.x <= (bat.x+bat.w)) && ((ball.y >= bat.y) && (ball.y <= bat.y+bat.h))) {
        //console.log ('Side');
        ball.dx = -ball.dx;
        ball.dy = +ball.dy;
      }

      if ((ball.x >= bat.x) && (ball.x <= (bat.x+bat.w)))  {
        if (ball.y <= bat.y) {
          //console.log ('Top');

          //Callculate the new angle of the ball. End of the bat is max y, mid of the bat min y 
          if (posBallBat > (bat.w/2)) {
            var newX = (bat.w/2) - posBallBat;
            ball.dx = ball.dxMax * (newX / -(bat.w/2));
          } else {

            var newX = (bat.w/2) - posBallBat;
            ball.dx = ball.dxMax * (newX / -(bat.w/2));
          }

            ball.dx = +ball.dx;
            ball.dy = -ball.dy;
        } 

        if ((ball.x <= bat.x+bat.w) && (ball.y >= bat.y+bat.h)) {
          //console.log ('Bottom');
          ball.dx = +ball.dx;
          ball.dy = -ball.dy;
        }
      }

    }

    //Collision of the blocks
    for (i=0; i<game.blocks; i++) {

      if (((ball.x+ball.r/2 >= block[i].x) && (ball.x-ball.r/2 <= block[i].x+block[i].w)) && ((ball.y+ball.r/2 >= block[i].y) && (ball.y-ball.r/2 <= block[i].y+block[i].h)) && (block[i].status === 'alive')) {

        if ((ball.x >= block[i].x) && (ball.x <= (block[i].x+block[i].w)) && ((ball.y >= block[i].y) && (ball.y <= block[i].y+block[i].h))) {
          //console.log ('Side');
          ball.dx = -ball.dx;
          ball.dy = +ball.dy;
        }

        if ((ball.x >= block[i].x) && (ball.x <= (block[i].x+block[i].w)))  {
          if (ball.y <= block[i].y) {
            //console.log ('Top');
            ball.dx = +ball.dx;
            ball.dy = -ball.dy;
          } 
          if ((ball.x <= block[i].x+block[i].w) && (ball.y >= block[i].y+block[i].h)) {
            //console.log ('Bottom');
            ball.dx = +ball.dx;
            ball.dy = -ball.dy;
          }
        }
        block[i].status = 'dead';
        game.blocksLeft--;
        game.score += 10;
      }
    }

    if (game.state != 'pauze') {
      ball.changePosition(ball.x + ball.dx, ball.y + ball.dy);
    }

    if (game.blocksLeft === 0) {
      game.state = 'won';

      //function reset game
      //call load level again
      //reset state, keep score 
      //level+1

    }
  }

  function gameSettings(state, level, score, lives, blocks, blocksLeft) {

    this.state      = state;
    this.level      = level;
    this.score      = score;
    this.lives      = lives;
    this.blocks     = blocks;
    this.blocksLeft = blocksLeft; 

    gameSettings.prototype.changeBlocks = function(blocks) {
      this.blocks = blocks;
    }

    gameSettings.prototype.changeBlocksLeft = function(blocksLeft) {
      this.blocksLeft = blocksLeft;
    }

    gameSettings.prototype.changeLevel = function(level) {
      this.level = level;
    }

    gameSettings.prototype.init = function(state, level, score, lives, blocks, blocksLeft) {
      this.state = state;
      this.level     = level;
      this.score     = score;
      this.lives     = lives;
      this.blocks    = blocks;
      this.blocksLeft = blocksLeft; 
    };
  } 

  //Object Ball
  function objectBall(x, y, r, color, dx, dxMax, dy){

    this.x = x;
    this.y = y;
    this.r = r;
    this.color = color
    this.dx = dx;
    this.dxMax = dxMax;
    this.dy = dy;

    objectBall.prototype.init = function(x, y, r, color, dx, dxMax, dy) {
      this.x = x;
      this.y = y;
      this.r = r;
      this.color = color;
      this.dx = dx;
      this.dxMax = dxMax;
      this.dy = dy;
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

    objectBall.prototype.changeXSpeed = function(dx) {
      this.dx = dx;
    };

    objectBall.prototype.changeYSpeed = function(dy) {
      this.dy = dy;
    };

    objectBall.prototype.draw = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    };

  };

  //Object Bat
  function objectBat(x, y, w, h, s, borderColor, fillColor) {

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

  //Object Blocks
  function objectBlock(x, y, w, h, borderColor, fillColor, status) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.border = borderColor;
    this.fill = fillColor;
    this.status = status;

    objectBlock.prototype.init = function(x, y, w, h, borderColor, fillColor, status) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.border = borderColor;
      this.fill = fillColor;
      this.status = status;
    };

    objectBlock.prototype.aLive = function(status) {
      this.status = status;
    };

    objectBlock.prototype.draw = function() {
      ctx.beginPath();
      ctx.rect(this.x, this.y, this.w, this.h);
      ctx.fillStyle = this.fill;
      ctx.fill();
      ctx.lineWidth = 1;
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
      SPACE:  32,
      P:      80,
      R:      82,
      
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