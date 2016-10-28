//Setting the default values for the game
var Defaults = {

  game: {
    fps       : 60,
    interval  : 1000,
    state     : 'start',
    handle    : null,
    level     : 1,
    score     : 0,
    lives     : 1,
    livesMax  : 5,
    blocks    : 0,
    blocksLeft: 0,
    highscore : 0,
    powerup   : '',
  },

  ball: {
    x    : 400,
    y    : 490,
    r    : 7,
    color: '#854442',
    dx   : 3,  //3 //0.5
    dxMax: 7,  //8 //1
    dy   : -7, //-7 //-2
  },

  bat: {
    x          : 350,
    y          : 500,
    w          : 100,
    h          : 10,
    s          : 8, //5
    borderColor: '#854442',
    fillColor  : '#be9b7b',
  },

  powerup: {
    x          : 0,
    y          : 0,
    r          : 7,
    w          : 15,
    h          : 15,
    s          : 3, //6
    color      : '#4b3832',
    time       : 240,       //amount of cycles the powerup is active. 16*15seconds
  },

  blocks: {
    startBlockY : 50,
    startBlockX : 10, 
    blockLength : 60, //40
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

  downtown: {
    border: '#373854',
    block1: '#493267',
    block2: '#9e379f',
    block3: '#e86af0',
    block4: '#7bb3ff',
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

  //********************************************
  //| Global variables used in the game
  var canvas          = document.getElementById ('gameCanvas');   //Get the canvas to draw the game onto
  var ctx             = canvas.getContext ('2d');                 //Set the context to 2D graphics
  var str             = '';
  var powerMultiplier = 0; 

  //********************************************
  //| Load the sound items
  var snd_start     = AudioFX('sounds/8bit_ready_go',  { formats: ['wav', 'mp3', 'm4a'], volume: 0.1          });
  var snd_lose      = AudioFX('sounds/8bit_lose',      { formats: ['wav', 'mp3', 'm4a'], volume: 0.1          });
  var snd_win       = AudioFX('sounds/8bit_win',       { formats: ['wav', 'mp3', 'm4a'], volume: 0.1          });
  var snd_miss_ball = AudioFX('sounds/8bit_failure',   { formats: ['wav', 'mp3', 'm4a'], volume: 0.1          });
  var snd_bounce    = AudioFX('sounds/8bit_bounce',    { formats: ['wav', 'mp3', 'm4a'], volume: 0.1, pool: 20});
  var snd_power_up  = AudioFX('sounds/8bit_power_up',  { formats: ['wav', 'mp3', 'm4a'], volume: 0.1, pool: 10});
  //********************************************
  
  //| The defined levels
  //| field 0 = level ID, first item in the array is not a level
  //| field 1 = layout, what color scheme to be used
  //| field 2 = the level
  //|            0) no block 
  //|            1 till 4) scheme colors
  //|            4) Scheme color nr: 4
  //|            -) Next line
  // Level, starts on 10, length = 60 (makes is a bit easier)  
  var levels       = [
                       ['0',  '', '0 is not a level'],
                       ['1',  'google',     '0000100000000'],
                       ['2',  'downtown',   '----0000030000040'],
                       ['3',  'pastel',     '0301002300110-0204020010000-0121030040410-0204020030140-0302003100210'],
                       ['4',  'microsoft',  '4321120344321-0000000000000-0100011000110-1100101101001-0100001000010-0100010001001-1110111100110-0000000000000-1234430211234'],
                       ['5',  'google',     '1010002344340-1011223443111-1421134121111-0424230023000-1414303421100-1111200131111-1131121304111'],
                       ['6',  'downtown',   '0131231324332-1043204230234-1121312133244-0213123403242-1233012301123-0123240330303-0000000000000-1102310241324-3213241342432,1234242341100'],
                       ['7',  'microsoft',  '1214334423411-4242242141312-2231434400214-1041313142043-1313144431321-1141114212333-1232113100213'],
                       ['8',  'facebook',   '1010132432230-0231332411100-1341234231431-3123012031044-0313310330312-0323012312130-0412442424212'],
                       ['9',  'downtown',   '1232123442311-2324123141312-0243113220234-1041434134231-1313214301321-1143342412333-1243213121321'],
                       ['10', 'pastel',     '1422233244131-1322423124112-4141412002034-2034134324201-4231323414341-4131144212333-4143310244023'],
                     ];
     
  // Level, starts on 0, length = 40  
  // var levels       = [
  //                      ['0', '', '0 is not a level'],
  //                      ['1', 'google',     '00000000000000000000-00000000000000001000-00000000000000000000-00000000000000000000-00000000000000000000-00000000000000000000-00000000000000000000'],
  //                      ['2', 'google',     '10100023432341243240-11001123234141441111-11412411341121213111-04124023003203010000-14134130032412311010-11113213120013211111-14132113211340341111'],
  //                      ['3', 'microsoft',  '12321342332434123411-41234242341231241312-42524312413245002134-12034414341312314231-41234132123414131321-14124313141242412333-41124323141233100213'],
  //                      ['4', 'facebook',   '10101324231422431010-02313123123410111100-32134123412321341231-31230123031301320414-03123023213030130312-03123013201230123130-04124412421432424212'],
  //                      ['5', 'caucasian',  '12321342332434123411-41234242341231241312-42524312413245002134-12034414341312314231-41234132123414131321-14124313141242412333-41124323141233100213'],
  //                      ['6', 'pastel',     '12321342332434123411-41234242341231241312-42524312413245002134-12034414341312314231-41234132123414131321-14124313141242412333-41124323141233100213'],
  //                    ];

  var game         = null;    //Game object, stores generic variabales of the game like; lives, score, blocks left
  var bat          = null;    //Bat object, stores generic variables like; size, speed, width. Also give access to methodes like move left and move right
  var ball         = null;    //Ball object, stores generic variables like; size, speed, radius. Also give access to methodes
  var block        = [];      //Array of block objects,  stores generic variables like; color, x-pos, y-pos and status. Also give access to methodes
  var powerup      = null; //[];
  //********************************************

  //********************************************
  //| Current implementation of starting stopping or pauzing the game
  //| Start the game
  $('#game-start').click(function(){

    if (game.state === 'gameover') {
      restartGame();
    }
    $('#game-start').hide();
    $('#game-stop').show();
    startLoop();
    
    game.state = 'play_ready';
  });

  //Stop the game. If you press stop a confirm button is displayed to confirm your choice. Based on that solution, the game will continue or is resetted
  $('#game-stop').click(function(){
    stopLoop();

    var options = {
            message: 'Do you really want to quite? <br><br> I am sure you will beat the game! Common just one more level... you will be amazed!',
            title:   ':( You leaving already ?',
            size:    eModal.size.s,
            label:   'Yes'
      };

      eModal.confirm(options).then(function(){
        $('#game-stop').hide  ();
        $('#game-start').show ();
        $('#game-start').text (' Start ');
        $('#pauze-game').prop ('disabled', true);

        drawText('', 1, 1);


        restartGame();

      }, function() {
        startLoop();
      });
  });

  //| Check the status and based on that the game will be paused.
  //| Also the text on the button will changed
  $('#pauze-game').click(function(){
    if ($('#pauze-game').text() === ' Pauze ') {
      game.state = 'pauze';
      stopLoop();
      $('#pauze-game').text(' Resume ');
    } else {
      game.state = 'run';
      startLoop();
      $('#pauze-game').text(' Pauze ');
    }
  });
  //********************************************

  //Open function: init. It set default values
  init();

  function init() {

    //console.log ('Init game');
    
    $('#pauze-game').prop('disabled', true);    //Disable the pauze-button by default (page load)
    $('#game-stop').hide();                     //Little cheat to hide the stop-button on load

    $('#debug').hide();                         //Hide the debug-div by default (page load)

    //*******************************************************
    //| New game object and initalize it
    //| It uses the variables in the Defaults-object
    game = new gameSettings();
    game.init ('play', Defaults.game.level, Defaults.game.score, Defaults.game.lives, Defaults.game.blocks, Defaults.game.blocksLeft, 0, 0);

    //New bat object and initalize it
    //| It uses the variables in the Defaults-object
    bat = new objectBat();
    bat.init (Defaults.bat.x, Defaults.bat.y, Defaults.bat.w, Defaults.bat.h, Defaults.bat.s, Defaults.bat.borderColor, Defaults.bat.fillColor);

    //New ball object and initalize it
    //| It uses the variables in the Defaults-object
    ball = new objectBall();
    ball.init (Defaults.ball.x, Defaults.ball.y, Defaults.ball.r, Defaults.ball.color, Defaults.ball.dx, Defaults.ball.dxMax, Defaults.ball.dy, 1);
    
    //Init the power-ups
    powerup = new objectPowerUp();
    powerup.init (1, 0, 0, Defaults.powerup.r, Defaults.powerup.w, Defaults.powerup.h, Defaults.powerup.color, false);
    //*******************************************************

    //Rest the bat and ball to their staring position    
    resetBatBall  ();

    //Retrieve the highscore of the user stored in a cookie
    game.highscore = getCookie('BO_highscore') || 0; 

    //Load the level
    loadLevel ();

    //Add events for the keyboard
    window.addEventListener ('keyup', function(event) { Key.onKeyup(event); }, false);
    window.addEventListener ('keydown', function(event) { Key.onKeydown(event); }, false);
  }

  //********************************************
  //| The game loop
  function run() {

    getInput();                 //Get user input
    getCollision ();            //Get and process ball collision
    getPowerUp();

    draw();                      //Function to draw all the elements that needs to be refresed every cycle
  }
  //| End of the loop
  //********************************************


  function loadLevel() {
    var strLevel   = levels[game.level][2];
    var arrayLevel = 0;
    var blockX     = Defaults.blocks.startBlockX;
    var blockY     = Defaults.blocks.startBlockY;

    var bc = layouts[levels[game.level][1]].border;
    var b1 = layouts[levels[game.level][1]].block1;
    var b2 = layouts[levels[game.level][1]].block2;
    var b3 = layouts[levels[game.level][1]].block3;
    var b4 = layouts[levels[game.level][1]].block4;
    var fc = '#FFFFFF';

    for (i=0; i<strLevel.length; i++) {

      if ((strLevel[i] != '0') && (strLevel[i] != '-')) {

        switch (strLevel[i]) {
          case '1': fc = b1; break;
          case '2': fc = b2; break;
          case '3': fc = b3; break;
          case '4': fc = b4; break;
        }

        block[arrayLevel] = new objectBlock();
        block[arrayLevel].init (blockX, blockY, Defaults.blocks.blockLength, Defaults.blocks.blockHeight, bc, fc, 'yes', strLevel[i]);

        blockX = blockX + Defaults.blocks.blockLength;
        arrayLevel++;
      }

      if (strLevel[i] === '0') {
        blockX = blockX + Defaults.blocks.blockLength;
      }

      if (strLevel[i] === '-') {
        blockX = Defaults.blocks.startBlockX;
        blockY = blockY + Defaults.blocks.blockHeight + Defaults.blocks.blockSpacing;
      }
    }

    game.changeBlocks (arrayLevel);
    game.changeBlocksLeft (arrayLevel);
  }

  function draw() {
    //Clear the canvas
    ctx.clearRect (0, 0, canvas.width, canvas.height);

    switch (game.state) {
      case 'run_ready' : drawCountDown();                                         break;
      case 'play_ready': drawText('Press <SPACE> to start', 290, 400);            break;
      case 'play'      : drawText('', 290, 400);                                  break;
      case 'gameover'  : drawText('Press restart to restart the game', 240, 400); break;
    }

    //**************************************
    //| Draw the powerup's
    //| 1) circle > widen bat
    //| 2) add a multiplier to the score
    //| Only draw when 1 or 2 is draw and the powerup must be displayed (visible, yes)
    if (((game.powerup === 1) || ((game.powerup === 2))) && (powerup.visible === true)) {
      if (game.powerup === 1) {
        powerup.drawCircle();   //Draw power-up: circle
      } else {
        powerup.drawCube();     //Draw power-up: cube
      }
    }
    //**************************************

    ball.draw();      //Draw the bat
    bat.draw();       //Draw the ball

    //Draw the blocks. They are stored in a array which needs to be checked.
    //In case the block is hit, the value will not be 'dead'. Only the alive values must be drawed
    for (i=0; i<game.blocks; i++) {
      if (block[i].visible === 'yes') {
        block[i].draw ();
      }
    }

    updateUI();
  }

  function drawText(text, x, y) {
    ctx.font = '20px verdana';
    ctx.fillStyle = 'red';
    ctx.fillText (text, x, y);
  }

  var strCount = [['Three...'], ['Two..'], ['One.'], ['Go!!!']];
  var count  = 0;
  var count1 = 0;
  function drawCountDown() {

    if (count < 121) {
      if ((count === 40) || (count === 80) || (count === 120)) {
        count1++;
      }
    }

    ctx.font = '26px verdana';
    ctx.fillStyle = 'red';
    ctx.fillText (strCount[count1] || '', 350, 400);
    count++;

    if (count === 121) {
      game.state = 'run';
      count = 0;
      count1 = 0;
    }
  }
  
  //********************************************
  //| Draw the UI components that needs to be refreshed every frame
  function updateUI() { 
    $('#hscore').text (game.highscore);   //Display the highscore of the game. The score is stored in a cookie
    $('#level').text  (game.level);       //Display the level in the span-level
    $('#score').text  (game.score);       //Display the score in the span-level

    //Display the live-hearts. The maximum of hearts is 5
    for (i = 1; i <= Defaults.game.livesMax; i++) {
      $('#live' + i).attr('src', 'images/live_full.png');                       //Set all the hearts to full
      if (i > game.lives)  $('#live' + i).attr ('src', 'images/live_empty.png'); //Change the hearts to empty of the amount that the player died in the game 
    }    

    if (game.state === 'run') {
      $('#pauze-game').prop ('disabled', false);
    } else {
      $('#pauze-game').prop ('disabled', true);
    }

    //drawDebugInformation ();                    //Show debug information
  }
  //********************************************

  //********************************************
  //| Get the keyboard input and process it
  function getInput() {

    if ((game.state === 'play') || (game.state === 'run_ready') || (game.state === 'play_ready')  || game.state === 'run') {

      if (Key.isDown (Key.LEFT))  bat.moveLeft ();
      if (Key.isDown (Key.RIGHT)) bat.moveRight ();
    }

    //Input here :D
    if (Key.isDown (Key.SPACE) && (game.state === 'play_ready'))   {
      game.state = 'run_ready';
      playSound (snd_start);
    }
  }
  //********************************************

  //********************************************
  //| Power ups
  //| 1) bat increased 100%
  //| 2) score multiplier *1.5
  function getPowerUp() {

    if ((game.powerup >= 1) && (game.powerup <= 2) && (powerup.visible === true)) {

      if (powerup.y > canvas.height) {
        game.powerup       = 0;
        game.powerupActive = 0;
      }

      if ((powerup.y > bat.y) && (powerup.x > bat.x) && (powerup.x < bat.x+bat.w)) {
        powerup.visible = false;
        powerup.x       = Defaults.powerup.x;
        powerup.y       = Defaults.powerup.y;
        game.powerupActive++;
      } else {
        powerup.y = powerup.y+Defaults.powerup.s;
      }
    }

    if (game.powerupActive > 0) {
      game.powerupActive++;

      if (game.powerup === 1) {
        bat.w = Defaults.bat.w * 1.5;
      } else {
        powerMultiplier = 2;
      }
    } 

    if (game.powerupActive >= Defaults.powerup.time) {
      game.powerup       = 0;
      powerup.visible    = false;
      game.powerupActive = 0;
      bat.w              = Defaults.bat.w;

    }
  }
  //********************************************

  //********************************************
  //| Collision and movement of the ball
  function getCollision() {

    if (game.state === 'run') {
      //Doe stuiter-shit met the ball
      if (ball.x + ball.dx > canvas.width-ball.r || ball.x + ball.dx < ball.r) {
          ball.dx = -ball.dx;
          playSound (snd_bounce);
      }

      if (ball.y + ball.dy > canvas.height-ball.r || ball.y + ball.dy < ball.r) {
        ball.dy = -ball.dy;

        if (ball.dy < 0) {
          game.lives--;
          
          //Resetting ball and bat
          game.state = 'play_ready'; 
          resetBatBall();

          if (game.lives === 0) {
            var strHighScore = '';

            game.state = 'gameover';
            playSound (snd_lose);

            if ((game.score >= game.highscore) && (game.score > 0)) {
              strHighScore = '<br><br><strong>GREAT! You have the beaten the highscore!</strong>';
              setCookie ('BO_highscore', game.score, 7);
            }

            var options = {
              message: 'Game over, your score is: <strong>' + game.score + '</strong>.' + strHighScore + '<br><br>Press restart to go again',
              title: 'GAME OVER',
              useBin: true
            };

            eModal.alert(options);

            $('#game-stop').hide  ();
            $('#game-start').show ();
            $('#game-start').text (' Restart ');
            $('#pauze-game').prop ('disabled', true);
          } else {
            playSound (snd_miss_ball);
          }
        } else {
          playSound (snd_bounce);
        }
      }

      //Collision of the bat
      if (((ball.x+ball.r/2 >= bat.x) && (ball.x-ball.r/2 <= bat.x+bat.w)) && ((ball.y+ball.r/2 >= bat.y) && (ball.y-ball.r/2 <= bat.y+bat.h))) {
        var posBallBat = ball.x - bat.x;
        playSound(snd_bounce);

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

        //if (((ball.x+ball.r/2 >= block[i].x) && (ball.x-ball.r/2 <= block[i].x+block[i].w)) && ((ball.y+ball.r/2 >= block[i].y) && (ball.y-ball.r/2 <= block[i].y+block[i].h)) && (block[i].visible === 'yes')) {
        if (((ball.x+ball.r/2 >= block[i].x) && (ball.x-ball.r <= block[i].x+block[i].w)) && ((ball.y+ball.r/2 >= block[i].y) && (ball.y-ball.r <= block[i].y+block[i].h)) && (block[i].visible === 'yes')) {
          playSound(snd_bounce);

          if (powerup.visible === false) {
            game.powerup = Math.round((Math.random() * 5));
          }

          if ((game.powerup >= 1) && (game.powerup <= 2) && (powerup.visible === false)) {
            powerup.visible = true;
            powerup.x       = ball.x;
            powerup.y       = ball.y+ball.r;
          }

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
            if ((ball.x+ball.r <= block[i].x+block[i].w) && (ball.y >= block[i].y+block[i].h)) {
              //console.log ('Bottom');
              ball.dx = +ball.dx;
              ball.dy = -ball.dy;
            }
          }
          block[i].visible = 'no';
          game.blocksLeft--;
          game.score = game.score + (10 * block[i].multiplier) + (game.powerup * powerMultiplier);

          if ((game.score > game.highscore) && (game.score > 0)) {
            game.highscore = game.score;
          }
        }
      }

      if (game.state != 'pauze') {
        ball.changePosition (ball.x + ball.dx, ball.y + ball.dy);
      }

      //You have won the level!!!!
      if (game.blocksLeft === 0) {
 
        sleep (10);
        playSound (snd_win);

        if (game.lives <= 5) {
          game.lives++;
        }

        game.level++;
        if (game.level >= levels.length) {
          game.level = 1;
        }

        game.powerup = 0;

        //sleep (1000);
        loadLevel ();
        resetBatBall ();

        game.state = 'play_ready'; //ready_run
      }
    } else {
      ball.changePosition (bat.x + 50, Defaults.ball.y);
    }
  }
  //********************************************

  //Play sound, but only when the icon is checked
  function playSound(sound) {
    if ($('#sound').is(':checked') === true) {
        sound.play ();
    }
  }

  //********************************************
  //| Use cookies to set the highscore
  //| Write the highscore
  function setCookie(name, value, days) {
    if (days) {
        var date = new Date ();
        date.setTime (date.getTime () + (days*24*60*60*1000));
        var expires = '; expires=' + date.toGMTString ();
    }
    else var expires = '';
    document.cookie = name + '=' + value+expires + '; path=/';
  }

  //Get the highscore
  function getCookie(name) {
    var nameEQ = name + '=';
    var ca = document.cookie.split (';');
    for (var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring (1, c.length);
        if (c.indexOf (nameEQ) == 0) return c.substring (nameEQ.length, c.length);
    }
    return null;
  }

  function eraseCookie(name) {
    createCookie (name,'',-1);
  }
  //********************************************

  //********************************************
  //| Definition of the game object
  //| An object has variables and functions (methods)
  //| 
  //| Object to store all the game variables
  function gameSettings(state, level, score, lives, blocks, blocksLeft, powerup, powerupActive) {

    this.state         = state;
    this.level         = level;
    this.score         = score;
    this.lives         = lives;
    this.blocks        = blocks;
    this.blocksLeft    = blocksLeft; 
    this.powerup       = powerup;
    this.powerupActive = powerupActive;

    gameSettings.prototype.changeBlocks = function(blocks) {
      this.blocks = blocks;
    }

    gameSettings.prototype.changeBlocksLeft = function(blocksLeft) {
      this.blocksLeft = blocksLeft;
    }

    gameSettings.prototype.changeLevel = function(level) {
      this.level = level;
    }

    gameSettings.prototype.changePowerUpActive = function(powerupActive) {
      this.powerupActive = powerupActive;
    }

    gameSettings.prototype.init = function(state, level, score, lives, blocks, blocksLeft, powerup, powerupActive) {
      this.state         = state;
      this.level         = level;
      this.score         = score;
      this.lives         = lives;
      this.blocks        = blocks;
      this.blocksLeft    = blocksLeft; 
      this.powerup       = powerup;
      this.powerupActive = powerupActive;
    };
  } 

  //| Object to store all the ball variables
  function objectBall(x, y, r, color, dx, dxMax, dy){

    this.x     = x;
    this.y     = y;
    this.r     = r;
    this.color = color
    this.dx    = dx;
    this.dxMax = dxMax;
    this.dy    = dy;

    objectBall.prototype.init = function(x, y, r, color, dx, dxMax, dy) {
      this.x     = x;
      this.y     = y;
      this.r     = r;
      this.color = color;
      this.dx    = dx;
      this.dxMax = dxMax;
      this.dy    = dy;
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

  //| Object to store all the bat variables
  function objectBat(x, y, w, h, s, borderColor, fillColor) {

    this.x           = x;
    this.y           = y;
    this.w           = w;
    this.h           = h;
    this.s           = s;
    this.border      = borderColor;
    this.fill        = fillColor;

    objectBat.prototype.init = function(x, y, w, h, s, borderColor, fillColor) {
      this.x      = x;
      this.y      = y;
      this.w      = w;
      this.h      = h;
      this.s      = s;
      this.border = borderColor;
      this.fill   = fillColor;
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

    //Make sure the bat is not going out of the canvas
    objectBat.prototype.moveLeft = function() {
      this.x = this.x - this.s;
      if (bat.x < 0)  bat.x = 0;
    };


    //Make sure the bat is not going out of the canvas
    objectBat.prototype.moveRight = function() {
      this.x = this.x + this.s;
      if (bat.x > (canvas.width-bat.w))  bat.x = (canvas.width-bat.w);
    }

    objectBat.prototype.draw = function() {

      ctx.beginPath ();
      ctx.rect (this.x, this.y, this.w, this.h);
      
      //When I really want round corners :)
      //ctx.lineJoin = 'round';
      //ctx.lineWidth = 10;

      ctx.fillStyle = this.fill;
      ctx.fill ();
      ctx.lineWidth  = 2;
      ctx.strokeStyle = this.border;
      ctx.stroke ();
    };
   
  };

  //| Object to store all the block variables
  //| Blocks are an array for this game
  function objectBlock(x, y, w, h, borderColor, fillColor, visible, multiplier) {
    this.x          = x;
    this.y          = y;
    this.w          = w;
    this.h          = h;
    this.border     = borderColor;
    this.fill       = fillColor;
    this.visible    = visible; 
    this.multiplier = multiplier;

   objectBlock.prototype.init = function(x, y, w, h, borderColor, fillColor, visible, multiplier) {
      this.x          = x;
      this.y          = y;
      this.w          = w;
      this.h          = h;
      this.border     = borderColor;
      this.fill       = fillColor;
      this.visible    = visible;
      this.multiplier = multiplier;
    };

    objectBlock.prototype.hit = function(visible) {
      this.visible = visible;
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

  //| Object to store all the powerup variables and methods
  function objectPowerUp(type, x, y, r, w, h, color, visble) {
    this.type    = type;
    this.x       = x;
    this.y       = y;
    this.r       = r;
    this.w       = w,
    this.h       = h,
    this.color   = color
    this.visible = visble;

    objectPowerUp.prototype.init = function(type, x, y, r, w, h, color, visble) {
      this.type   = type;
      this.x      = x;
      this.y      = y;
      this.r      = r;
      this.w      = w;
      this.h      = h;
      this.color  = color;
      this.visble = visble;
    };

    objectPowerUp.prototype.drawCircle = function() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    };

    objectPowerUp.prototype.drawCube = function() {
      ctx.beginPath ();
      ctx.rect (this.x, this.y, this.w, this.h);
      ctx.fillStyle = this.color;
      ctx.fill ();
      ctx.lineWidth  = 1;
      ctx.strokeStyle = this.color;
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

  function resetBatBall() {
    powerup.x          = Defaults.powerup.x;
    powerup.y          = Defaults.powerup.y;
    powerup.visible    = false;
    game.powerup       = 0;
    game.powerupActive = 0;
    ball.dx            = Defaults.ball.dx;
    ball.dy            = Defaults.ball.dy;
    bat.x              = Defaults.bat.x;
    bat.y              = Defaults.bat.y;
    bat.w              = Defaults.bat.w;    
    ball.changePosition (Defaults.ball.x, Defaults.ball.y);
  }

  function restartGame() {
    resetBatBall();
    game.lives     = Defaults.game.lives;
    game.highscore = game.score;
    game.score     = 0;
    game.level     = 1;
    game.state     = 'play';
    loadLevel ();
    sleep (1000);
    draw ();
  }

  function stopLoop() {
    clearInterval (Defaults.game.handle);
  }

  function startLoop() {
    clearInterval (Defaults.game.handle);
    Defaults.game.handle = setInterval (run, (Defaults.game.interval / Defaults.game.fps));
  }

  function sleep(miliseconds) {
    var currentTime = new Date ().getTime ();

    //Really do nothing :)    
    while (currentTime + miliseconds >= new Date ().getTime ()) {
    }
  }

  function drawDebugInformation() {
    $('#debug').show ();

    $('#fps').text      (Math.round(Defaults.game.interval / Defaults.game.fps));
    $('#state').text    (game.state);
    $('#batx').text     (Math.round(bat.x));
    $('#baty').text     (Math.round(bat.y));
    $('#ballx').text    (Math.round(ball.x));
    $('#ballxs').text   (Math.round(ball.dx));
    $('#bally').text    (Math.round(ball.y));
    $('#ballys').text   (Math.round(ball.dy));
    $('#total').text    (game.blocks);
    $('#left').text     (game.blocksLeft);
    $('#power').text    (game.powerup);
    $('#pvisible').text (powerup.visible);
    $('#cycles').text   (game.powerupActive);
    $('#powerx').text   (Math.round(powerup.x));
    $('#powery').text   (Math.round(powerup.y));
  }
});