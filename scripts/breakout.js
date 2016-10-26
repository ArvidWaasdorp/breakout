//Setting the default values for the game
var Defaults = {

    fps  : 60,

  game: {
    state     : 'start',
    interval  : 1000,
    handle    : null,
    level     : 1,
    score     : 0,
    lives     : 3,
    blocks    : 0,
    blocksLeft: 0,
    highscore : 0,
  },

  ball: {
    x    : 400,
    y    : 490,
    r    : 7,
    color: '#d9534f',
    dx   : 3,  //2
    dxMax: 8,  //6
    dy   : -7, //-3
  },

  bat: {
    x          : 350,
    y          : 500,
    w          : 100,
    h          : 10,
    s          : 10, //5
    borderColor: '#428bca',
    fillColor  : '#5bc0de',
  },

  blocks: {
    startBlockX : 0,
    startBlockY : 50,
    blockLength : 40,
    blockHeight : 20,
    blockSpacing: 0,
  }
};

var layouts = {

  facebook: {
    border: '#3b5998',
    block1: '#8b9dc3',
    block2: '#dfe3ee',
    block3: '#f7f7f7',
    block4: '#ffffff',
  },

  google: {
    border: '#d62d20',
    block1: '#ffa700',
    block2: '#0057e7',
    block3: '#008744',
    block4: '#ffffff',
  },

  microsoft: {
    border: '#737373',
    block1: '#f65314',
    block2: '#7cbb00',
    block3: '#00a1f1',
    block4: '#ffbb00',
  },

  caucasian: {
    border: '#ffad60',
    block1: '#eac086',
    block2: '#ffcd94',
    block3: '#ffe39f',
    block4: '#ffe0bd',
  },

  pastel: {
    border: '#5a5255',
    block1: '#1b85b8',
    block2: '#ae5a41',
    block3: '#559e83',
    block4: '#c3cb71',
  }

};


$( document ).ready(function() {

  var canvas    = document.getElementById ('gameCanvas');
  var ctx       = canvas.getContext ('2d');

  var levels       = [
                       ['0', '', '0 is not a level'],
                       ['1', 'google',     '10100023432341243240-11001123234141441111-11412411341121213111-04124023003203010000-14134130032412311010-11113213120013211111-14132113211340341111'],
                       ['2', 'microsoft',  '12321342332434123411-41234242341231241312-42524312413245002134-12034414341312314231-41234132123414131321-14124313141242412333-41124323141233100213'],
                       ['3', 'facebook',   '10101324231422431010-02313123123410111100-32134123412321341231-31230123031301320414-03123023213030130312-03123013201230123130-04124412421432424212'],
                       ['4', 'caucasian',  '12321342332434123411-41234242341231241312-42524312413245002134-12034414341312314231-41234132123414131321-14124313141242412333-41124323141233100213'],
                       ['5', 'pastel',     '12321342332434123411-41234242341231241312-42524312413245002134-12034414341312314231-41234132123414131321-14124313141242412333-41124323141233100213'],
                     ];

  //De objecten
  var game         = null;
  var bat          = null;
  var ball         = null;
  var block        = [];

  $('#start').click(function(){
    startLoop();
  });


  $('#stop').click(function(){
    stopLoop();
  });


  //Init the game. Set default values
  init();

  //Run the game
  console.log ('Running game');
//  setInterval(run, 10);          //The game loop

//  gameSpeed = setInterval (run, game.interval / Defaults.fps);
  //clearInterval(run);

  //Functions we can use
  //Draw some debug information
  // function drawDebug() {
  //   $('#data-bat-x').text (bat.x);
  //   $('#data-bat-y').text (bat.y);
  //   $('#data-ball-x').text (ball.x);
  //   $('#data-ball-y').text( ball.y);
  //   $('#data-debug_1').text ('State: ' + game.state);
  //   $('#data-debug_2').text ('Blocks left: ' + game.blocksLeft);
  // }

  function updateUI() { 

    $('#level').text (game.level);
    $('#score').text (game.score);
    $('#lives').text (game.lives);
 
  }

  function init() {

    console.log ('Init game');

    //New game object
    game = new gameSettings();
    game.init ('play', Defaults.game.level, Defaults.game.score, Defaults.game.lives, Defaults.game.blocks, Defaults.game.blocksLeft);

    //New bat object
    bat = new objectBat();
    bat.init (Defaults.bat.x, Defaults.bat.y, Defaults.bat.w, Defaults.bat.h, Defaults.bat.s, Defaults.bat.borderColor, Defaults.bat.fillColor);

    ball = new objectBall();
    ball.init (Defaults.ball.x, Defaults.ball.y, Defaults.ball.r, Defaults.ball.color, Defaults.ball.dx, Defaults.ball.dxMax, Defaults.ball.dy);
    resetGame();

    game.highscore = getCookie('BO_highscore'); 

    loadLevel ();

    //Add events for the keyboard
    window.addEventListener ('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener ('keydown', function(event) { Key.onKeydown(event); }, false);

  }


  function stopLoop() {
    console.log('Stop loop');
    clearInterval(Defaults.game.handle);
  }

  function startLoop() {
    console.log('Start loop');
    Defaults.game.handle = setInterval (run, game.interval / Defaults.fps);
  }


  function sleep(miliseconds) {
    var currentTime = new Date().getTime();

    //Really do nothing :)    
    while (currentTime + miliseconds >= new Date().getTime()) {
    }
  }

  function loadLevel(level) {
    var strLevel   = levels[game.level][2];
    var arrayLevel = 0;

    var bc = layouts[levels[game.level][1]].border;
    var b1 = layouts[levels[game.level][1]].block1;
    var b2 = layouts[levels[game.level][1]].block2;
    var b3 = layouts[levels[game.level][1]].block3;
    var b4 = layouts[levels[game.level][1]].block4;
    var fc = '#FFFFFF';


    sleep (2000);

    for (i=0; i<strLevel.length; i++) {

      if ((strLevel[i] != '0') && (strLevel[i] != '-')) {

        switch (strLevel[i]) {
          case '1': fc = b1; break;
          case '2': fc = b2; break;
          case '3': fc = b3; break;
          case '4': fc = b4; break;
        }

        block[arrayLevel] = new objectBlock();
        block[arrayLevel].init (Defaults.blocks.startBlockX, Defaults.blocks.startBlockY, Defaults.blocks.blockLength, Defaults.blocks.blockHeight, bc, fc, 'alive');

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

    //var dirInput = getInput ();

//    console.log (getInput ());

//    moveBat (dirInput);

    getInput();


    if (game.state === 'run') {

      getCollision ();

      //moveBall ();
    }

    draw();

  }

  function countDown() {

    ctx.font = "30px Arial";
    str = "Ready...";
    str = "Set...";
    str = "Go!!!!";

    ctx.fillText (str, 300, 400);

    game.state = 'run';

  }


  function draw() {
    //Clear the canvas
    ctx.clearRect (0, 0, canvas.width, canvas.height);

    str = 'Tekst';

    ctx.font = "30px Arial";
    ctx.fillText (str, 370, 300);

//countDown();
//      countDown();

//    if (game.state === 'ready_run') {
//      sleep (1000);
//    }


    ball.draw();
    bat.draw();

    //Draw the bats. They are stored in a array which needs to be checked.
    //In case the bat is hit, the value will not be 'dead'. Only the alive values must be drawed

    for (i=0; i<game.blocks; i++) {
      if (block[i].status === 'alive') {
        block[i].draw ();
      }
    }

    updateUI();

  }

  function getInput() {

    if ((game.state === 'run') || (game.state === 'play') || (game.state === 'restart')) {
      if (Key.isDown(Key.LEFT))  bat.moveLeft();
      if (Key.isDown(Key.RIGHT)) bat.moveRight();
    }

    if (Key.isDown(Key.DOWN)) stopLoop();
    if (Key.isDown(Key.UP)) startLoop();

    //Input here :D
    if (Key.isDown(Key.SPACE))   {
      switch (game.state) {
        case 'play':     game.state = 'run';  break; //ready_run
        case 'restart':  game.state = 'run';  break;
      }
    }

    if (Key.isDown(Key.P))   {
      switch (game.state) {
        case 'run':     game.state = 'pauze'; break;
        case 'pauze':   game.state = 'run';   break;
      }
    }
  }


  function resetGame() {
    ball.dx = Defaults.ball.dx;
    ball.dy = Defaults.ball.dy;
    bat.x   = Defaults.bat.x;
    bat.y   = Defaults.bat.y;
    bat.w   = Defaults.bat.w;    
    ball.changePosition (Defaults.ball.x, Defaults.ball.y);
  }


  function getCollision() {

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
          resetGame();

          if (game.lives === 0) {
            game.state = 'gameover';

            if (game.score > game.highscore) {
              setCookie ('BO_highscore', game.score, 7);
            }

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

  //*******************************************************
  //| Use cookies to set the highscore
  //| Write the highscore
  function setCookie(name, value, days) {
    if (days) {
        var date = new Date ();
        date.setTime (date.getTime () + (days*24*60*60*1000));
        var expires = "; expires=" +date.toGMTString ();
    }
    else var expires = "";
    document.cookie = name + "=" + value+expires + "; path=/";
  }


  //Get the highscore
  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split (';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring (1,c.length);
        if (c.indexOf (nameEQ) == 0) return c.substring (nameEQ.length,c.length);
    }
    return null;
  }

  function eraseCookie(name) {
    createCookie(name,"",-1);
  }
  //| End of high-score-section
  //*******************************************************

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
    this.h  = h;
    this.s      = s;
    this.border = borderColor;
    this.fill   = fillColor;

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

    objectBat.prototype.moveLeft = function() {
      this.x = this.x - this.s;

      //Make sure the bat is not going out of the canvas
      if (bat.x < 0)                     bat.x = 0;
    };


    objectBat.prototype.moveRight = function() {
      this.x = this.x + this.s;

      //Make sure the bat is not going out of the canvas
      if (bat.x > (canvas.width-bat.w))  bat.x = (canvas.width-bat.w);
    }

    objectBat.prototype.draw = function() {

      ctx.beginPath ();
      ctx.rect (this.x, this.y, this.w, this.h);
      
      //When I really want round corners :)
      //ctx.lineJoin = "round";
      //ctx.lineWidth = 10;

      ctx.fillStyle = this.fill;
      ctx.fill ();
      ctx.lineWidth  = 2;
      ctx.strokeStyle = this.border;
      ctx.stroke ();
    };
   
  };

  //Object Blocks
  function objectBlock(x, y, w, h, borderColor, fillColor, status) {
    this.x      = x;
    this.y      = y;
    this.w      = w;
    this.h      = h;
    this.border = borderColor;
    this.fill   = fillColor;
    this.status = status;

    objectBlock.prototype.init = function(x, y, w, h, borderColor, fillColor, status) {
      this.x      = x;
      this.y      = y;
      this.w      = w;
      this.h      = h;
      this.border = borderColor;
      this.fill   = fillColor;
      this.status = status;
    };

    objectBlock.prototype.aLive = function(status) {
      this.status = status;
    };

    objectBlock.prototype.draw = function() {
      ctx.beginPath ();
      ctx.rect (this.x, this.y, this.w, this.h);
      ctx.fillStyle   = this.fill;
      ctx.fill ();
      ctx.lineWidth   = 1;
      ctx.strokeStyle = this.border;
      ctx.stroke ();
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