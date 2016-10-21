
// //TODO

// //Create bat                  done   .
// //Move bat using keyboard     done   .
// //Create ball                 done   .
// //Move ball                   done   https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Bounce_off_the_walls
// //Let ball bounch             done   https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Bounce_off_the_walls
// //Create collision on wall    done   https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript/Bounce_off_the_walls
// //Create blocks               open
// //Remove blocks               open
// //Create collision on bat     open
// //Create collision on blocks  open
// //Create score                open
// //Create menu                 open
// //Create levels               open






$( document ).ready(function() {


  //var canvas = document.getElementById("#gameCanvas");
  //var ctx = canvas.getContext("2d");
  var canvas = document.getElementById('gameCanvas');
  var ctx = canvas.getContext('2d');

  var ballRadius = 10;
  var x = canvas.width/2;
  var y = canvas.height-30;
  var dx = 2;
  var dy = -2;
  var batX = 100;
  var batY = 550;
  var batW = 100;


  $(document).keydown(function(e){
    var key;

    switch(e.keyCode || e.which) {
      case 37:            //left
        key = 'left';
        batX = batX - 10;
        direction = -5;
        break;
      // case 38:            //up
      //   key = 'up';
      //   break;
      case 39:            //right
        key = 'right';
        batX = batX + 10;
        direction = 15;
        break;
      // case 40:            //down
      //   key = 'down';
      //   break;
      case 27:            //escape
        key = 'Escape';
        break;
    }

    if (batX < 0) batX = 0;
    if (batX > (canvas.width-100)) batX = canvas.width;




  });


  function drawBall() {
      ctx.beginPath();
      ctx.arc(x, y, ballRadius, 0, Math.PI*2);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
  }


  function drawBat() {

    ctx.beginPath();
    ctx.rect(batX, batY, batW, 20);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();

  }


  function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawBall();
      drawBat();
      
      if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
          dx = -dx;
      }
      if(y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
          dy = -dy;
      }
      
      x += dx;
      y += dy;
  }

  setInterval(draw, 10);




});








// //http://stackoverflow.com/questions/11368477/dynamically-resize-canvas-window-with-javascript-jquery

// /*
//   var boxes = [];

//   //Box object to hold data for all drawn rects
//   function Box() {
//     this.x = 0;
//     this.y = 0;
//     this.w = 1; // default width and height?
//     this.h = 1;
//     this.fill = '#444444';
//   }
// */

// /*
// var Keys = {
//         up: false,
//         down: false,
//         left: false,
//         right: false
//     };
// */
// var x = 100;
// var y = 550;
// var xb = 100;
// var yb = 75;
// var canvas = null;
// var context = null;
// var direction = 5;
// var bat = null;
// var ball = null;

// $( document ).ready(function() {

//   init();

// //  canvas = document.getElementById('gameCanvas');
// //  context = canvas.getContext('2d');


// //  var context = $('#gameCanvas').getContext('2d');

//   console.log ('Bat-x: ' + x)
//   console.log ('Bat-y: ' + y)


//   $(document).keydown(function(e){
//     var key;

//     switch(e.keyCode || e.which) {
//       case 37:            //left
//         key = 'left';
//         x = x - 10;
//         direction = -5;
//         break;
//       // case 38:            //up
//       //   key = 'up';
//       //   break;
//       case 39:            //right
//         key = 'right';
//         x = x + 10;
//         direction = 15;
//         break;
//       // case 40:            //down
//       //   key = 'down';
//       //   break;
//       case 27:            //escape
//         key = 'Escape';
//         break;
//     }

//     $('#key').text(key);
//     console.clear();
//     console.log('Bat-x: ' + x);
//     console.log('Bat-y: ' + y);

//     if (x < 0) x = 0;
//     if (x > 700) x = 700;

//     //render(context, x, y, xb, yb);
//   });

//   //render(context, x, y, xb, yb);


//     setInterval(function(){
//         clear(context);
// //        for(rect in objects){
//            bat.anim();
//  //       }
//  //       for (ball in object) {
// //            ball.anim();

//         //}

//     }, 30);

// });


// function init() {
//   canvas = document.getElementById('gameCanvas');
//   context = canvas.getContext('2d');



//   bat = new Square(-40, 200, 40, "yellow", 5);
// //  var rect2 = new Square(0, 100, 40, "blue");
//  // ball = new Ball(0, 100, "blue");

//   //var objects = [rect1, ball1];
    

// }





// function Square(x, y, w, color, dir) 
// {
//     this.x = x;
//     this.y = y;
//     this.w = w;
//     this.color = color;
    
//     this.anim = function() 
//     {
//         if (this.x < context.canvas.width) {
//             this.x += dir;
//             context.fillStyle = this.color;
//             context.strokeStyle = "red";
//             context.lineWidth = 3;
//             context.fillRect(this.x,this.y,this.w,this.w);
//             //context.strokeRect(this.x,this.y,this.w,this.w);
//         }
//         else this.x=-this.w;
//     }
// }


// function Ball(x, y, w, color) {

//   this.x = x;
//   this.y = y;
//   this.color = color;


// //  context.beginPath();



//     this.anim = function() 
//     {
//         if (this.x < context.canvas.width) {
//             this.x += 5;
//   //           context.fillStyle = this.color;
//   //           context.strokeStyle = "red";
//   //           context.lineWidth = 3;
//   //           context.fillRect(this.x,this.y,this.w,this.w);
//   //           context.strokeRect(this.x,this.y,this.w,this.w);
//   // context.fillStyle = this.color;
//   context.beginPath();
//   context.arc(this.x,this.y,5,0,2*Math.PI);
//   context.stroke();

//   //context.arc(x,y,5,0,2*Math.PI);
//   //context.stroke();
//         }
//         else this.x=-this.w;
//     }



// }










// function render(context, x, y, xb, yb) {

//   xb++;

//   console.log(xb);

//   clear(context);

  
//   renderBat(context, x, y);
//   renderBall(context, xb, yb);
// }





// function renderBat(context, x, y) {
//   context.beginPath();
//   context.rect(x, y, 100, 20);
//   context.fillStyle = 'yellow';
//   context.fill();
//   context.lineWidth = 7;
//   context.strokeStyle = 'black';
//   context.stroke();

// }

// function renderBall(context, x, y) {
//   context.beginPath();
//   context.arc(x,y,5,0,2*Math.PI);
//   context.stroke();
// }

// //not happy with this function!!!
// //add x and y of the canvas
// function clear(context) {
//   context.clearRect(0, 0, 800, 600);
// }

// function test() {
//   console.log('test');
// }

// //setInterval(render(context, x, y, xb, yb), 1);
