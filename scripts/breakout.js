//Setting the default values for the game
var Defaults = {

  game: {                   //The game object default values. During the game these values will used to reset 
    fps       : 60,         //The times the page needs to be refresed. By default 60(fps) is required
    interval  : 1000,       //The default interval. Is used in the function SetInterval
    state     : 'start',    //The inital state of the game
    handle    : null,       //The handle of the gameloop. A central variable that will be changed using setInterval
    level     : 1,          //The starting level
    score     : 0,          //The score of the player
    lives     : 3,          //amount of live to begin the game with
    livesMax  : 5,          //The number of maximum lives a player can get
    blocks    : 0,          //Total amount of blocks in the level. Will be set when the level is loaded 
    blocksLeft: 0,          //Amount of blocks left in the level will be stored here. When a block is hit this will be detracted
    highscore : 0,          //The highscore
    powerup   : '',         //If there is a powerup
  },

  ball: {                   //The ball oject default values
    x    : 400,             //Pos X on the board
    y    : 490,             //Pos y on the board
    r    : 7,               //The radius of the ball
    color: '#854442',       //The color of the ball
    dx   : 3,               //The x-speed of the ball
    dxMax: 7,               //The y-speed of the ball
    dy   : -7,              //Based on the position the ball hit the bat, the angle is changed by changing the y-speed. This is the max-y-speed
  },

  bat: {                    //The bat object defaults values
    x          : 350,       //X-position of the bat
    y          : 500,       //Y-position of the bat
    w          : 100,       //Width of the bat
    h          : 10,        //Height of the bat
    s          : 8,         //Speed of the bat; left, right
    borderColor: '#854442', //Border color of the bat 
    fillColor  : '#be9b7b', //Fill color of the bat
  },

  powerup: {                //The powerup object default values
    x          : 0,         //Default X-position of the powerup. Based on the block hit, the x-posistion is changed 
    y          : 0,         //Default Y-position of the powerup. Based on the block hit, the y-posistion is changed
    r          : 7,         //Radius of the ball-powerup
    w          : 15,        //Width of the block-powerup
    h          : 15,        //Heigth of the block-powerup
    s          : 3,         //Speed of the powerup. It always falls down in the same line. So this will change the x-speed
    color      : '#4b3832', //Color of the powerup object
    time       : 240,       //amount of cycles the powerup is active. 16*15seconds
  },

  blocks: {                 //The block objects default values
    startBlockY : 50,       //Start Y-position of drawing the blocks
    startBlockX : 10,       //Start X-position of drawing the blocks
    blockLength : 60,       //Length of the blocks (now 13, based on 40px, 20)
    blockHeight : 20,       //Height of the blocks
    blockSpacing: 0,        //The amount of x-spacing between the blocks 
  }
};

var layouts = {             //Each level can have a theme based on the layout. A layout is required to draw the blocks

  facebook: {               //Layout name
    border: '#3b5998',      //Border color
    block1: '#8b9dc3',      //Color of type block1
    block2: '#dfe3ee',      //Color of type block2
    block3: '#f7f7f7',      //Color of type block3
    block4: '#ffffff',      //Color of type block4
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
  var powerMultiplier = 0;                                        //
  //********************************************

  //********************************************
  //| Load the sound items
  var snd_start         = AudioFX('sounds/8bit_ready_go',      { formats: ['wav', 'mp3', 'm4a'], volume: 0.1, pool: 2 });     //Count down sound when staring a level
  var snd_lose          = AudioFX('sounds/8bit_lose',          { formats: ['wav', 'mp3', 'm4a'], volume: 0.1, pool: 2 });     //Win the level
  var snd_win           = AudioFX('sounds/8bit_win',           { formats: ['wav', 'mp3', 'm4a'], volume: 0.1, pool: 2 });     //Lose the level
  var snd_miss_ball     = AudioFX('sounds/8bit_failure',       { formats: ['wav', 'mp3', 'm4a'], volume: 0.1, pool: 2 });     //Lose the game
  var snd_bounce        = AudioFX('sounds/8bit_bounce',        { formats: ['wav', 'mp3', 'm4a'], volume: 0.1, pool: 20});     //It is possible to hit multiple blocks before the sound is done playing. By adding pool I can play 20 sounds simultaneously 
  var snd_power_up      = AudioFX('sounds/8bit_power_up',      { formats: ['wav', 'mp3', 'm4a'], volume: 0.5, pool: 2});      //Trigger a powerup
  var snd_power_up_got  = AudioFX('sounds/8bit_power_up_got',  { formats: ['wav', 'mp3', 'm4a'], volume: 0.2, pool: 2});      //Enable a powerup
  //********************************************
  
  //| The defined levels
  //| field 0 = level ID, first item in the array is not a level
  //| field 1 = layout, what color scheme to be used
  //| field 2 = the level
  //|            0) no block 
  //|            1 till 4) scheme colors
  //|            4) Scheme color nr: 4
  //|            -) Next line
  //| It is not required to draw the full length of the line
  //| Level, starts on 10, length = 60  
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
  var powerup      = null;    //PowerUp object
  var touchscreen  = false;
  //********************************************

  //********************************************
  //| Current implementation of starting stopping or pauzing the game
  //| Start the game
  $('#game-start').click(function(){

    if (game.state === 'gameover') {      //Check the game state
      restartGame();                      //If gameover than restart the game
    }
    $('#game-start').hide();              //Hide button 'Game-start'
    $('#game-stop').show();               //Show button 'Game-stop'
    startLoop();                          //Start the gameloop
    
    game.state = 'play_ready';            //Change the state to 'play_ready'
  });

  //Stop the game. If you press stop a confirm button is displayed to confirm your choice. Based on that solution, the game will continue or is resetted
  $('#game-stop').click(function(){
    stopLoop();                           //Stop the game loop

    var options = {                       //Using the library 'eModal.js'
            message: 'Do you really want to quite? <br><br> I am sure you will beat the game! Common just one more level... you will be amazed!',   //Message that is displayed
            title:   ':( You leaving already ?',                                                                                                    //The title of the box
            size:    eModal.size.s,                                                                                                                 //Size; s, m, l, et cetera
            label:   'Yes'                                                                                                                          //Type of labels Yes/No
      };

      eModal.confirm(options).then(function(){        //When the user press "Yes", I want to stop the Game
        $('#game-stop').hide  ();                     //Hide 'game-stop' button
        $('#game-start').show ();                     //Show 'game-start' button
        $('#game-start').text (' Start ');            //Change the text on the button to ' Start '
        $('#pauze-game').prop ('disabled', true);     //Disable the 'pauze-game' button

        drawText('', 1, 1);                           //Draw no text on the canvas 


        restartGame();                                //Restart the game setting

      }, function() {                                 //When the user press "No", I don't want to stop the game
        startLoop();                                  //Start the gameloop again 
      });
  });

  //| Check the status and based on that the game will be paused.
  //| Also the text on the button will changed
  $('#pauze-game').click(function(){
    if ($('#pauze-game').text() === ' Pauze ') {    //Check the text of the button
      game.state = 'pauze';                         //Change the status of the game
      stopLoop();                                   //Stop the gameloop
      $('#pauze-game').text(' Resume ');            //Chnage the text of the button
    } else {
      game.state = 'run';
      startLoop();                                  //Start the gameloop
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

    //Check if the user has a touchscreen 
    // if (!is_touch_device()) {
    //   touchscreen = false;
    // } else {
    //   touchscreen = true;
    // }

    //*******************************************************
    //| New game object and initalize it
    //| It uses the variables in the Defaults-object
    game = new gameSettings();
    game.init ('play', Defaults.game.level, Defaults.game.score, Defaults.game.lives, Defaults.game.blocks, Defaults.game.blocksLeft, 0, Defaults.powerup.time, false, is_touch_device());

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
    window.addEventListener ('keyup',   function(event) { Key.onKeyup(event); },   false);
    window.addEventListener ('keydown', function(event) { Key.onKeydown(event); }, false);


    window.addEventListener("touchstart",  touchHandler, true);
    window.addEventListener("touchmove",   touchHandler, true);
    window.addEventListener("touchend",    touchHandler, true);
    window.addEventListener("touchcancel", touchHandler, true);
    enable_scroll();
  }

  //********************************************
  //| The game loop
  function run() {

    getInput();                 //Get user input
    getCollision();             //Get and process ball collision
    getPowerUp();               //Process the powerups

    draw();                     //Function to draw all the elements that needs to be refresed every cycle
  }
  //********************************************

  //********************************************
  //| Load each level
  function loadLevel() {
    var strLevel   = levels[game.level][2];         //Get the level. All levels are in an array. Get the correct element [game.level] and get the second value, the level
    var arrayLevel = 0;                             
    var blockX     = Defaults.blocks.startBlockX;   //Get the default x-position of the level (always the same)
    var blockY     = Defaults.blocks.startBlockY;   //Get the default y-position of the level (always the same)

    var bc = layouts[levels[game.level][1]].border; //Get the border color. The value is stored in an array. Theme name [game.level[1]], and then the color
    var b1 = layouts[levels[game.level][1]].block1; //Get the color of the blocks. The value is stored in an array. Theme name [game.level[1]], and then the color
    var b2 = layouts[levels[game.level][1]].block2;
    var b3 = layouts[levels[game.level][1]].block3;
    var b4 = layouts[levels[game.level][1]].block4;
    var fc = '#FFFFFF';                             //

    //Delete the block object to prevent all blocks to be loaded
    delete block;

    //Loop through each of the characters of the string
    for (i=0; i<strLevel.length; i++) {

      //Check to determine if the value is different than 0 or -
      if ((strLevel[i] != '0') && (strLevel[i] != '-')) {

        switch (strLevel[i]) {
          case '1': fc = b1; break;   //If the value = 1, use the color b1
          case '2': fc = b2; break;
          case '3': fc = b3; break;
          case '4': fc = b4; break;
        }

        //Create set a new block . Each item is a new object
        block[arrayLevel] = new objectBlock();
        block[arrayLevel].init (blockX, blockY, Defaults.blocks.blockLength, Defaults.blocks.blockHeight, bc, fc, 'yes', strLevel[i]);

        blockX = blockX + Defaults.blocks.blockLength;  //Add the blocklength (width) so the next block is positioned beside it 
        arrayLevel++;                                   //Add 1 to the amount of blocks in the level
      }

      if (strLevel[i] === '0') {                        //If the value is 0, draw 'nothing' > add width to the x-postion
        blockX = blockX + Defaults.blocks.blockLength;
      }

      if (strLevel[i] === '-') {                        //If the value is -, go to the new line
        blockX = Defaults.blocks.startBlockX;                                            //Set the x-position of the first block to the default x-position 
        blockY = blockY + Defaults.blocks.blockHeight + Defaults.blocks.blockSpacing;    //Add the height of the block to the y-position. This will print the new block on a new line
      }
    }

    game.changeBlocks     (arrayLevel);   //Set in the game object the total number of blocks in the level
    game.changeBlocksLeft (arrayLevel);   //Set in the game object the number of blocks left 
  }
  //********************************************

  //********************************************
  //| Draw the items on the page when the game runs
  function draw() {
    //Clear the canvas
    ctx.clearRect (0, 0, canvas.width, canvas.height);

    //Do something based on the game state
    switch (game.state) {
      case 'run_ready' : drawCountDown();                                         break;  //Draw the countdown
      case 'play_ready': drawText('Press <SPACE> to start', 290, 400);            break;  //Draw the text to triggering the player to start the game
      case 'play'      : drawText('', 290, 400);                                  break;  //Draw nothing when the player plays the game
      case 'gameover'  : drawText('Press restart to restart the game', 240, 400); break;  //Draw text when all lives are gone :(
    }

    //**************************************
    //| Draw the powerup's
    //| 1) circle > widen bat
    //| 2) add a multiplier to the score
    //| Only draw when 1 or 2 is draw and the powerup must be displayed (visible, yes)
    if (powerup.visible === true) {
      switch (game.powerup) {
        case 1: powerup.drawCircle(); break;      //Draw power-up: circle
        case 2: powerup.drawCube();   break;      //Draw power-up: cube
      }
      $('#progress-bar').css('width', '100%');
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

    //Function to update the UI
    updateUI();
  }
  //********************************************

  //********************************************
  //| Draw text, takes 3 arguments
  //| Text : The text
  //| X    : The x-postion where the text must be displayed
  //| Y    : The y-postion where the text must be displayed
  function drawText(text, x, y) {
    ctx.font = '20px verdana';    //Set the font-family and font-size
    ctx.fillStyle = 'red';        //Set the font-color
    ctx.fillText (text, x, y);    //Display the text that takes the arguments
  }
  //********************************************

  //********************************************
  //| Function to display the countdown
  //| The following global variables are needed :(. Each frame the function is called
  var strCount = [['Three...'], ['Two..'], ['One.'], ['Go!!!']];  //Array of strings that will be displayed  
  var count  = 0;                                                 //The variable for the cycle count
  var count1 = 0;                                                 //The variable to display the correct item in the array
  function drawCountDown() {

    if (count < 121) {                                            //Only enter when less then 121 cycles
      if ((count === 40) || (count === 80) || (count === 120)) {  //Every 40 cycles, the item of the array must change
        count1++;                                                 //Go to the next item in the array
      }
    }

    ctx.font = '26px verdana';                                    //Set the font-family and font-size
    ctx.fillStyle = 'red';                                        //Set the font-color
    ctx.fillText (strCount[count1] || '', 350, 400);              //Display the correct item in the array 
    count++;                                                      //Add one cycle

    if (count === 121) {                                          //If 121 cycles are passed
      game.state = 'run';                                         //Set gamestate to 'run'
      count = 0;                                                  //Reset variables
      count1 = 0;
    }
  }
  //********************************************
  
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
      $('#pauze-game').prop ('disabled', false);    //If the gamestate is running, the button 'pauze-game' must be enabled 
    } else {
      $('#pauze-game').prop ('disabled', true);     //If the gamestate is not running, the button 'pauze-game' must be disabled
    }

    drawDebugInformation ();                    //Show debug information
  }
  //********************************************

  //********************************************
  //| Get the keyboard input and process it
  function getInput() {

    // if (game.touchenabled === true) {
    //   touchHandler();
    // }

    //Based on the game state it is allowed to move the bat. Even if the game is not running! It must be started 
    if ((game.state === 'play') || (game.state === 'run_ready') || (game.state === 'play_ready')  || game.state === 'run') {

      if (Key.isDown (Key.LEFT))  bat.moveLeft ();        //If the left-key is pressed, move the bat left
      if (Key.isDown (Key.RIGHT)) bat.moveRight ();       //If the right-key is pressed, move the bat right
    }

    //If the gamestate equals to 'play_ready', and the spacebar is pressed..... GAME ON!
    if (Key.isDown (Key.SPACE) && (game.state === 'play_ready'))   {
      game.state = 'run_ready';                           //Change the game-state
      playSound (snd_start);                              //Play the start-sound
    }
  }
  //********************************************

  //********************************************
  //| Power ups
  //| 1) bat increased 100%
  //| 2) score multiplier *1.5
  function getPowerUp() {

    if (powerup.visible === true) {                                                   //Check if the power-up items is triggered 
      if ((powerup.y > bat.y) && (powerup.x > bat.x) && (powerup.x < bat.x+bat.w)) {  //Check of the power-up hits the bat
        powerup.visible    = false;                 //Hide the power-up item
        powerup.x          = Defaults.powerup.x;    //Reset values to default
        powerup.y          = Defaults.powerup.y;
        game.powerupActive = true;                  //Set the powerup to Active, meaning: the player has a powerup!
        snd_power_up_got.play();                    //Play a sound
      } else {
        powerup.y = powerup.y+Defaults.powerup.s;   //Let the power-up falls down (change x-position)
      }

      if (powerup.y > canvas.height) {              //If the power-up hits the bottom of the canvas
        powerup.visible    = false;                 //Hide the power-up item
        powerup.x          = Defaults.powerup.x;    //Reset values to default
        powerup.y          = Defaults.powerup.y;
        $('#progress-bar').css('width', '0%');      //Set the power-up progressbar to 0 
      }
    }

    if (game.powerupActive === true) {              //If the power-up is active
      game.powerupTime--;                           //Decline the powerup time

      var progressWidth = Math.round(100 - (100 - (game.powerupTime / (Defaults.powerup.time / 100))));   //Count the percentage based on the cycle
      $('#progress-bar').css('width', progressWidth+'%');                                                 //Countdowns in the progressbar (100 > 0)


      switch (game.powerup) {                           //Set the powerup
        case 1:  bat.w = Defaults.bat.w * 1.5;  break;  //Widthen the bat
        case 2:  powerMultiplier = 2;           break;  //Add a multipllier to the score
      }

      if (game.powerupTime === 0) {                     //If the power-up time is over :(, reset to defaults
        game.powerupActive = false;
        game.powerupTime = Defaults.powerup.time;
        bat.w = Defaults.bat.w;
        powerMultiplier = 1;
      }
    }
  }
  //********************************************

  //********************************************
  //| Collision and movement of the ball
  //| The colision detection is basd on the coordinates of the objects.
  //| It is important to make sure the radius in consideration for the Callculation. Otherwise it can happen that the ball is over the bat or blocks
  function getCollision() {

    //Only do something when the game is running (state run)
    if (game.state === 'run') {   
      
      //Bounce agains the walls
      if (ball.x + ball.dx > canvas.width-ball.r || ball.x + ball.dx < ball.r) {
          ball.dx = -ball.dx;
          playSound (snd_bounce);
      }

      //Bounce against the top and bottom of the canvas
      if (ball.y + ball.dy > canvas.height-ball.r || ball.y + ball.dy < ball.r) {
        ball.dy = -ball.dy;

        //If the ball hits the ground, a live will be detracted 
        if (ball.dy < 0) {
          game.lives--;                 //Detract one of the lives 
          
          game.state = 'play_ready';    //Set the gamestate to 'play_ready' (press SPACE to start again)
          resetBatBall();               //Resetting ball and bat

          if (game.lives === 0) {       //If the amount of lives euqals to 0, game over
            var strHighScore = '';      //Set stringvalue to '' (nothing)

            game.state = 'gameover';    //Set gamestate to gameover
            playSound (snd_lose);       //Play lose sound 

            if ((game.score >= game.highscore) && (game.score > 0)) {                                 //Check if your game beats the highscore
              strHighScore = '<br><br><strong>GREAT! You have the beaten the highscore!</strong>';    //Change the highscore string 
              setCookie ('BO_highscore', game.score, 7);                                              //Save the highscore in the cookie, days valid  7
            }

            var options = {                                                                                                                   //Define the model window
              message: 'Game over, your score is: <strong>' + game.score + '</strong>.' + strHighScore + '<br><br>Press restart to go again', //The message. You can use HTML market for text
              title: 'GAME OVER',                                                                                                             //The title of the window
              useBin: true                                                                                                                    //Only have a OK button
            };

            eModal.alert(options);  //Display a model window using eModal

            $('#game-stop').hide  ();                   //Hide the game-stop button
            $('#game-start').show ();                   //Show the game-start button
            $('#game-start').text (' Restart ');        //Change the text of the game-start
            $('#pauze-game').prop ('disabled', true);   //Disable the pauze-game button
          } else {
            playSound (snd_miss_ball);  //Play sound that you miss the ball
          }
        } else {
          playSound (snd_bounce);       //Play sound bouce
        }
      }

      //Collision of the bat
      //The logic: (it checks basicly the whole area of the bat)
      // x    |========================| x,w
      //      |                        |
      // x,h  |========================| x,h,w
      //1) The x-position of the ball must be larger than the x-position of the bat
      //2) The x-position of the ball must be smaller than the x-position of the bat plus the width of the bat
      //3) The y-position of the ball must be larger than the y-position of the bat
      //4) The y-position of the ball must be smaller than the y-position of the bat plus the width of the bat
      if (((ball.x+ball.r/2 >= bat.x) && (ball.x-ball.r/2 <= bat.x+bat.w)) && ((ball.y+ball.r/2 >= bat.y) && (ball.y-ball.r/2 <= bat.y+bat.h))) {
        var posBallBat = ball.x - bat.x;
        playSound(snd_bounce);

          //Checks if the ball hits the side of the bat
        if ((ball.x >= bat.x) && (ball.x <= (bat.x+bat.w)) && ((ball.y >= bat.y) && (ball.y <= bat.y+bat.h))) {
          //console.log ('Side');
          ball.dx = -ball.dx;       //Change x-direction of the ball to a negative value (it goes to the left) 
          ball.dy = +ball.dy;       //Change y-direction of the ball to a positive value (it goes down)
        }

        //Checks of the ball in somewere in the x-area of the bat (x-pos till x-width)
        if ((ball.x >= bat.x) && (ball.x <= (bat.x+bat.w)))  {

          //Checks if the ball hits the top of the bat. Y-position of the bat must be smaller than y-position of the ball
          if (ball.y <= bat.y) {
            //console.log ('Top');

            //Callculate the new angle of the ball. End of the bat is max y, mid of the bat min y
            //It takes into consideration the width of the bat. 
            //1) When the ball is on the left part, the ball goes let
            //2) When the ball hits the center, the ball goes straight up
            //3) When the ball hits the right part, the ball goes right
            //The closer to side of the bat, the wider the angle
            //Based on the outcome a positive or negative value will be put into newX
            if (posBallBat > (bat.w/2)) {
              var newX = (bat.w/2) - posBallBat;
              ball.dx = ball.dxMax * (newX / -(bat.w/2));
            } else {

              var newX = (bat.w/2) - posBallBat;
              ball.dx = ball.dxMax * (newX / -(bat.w/2));
            }
            ball.dx = +ball.dx;    //Change x-direction of the ball to the oposite direction (a negative negative value will be positive)
            ball.dy = -ball.dy;    //Change y-direction of the ball to a negative value (it goes up)
          } 

          //Checks if the ball hits the bottom of the bat
          if ((ball.x <= bat.x+bat.w) && (ball.y >= bat.y+bat.h)) {
            //console.log ('Bottom');
            ball.dx = +ball.dx;     //Change x-direction of the ball to a positive value (it goes to the right)
            ball.dy = -ball.dy;     //Change y-direction of the ball to a negative value (it goes up)
          }
        }
      }

      //Collision of the blocks
      //It uses the same logic as the colision-check of the bat
      //The colision will be checked for all blocks
      for (i=0; i<game.blocks; i++) {

        if (((ball.x+ball.r/2 >= block[i].x) && (ball.x-ball.r <= block[i].x+block[i].w)) && ((ball.y+ball.r/2 >= block[i].y) && (ball.y-ball.r <= block[i].y+block[i].h)) && (block[i].visible === 'yes')) {
          playSound(snd_bounce);

          //Is there is no powerup on the field?...
          if (powerup.visible === false) {
            game.powerup = Math.round((Math.random() * 5));     //Random a number between 1 and 5
          }

          //If there is no powerup visible or powerup active
          if ((game.powerupActive === false) && (powerup.visible === false)) {
            switch (game.powerup) {
              case 1:                             //Do something when the value is 1 or 2
              case 2:                             
                powerup.visible = true;           //Show the powerup
                powerup.x       = ball.x;         //Set the x-position of the powerup to the x-position of the ball
                powerup.y       = ball.y+ball.r;  //Set the y-position of the powerup to the y-position of ball plus radius of the ball
                snd_power_up.play();              //Play sound
                break;
            }
          }

          //Check if the sides of the block is hit
          if ((ball.x >= block[i].x) && (ball.x <= (block[i].x+block[i].w)) && ((ball.y >= block[i].y) && (ball.y <= block[i].y+block[i].h))) {
            //console.log ('Side');
            ball.dx = -ball.dx;     //Change x-direction of the ball to a negative value (it goes to the left)
            ball.dy = +ball.dy;     //Change y-direction of the ball to a negative value (it goes down)
          }

          //Check if the top of the block is hit
          if ((ball.x >= block[i].x) && (ball.x <= (block[i].x+block[i].w)))  {
            if (ball.y <= block[i].y) {
              //console.log ('Top');
              ball.dx = +ball.dx;
              ball.dy = -ball.dy;
            } 
            //Check if the bottom of the block is hit
            if ((ball.x+ball.r <= block[i].x+block[i].w) && (ball.y >= block[i].y+block[i].h)) {
              //console.log ('Bottom');
              ball.dx = +ball.dx;
              ball.dy = -ball.dy;
            }
          }
          block[i].visible = 'no';                                                                    //If the block is hit, hide the block (visible = no) 
          game.blocksLeft--;                                                                          //Detract blockleft with 1
          game.score = game.score + (10 * block[i].multiplier) + (game.powerup * powerMultiplier);    //Increase the score, also take the power-up multiplier into account

          if ((game.score > game.highscore) && (game.score > 0)) {      //If the score is higher to the highscore
            game.highscore = game.score;                                //Highscore is score
          }
        }
      }

      //Pauze the game
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

    //********************************************
  //Play sound, but only when the icon is checked
  function playSound(sound) {
    if ($('#sound').is(':checked') === true) {    //Check if the checkbox 'sound' is checked by the player
        sound.play ();                            //If so, you can play sounds :). Each sound that needs to be played will trigger this function
    }
  }
  //********************************************

  //********************************************
  //| Use cookies to set the highscore
  //| Write the highscore
  function setCookie(name, value, days) {
    if (days) {
        var date = new Date ();
        date.setTime (date.getTime () + (days*24*60*60*1000));
        var expires = '; expires=' + date.toGMTString ();           //Set when the date will expire
    } else {
      var expires = '';
    }
    document.cookie = name + '=' + value + expires + '; path=/';    //Write the cookie
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

  //Erase the cookie
  function eraseCookie(name) {
    createCookie (name,'',-1);
  }
  //********************************************

  //********************************************
  //| Definition of the game object
  //| An object has variables and functions (methods)
  //| 
  //| Object to store all the game variables
  function gameSettings(state, level, score, lives, blocks, blocksLeft, powerup, powerupTime, powerupActive, touchenabled) {

    this.state         = state;
    this.level         = level;
    this.score         = score;
    this.lives         = lives;
    this.blocks        = blocks;
    this.blocksLeft    = blocksLeft; 
    this.powerup       = powerup;
    this.powerupTime   = powerupTime;
    this.powerupActive = powerupActive;
    this.touchenabled  = touchenabled; 

    gameSettings.prototype.changeBlocks = function(blocks) {
      this.blocks = blocks;
    }

    gameSettings.prototype.changeBlocksLeft = function(blocksLeft) {
      this.blocksLeft = blocksLeft;
    }

    gameSettings.prototype.changeLevel = function(level) {
      this.level = level;
    }

    gameSettings.prototype.changepowerupTime = function(powerupTime) {
      this.powerupTime = powerupTime;
    }

    gameSettings.prototype.init = function(state, level, score, lives, blocks, blocksLeft, powerup, powerupTime, powerupActive, touchenabled) {
      this.state         = state;
      this.level         = level;
      this.score         = score;
      this.lives         = lives;
      this.blocks        = blocks;
      this.blocksLeft    = blocksLeft; 
      this.powerup       = powerup;
      this.powerupTime   = powerupTime;
      this.powerupActive = powerupActive;
      this.touchenabled  = touchenabled;
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
  function objectPowerUp(type, x, y, r, w, h, color, visible) {
    this.type    = type;
    this.x       = x;
    this.y       = y;
    this.r       = r;
    this.w       = w,
    this.h       = h,
    this.color   = color
    this.visible = visible;

    objectPowerUp.prototype.init = function(type, x, y, r, w, h, color, visible) {
      this.type    = type;
      this.x       = x;
      this.y       = y;
      this.r       = r;
      this.w       = w;
      this.h       = h;
      this.color   = color;
      this.visible = visible;
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
    _pressed: {},           //Array of the key-codes you want to check the code on

      LEFT:   37,           //key code for the left-key
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
        return this._pressed[keyCode];        //Check if a key is pressed. It will check based on the items in the array _pressed 
      },
      
      onKeydown: function(event) {            
        this._pressed[event.keyCode] = true;  //Return the value true when the user is pressing the key down
      },
      
      onKeyup: function(event) {
        delete this._pressed[event.keyCode];  //Delete the object when the user releases the key
      }
  };

  //Function to determine if the user has a touch screen
  function is_touch_device() {
    return (('ontouchstart' in window)
      || (navigator.MaxTouchPoints > 0)
      || (navigator.msMaxTouchPoints > 0));
  }

  function enable_scroll() {
    $('body').unbind('touchmove');
  }


function touchHandler(event) {
  // Get a reference to our coordinates div
//  var coords = document.getElementById("coords");
  // Write the coordinates of the touch to the div
//  alert('x: ' + event.touches[0].pageX + ', y: ' + event.touches[0].pageY);


  if (event.touches[0].pageX < canvas.width/2) {
    bat.moveLeft ();
  }

  if (event.touches[0].pageX >= canvas.width/2) {
    bat.moveRight ();
  }

}

/*
  function touchHandler(event) {
      var touches = event.changedTouches,
          first = touches[0],
          type = "";



      switch(event.type)
      {
          case "touchstart": type = "mousedown"; break;
          case "touchmove":  type = "mousemove"; break;        
          case "touchend":   type = "mouseup";   break;
          default:           return;
      }

      // initMouseEvent(type, canBubble, cancelable, view, clickCount, 
      //                screenX, screenY, clientX, clientY, ctrlKey, 
      //                altKey, shiftKey, metaKey, button, relatedTarget);

      var simulatedEvent = document.createEvent("MouseEvent");
      simulatedEvent.initMouseEvent(type, true, true, window, 1, 
                                    first.screenX, first.screenY, 
                                    first.clientX, first.clientY, false, 
                                    false, false, false, 0, null);

      first.target.dispatchEvent(simulatedEvent);
      event.preventDefault();
  }
  */

//   function TouchMove(event) {

//     var touchobj = event.changedTouches[0] // reference first touch point (ie: first finger)
//     startx = parseInt(touchobj.clientX) // get x position of touch point relative to left edge of browser
//     console.log (startx);
// //        statusdiv.innerHTML = 'Status: touchstart<br> ClientX: ' + startx + 'px'
// //        event.preventDefault()

//   }
  //********************************************

  //Reset the ball and bat with the default values
  function resetBatBall() {
    powerup.x          = Defaults.powerup.x;
    powerup.y          = Defaults.powerup.y;
    powerup.visible    = false;
    game.powerup       = 0;
    game.powerupTime   = Defaults.powerup.time;
    game.powerupActive = false;
    ball.dx            = Defaults.ball.dx;
    ball.dy            = Defaults.ball.dy;
    bat.x              = Defaults.bat.x;
    bat.y              = Defaults.bat.y;
    bat.w              = Defaults.bat.w;    
    ball.changePosition (Defaults.ball.x, Defaults.ball.y);

    $('#progress-bar').css('width', '0%');                    //Clear the power-up progress bar
  }

  //Reset the game and game values
  function restartGame() {
    resetBatBall();
    game.lives     = Defaults.game.lives;
    game.highscore = game.score;
    game.score     = 0;
    game.level     = 1;
    game.state     = 'play';
    loadLevel ();                 //Load the level
    sleep (1000);                 //Sleep for 1 second
    draw ();                      //Draw the game
  }

  //Stop the gameloop. The handle is used 
  function stopLoop() {
    clearInterval (Defaults.game.handle);
  }

  //Start the gameloop. The handle is used 
  function startLoop() {
    clearInterval (Defaults.game.handle);                                                     //Make sure there is no interval on the instance
    Defaults.game.handle = setInterval (run, (Defaults.game.interval / Defaults.game.fps));   //Set the interval to the handle and set the cycles
  }

  //Function to 'freeze' the screen. This is differently than setinterval.
  function sleep(miliseconds) {
    var currentTime = new Date ().getTime ();

    //Really do nothing :)    
    while (currentTime + miliseconds >= new Date ().getTime ()) {
    }
  }

  //Display debug information in the 'debug window'. This is only visible when the 'window' is visible. (UpdateUI) 
  function drawDebugInformation() {
    $('#debug').show ();                                                            //Show the div ('Window')

    $('#touch').text    (game.touchenabled);
    $('#fps').text      (Math.round(Defaults.game.interval / Defaults.game.fps));   //Display the cycles in ms. The value is round
    $('#state').text    (game.state);                                               //Display the state in the span
    $('#batx').text     (Math.round(bat.x));
    $('#baty').text     (Math.round(bat.y));
    $('#ballx').text    (Math.round(ball.x));
    $('#ballxs').text   (Math.round(ball.dx));
    $('#bally').text    (Math.round(ball.y));
    $('#ballys').text   (Math.round(ball.dy));
    $('#total').text    (game.blocks);
    $('#left').text     (game.blocksLeft);
    $('#pvisible').text (powerup.visible);
    $('#powert').text   (game.powerup);
    $('#pactive').text  (game.powerupActive);
    $('#cycles').text   (game.powerupTime);
  }
});