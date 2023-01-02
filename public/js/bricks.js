class Ball {
  constructor(x, y) {
    this.posX = x;
    this.posY = y;
    this.spd = 1.3;
    this.ang = 0.0;

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
  // sets the ball's movement angle to a random
  // angle between 30 and 150 degrees
  newAngle() {
    this.ang = Math.random() * (2 * Math.PI / 3) + (Math.PI / 6);
  }
}

class Paddle {
  constructor(x, y) {
    this.posX = x;
    this.posY = y;
    this.spd = 1.5;
  }
  move(d) {
    this.posX += d * this.spd;
  }
}

// keep track of whether the player's
// paddle should move next frame
function keyDown(e) {
  if(e.keyCode === 37) {
    e.preventDefault();
    leftArrow = true;
  } else if(e.keyCode === 39) {
    e.preventDefault();
    rightArrow = true;
  }
  // start ball moving only once
  // a key has been pressed
  ball.moving = true;
}

// ""
function keyUp(e) {
  if(e.keyCode === 37) {
    leftArrow = false;
  } else if(e.keyCode === 39) {
    rightArrow = false;
  }
}

function drawCirc(x, y, r) {
  graphics.beginPath();
  graphics.arc(x, y, r, 0, 2 * Math.PI);
  graphics.fill();
  graphics.closePath();
}

function resetBricks() {
  bricks = [];
  // top row of bricks
  for(let i = 0; i < 11; i++) {
    bricks.push([175 + 60 * i, 40]);
  }
  // 2nd row ""
  for(let i = 0; i < 10; i++) {
    bricks.push([205 + 60 * i, 75]);
  }
  // etc...
  for(let i = 0; i < 11; i++) {
    bricks.push([175 + 60 * i, 110]);
  }
  for(let i = 0; i < 10; i++) {
    bricks.push([205 + 60 * i, 145]);
  }
  for(let i = 0; i < 11; i++) {
    bricks.push([175 + 60 * i, 180]);
  }
}

function reset() {
  time_old = null;
  game_over = false;
  leftArrow = false;
  rightArrow = false;
  paddle.posX = 460;
  ball = new Ball(500, 480);
  ball.newAngle();
  resetBricks();
  window.requestAnimationFrame(mainLoop);
}

function update(time) {
  // check for game end
  if(ball.posY > 620 || bricks.length === 0) {
    game_over = true;
  }

  // move paddle
  if(leftArrow && paddle.posX > 10) {
    paddle.move(-time * 0.2);
  } 
  else if(rightArrow && paddle.posX < 910) {
    paddle.move(time * 0.2);
  }

  if(ball.moving) {
    ball.move(time * 0.2);
  }
  // bounce ball off ceiling
  if(ball.posY < 10) {
    ball.flipY();
  }
  // bounce ball off left/right walls
  if(ball.posX < 10 || ball.posX > 990) {
    ball.flipX();
  }
  // bounce ball off paddle
  if(ball.posX >= paddle.posX &&
      ball.posX <= paddle.posX + 80 &&
      ball.posY >= paddle.posY - 10 &&
      ball.posY <= paddle.posY + 10 &&
      Math.sin(ball.ang) < 0)
  {
    // The closer the ball is to the edge of the paddle,
    // the more extreme the reflective angle
    ball.ang = (Math.PI / 2) - (Math.PI / 3) * (ball.posX - paddle.posX - 40) / 40;
    //console.log(90 - 60 * (ball.posX - paddle.posX - 40) / 40);
  }

  // check for brick collision
  for(let i = 0; i < bricks.length; i++) {
    const brick = bricks[i];
    // top of brick
    if(ball.posX >= brick[0] - 5 &&
        ball.posX <= brick[0] + 55 &&
        ball.posY + 10 >= brick[1] - 2 &&
        ball.posY + 10 <= brick[1] + 6 &&
        Math.sin(ball.ang) < 0)
    {
      ball.flipY();
      bricks.splice(i, 1);
      break;
    }
    // right ""
    if(ball.posX - 10 >= brick[0] + 44 &&
        ball.posX - 10 <= brick[0] + 52 &&
        ball.posY >= brick[1] - 5 &&
        ball.posY <= brick[1] + 30 &&
        Math.cos(ball.ang) < 0)
    {
      ball.flipX();
      bricks.splice(i, 1);
      break;
    }
    // left ""
    if(ball.posX + 10 >= brick[0] - 2 &&
        ball.posX + 10 <= brick[0] + 6 &&
        ball.posY >= brick[1] - 5 &&
        ball.posY <= brick[1] + 30 &&
        Math.cos(ball.ang) > 0)
    {
      ball.flipX();
      bricks.splice(i, 1);
      break;
    }
    // bottom ""
    if(ball.posX >= brick[0] - 5 &&
        ball.posX <= brick[0] + 55 &&
        ball.posY - 10 >= brick[1] + 19 &&
        ball.posY - 10 <= brick[1] + 27 &&
        Math.sin(ball.ang) > 0)
    {
      ball.flipY();
      bricks.splice(i, 1);
      break;
    }
  }
}

function redraw() {
  // reset the canvas
  graphics.clearRect(0, 0, canvas.width, canvas.height);

  // draw paddle
  graphics.fillRect(paddle.posX, paddle.posY, 80, 15);
  // draw ball
  drawCirc(ball.posX, ball.posY, 10);

  // draw bricks
  for(const brick of bricks) {
    graphics.fillRect(brick[0], brick[1], 50, 25);
    /*
    // Brick hitbox debugging
    graphics.fillStyle = 'green';
    graphics.fillRect(brick[0] - 5, brick[1] + 19, 60, 8);
    graphics.fillStyle = 'red';
    graphics.fillRect(brick[0] - 2, brick[1] - 5, 8, 35);
    graphics.fillStyle = 'blue';
    graphics.fillRect(brick[0] - 5, brick[1] - 2, 60, 8);
    graphics.fillStyle = 'purple';
    graphics.fillRect(brick[0] + 44, brick[1] - 5, 8, 35);
    graphics.fillStyle = 'white';
    */
  }
}

function mainLoop(time_new) {
  // reset time_old for new games (or after pause)
  if(!time_old) time_old = time_new;
  let time_dif = time_new - time_old;
  update(time_dif);
  redraw();
  time_old = time_new;
  if(!game_over) {
    window.requestAnimationFrame(mainLoop);
  } 
  else {
    if(bricks.length === 0) {
      alert("Game over. You win!");
    }
    else {
      alert("Game over. Bricks remaining: " + bricks.length);
    }
    reset();
  }
}

var rightArrow = false;
var leftArrow = false;
var game_over = false;
var time_old = null;

var paddle = new Paddle(460, 500);
var ball = new Ball(500, 480);
ball.newAngle();

var bricks = [];
resetBricks();

var canvas = document.getElementById('game');
canvas.width = 1000;
canvas.height = 600;

var graphics = canvas.getContext('2d');
graphics.fillStyle = 'white';
graphics.strokeStyle = 'red'; // for debugging

// 'pause' if tab is not visible
document.addEventListener('visibilitychange', () => {
  if(document.hidden) {
    time_old = null;
  }
});

document.addEventListener('keydown', e => {
  keyDown(e);
});

document.addEventListener('keyup', e => {
  keyUp(e);
});

window.requestAnimationFrame(mainLoop);