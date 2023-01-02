class Paddle {
  constructor(x, y) {
    this.score = 0;
    this.posX = x;
    this.posY = y;
  }
  move(d) {
    this.posY += d;
  }
}

class Ball {
  constructor(x, y) {
    this.posX = x;
    this.posY = y;
    this.spd = 1.8;
    this.ang = 0;

    this.moving = false;
  }
  // moves the ball in a given direction (ang)
  // with a constant speed (spd)
  move(d) {
    this.posX += this.spd * Math.cos(this.ang) * d;
    this.posY += this.spd * -Math.sin(this.ang) * d;
  }
  // flip the x component of the ball's angle
  flipX() {
    this.ang = Math.PI - this.ang;
  }
  // "" for the y component
  flipY() {
    this.ang *= -1;
  }
  // generates a random angle between -60 and 60 degrees
  newAngle() {
    this.ang = Math.random() * (2 * Math.PI / 3) - (Math.PI / 3);
  }
}

// keep track of whether the player's
// paddle should move next frame
function keyDown(e) {
  if(e.keyCode === 38) {
    e.preventDefault();
    upArrow = true;
  }
  else if(e.keyCode === 40) {
    e.preventDefault();
    downArrow = true;
  }
  // start ball moving only once
  // a key has been pressed
  ball.moving = true;
}

// ""
function keyUp(e) {
  if(e.keyCode === 38) {
    upArrow = false;
  }
  else if(e.keyCode === 40) {
    downArrow = false;
  }
}

// draws a circle centered at (x, y) with radius r
function drawCirc(x, y, r) {
  graphics.beginPath();
  graphics.arc(x, y, r, 0, 2 * Math.PI);
  graphics.fill();
  graphics.closePath();
}

// physics calculations are completed here
function update(time) {
  // check if either side has won
  if(Math.max(paddle1.score, paddle2.score) === 6) {
    game_over = true;
  }

  // move paddle1 toward ball
  if(ball.moving) {
    if(ball.posY > paddle1.posY + 40 && 
        Math.sin(ball.ang) < 0 &&
        paddle1.posY < 490) {
      paddle1.move(time * 0.15);
    }
    else if(ball.posY < paddle1.posY + 40 &&
        Math.sin(ball.ang) > 0 &&
        paddle1.posY > 10) {
      paddle1.move(-time * 0.15);
    }
  }
  
  // move paddle2 based on player input
  if(upArrow && paddle2.posY > 10) {
    paddle2.move(-time * 0.2);
  }
  else if(downArrow && paddle2.posY < 490) {
    paddle2.move(time * 0.2);
  }

  if(ball.moving) {
    ball.move(time * 0.2);
  }

  // bounce ball off top and bottom walls
  if(ball.posY <= 12 || ball.posY >= 588) {
    ball.flipY();
  }
  
  // bounce ball off the two paddles
  // paddle2
  if(ball.posY >= paddle2.posY
      && ball.posY <= paddle2.posY + 100
      && ball.posX >= paddle2.posX - 12
      && ball.posX <= paddle2.posX
      && Math.cos(ball.ang) > 0) 
  {
    ball.newAngle();
    ball.flipX();
  }
  // paddle1
  else if(ball.posY >= paddle1.posY
      && ball.posY <= paddle1.posY + 100
      && ball.posX >= paddle1.posX + 20
      && ball.posX <= paddle1.posX + 32
      && Math.cos(ball.ang) < 0) 
  {
    ball.newAngle();
  }

  // check if out-of-bounds
  if(ball.posX <= -30 || ball.posX >= 1030) {
    if(ball.posX <= -30) {
      paddle2.score += 1;
    }
    else {
      paddle1.score += 1;
    }

    paddle1.posY = 225;
    paddle2.posY = 225;
    ball.posX = 88;
    ball.posY = 272;
    ball.newAngle();
  }
}

// positions on the actual screen
// are updated here
function redraw() {
  // reset the canvas
  graphics.clearRect(0, 0, canvas.width, canvas.height);

  // draw center line
  graphics.fillRect(496, 0, 8, 600);

  // draw paddles
  graphics.fillRect(paddle1.posX, paddle1.posY, 20, 100);
  graphics.fillRect(paddle2.posX, paddle2.posY, 20, 100);

  // draw ball
  drawCirc(ball.posX, ball.posY, 12);

  console.log(paddle1.score);
  // update score display
  scoreDisplay.innerHTML = paddle1.score.toString() 
                            + '&nbsp;&nbsp;' + paddle2.score.toString();
}

function reset() {
  time_old = null;
  game_over = false;
  ball.posX = 88;
  ball.posY = 275;
  ball.moving = false;
  paddle1.posY = 225;
  paddle2.posY = 225;
  paddle1.score = 0;
  paddle2.score = 0;
  window.requestAnimationFrame(mainLoop);
}

// the main game loop
function mainLoop(time_new) {
  // reset time_old for new games (and after a 'pause')
  if(!time_old) time_old = time_new;
  let time_dif = time_new - time_old;
  update(time_dif);
  redraw();
  time_old = time_new;
  if(!game_over) {
    window.requestAnimationFrame(mainLoop);
  } 
  else {
    if(paddle1.score === 6) {
      alert('The computer wins! Please try again.');
    } 
    else {
      alert('You win! Congratulations!');
    }
    reset();
  }
}

var time_old = null;
var game_over = false;
var scoreDisplay = document.getElementById('score');

var upArrow = false;
var downArrow = false;

var paddle1 = new Paddle(50, 225);
var paddle2 = new Paddle(930, 225);
var ball = new Ball(88, 275);

var canvas = document.getElementById('game');
canvas.width = 1000;
canvas.height = 600;

var graphics = canvas.getContext('2d');
graphics.fillStyle = 'white';

document.onkeydown = keyDown;
document.onkeyup = keyUp;

// 'pause' if tab is not visible
document.addEventListener('visibilitychange', () => {
  if(document.hidden) {
    time_old = null;
  }
});

ball.newAngle();
window.requestAnimationFrame(mainLoop);