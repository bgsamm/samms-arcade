class Snake {
  constructor() {
    this.heading = null;
    this.ate = false;
    this.timer = 0;
    this.segments = [
      [12, 6]
    ];
    this.skeleton = [
      [12, 6]
    ];
  }

  getHeadCell() {
    return [Math.round(this.head[0]), Math.round(this.head[1])];
  }

  getSkeletonTail() {
    return this.skeleton[this.skeleton.length - 1];
  }

  get head() {
    return this.segments[0];
  }

  get tail() {
    return this.segments[this.length - 1];
  }

  get length() {
    return this.segments.length;
  }
}

function updateInput(e) {
  switch(e.key) {
    case 'ArrowLeft':
      dir = 'left';
      break;

    case 'ArrowRight':
      dir = 'right';
      break;
    
    case 'ArrowUp':
      // keep from scrolling the screen
      e.preventDefault();
      dir = 'up';
      break;

    case 'ArrowDown':
      // keep from scrolling the screen
      e.preventDefault();
      dir = 'down';
      break;
    
    default:
      break;
  }
}

function areOpposites(dir1, dir2) {
  return (
    (dir1 === 'left' && dir2 === 'right') ||
    (dir1 === 'right' && dir2 === 'left') ||
    (dir1 === 'up' && dir2 === 'down') ||
    (dir1 === 'down' && dir2 === 'up')
  )
}

function axisOf(dir) {
  if (dir === 'left' || dir === 'right') {
    return 'x';
  }
  else if(dir === 'up' || dir === 'down') {
    return 'y';
  }
}

function moveDot() {
  dot = [
    Math.floor(Math.random() * canvas.width / units) * units + units / 2,
    Math.floor(Math.random() * canvas.height / units) * units + units / 2
  ];
}

function update(time) {
  // update snake's direction based on user's input;
  // snake cannot double-back on itself
  if(dir && dir !== snake.heading && !areOpposites(dir, snake.heading) &&
      (
        (axisOf(dir) === 'x' && snake.head[1] % 1 < 0.01 * time) ||
        (axisOf(dir) === 'y' && snake.head[0] % 1 < 0.01 * time)
      )
    )
  {
    // align head with grid
    if(axisOf(dir) === 'y') {
      snake.head[0] = Math.floor(snake.head[0]);
    } else {
      snake.head[1] = Math.floor(snake.head[1]);
    }
    snake.heading = dir;
  }
  
  if(snake.ate) {
    snake.timer += time;
  }

  // check if snake should eat the dot
  if(
      Math.floor(snake.head[0]) === Math.floor(dot[0] / units) &&
      Math.floor(snake.head[1]) === Math.floor(dot[1] / units)
    )
  {
    snake.ate = true;
    moveDot();
    console.log(snake.length);
  }

  // move snake 1 space in the direction of movement
  if(snake.heading) {
    let head = snake.head.slice();
    let delta = 0.01 * time;
    switch(snake.heading) {
      case 'left':
        head[0] -= delta;
        break;
      
      case 'right':
        head[0] += delta;
        break;

      case 'up':
        head[1] -= delta;
        break;

      case 'down':
        head[1] += delta;
        break;
    }
    // add a new head
    snake.segments.unshift(head);
    // remove the tail (unless the dot was eaten!)
    if(!snake.ate) {
      snake.segments.pop();
    }
  }

  // allow snake to grow for a bit after eating the dot
  if(snake.timer > 100) {
    snake.ate = false;
    snake.timer = 0;
  }

  // check if head has moved into a new cell
  let headCell = snake.getHeadCell();
  if(headCell[0] !== snake.skeleton[0][0] ||
      headCell[1] !== snake.skeleton[0][1]) 
  {
    for(const segment of snake.skeleton) {
      if(headCell[0] === segment[0] &&
          headCell[1] === segment[1]) 
      {
        // collision!
        game_over = true;
        return;
      }
    }
    if(headCell[0] < 0 || headCell[1] < 0 ||
        headCell[0] >= canvas.width / units ||
        headCell[1] >= canvas.height / units)
    {
      game_over = true;
      return;
    }
    // confirmed no collision; update skeleton
    snake.skeleton.unshift(headCell);
  }

  // check if tail has moved cells
  if(Math.round(snake.tail[0]) !== snake.getSkeletonTail()[0] ||
      Math.round(snake.tail[1]) !== snake.getSkeletonTail()[1])
  {
    snake.skeleton.pop();
  }
}

function redraw() {
  // reset the canvas
  graphics.clearRect(0, 0, canvas.width, canvas.height);

  // draw the snake
  for(const segment of snake.segments) {
    graphics.fillRect(
      segment[0] * units, 
      segment[1] * units, 
      units,
      units
    );
  }

  // draw skeleton (debugging)
  /*
  for(const segment of snake.skeleton) {
    graphics.beginPath();
    graphics.rect(
      segment[0] * units, 
      segment[1] * units,
      units,
      units
    );
    graphics.stroke();
    graphics.closePath();
  }
  */

  // draw the dot
  drawCirc(dot[0], dot[1], units / 3);

  // draw grid lines (debugging)
  /*
  for(let i = 0; i < canvas.width / units; i++) {
    drawLine(i * units, 0, i * units, canvas.height);
  }
  for(let i = 0; i < canvas.height / units; i++) {
    drawLine(0, i * units, canvas.width, i * units);
  }
  */
}

function drawCirc(x, y, r) {
  graphics.beginPath();
  graphics.arc(x, y, r, 0, 2 * Math.PI);
  graphics.fill();
  graphics.closePath();
}

function drawLine(x1, y1, x2, y2) {
  graphics.beginPath();
  graphics.moveTo(x1, y1);
  graphics.lineTo(x2, y2);
  graphics.stroke();
  graphics.closePath();
}

function reset() {
  time_old = null;
  game_over = false;
  snake = new Snake();
  dir = null;
  moveDot();
  window.requestAnimationFrame(mainLoop);
}

function mainLoop(time_new) {
  // reset time_old for new games
  if(!time_old) time_old = time_new;
  let time_dif = time_new - time_old;
  update(time_dif);
  redraw();
  time_old = time_new;
  if(!game_over) {
    window.requestAnimationFrame(mainLoop);
  } 
  else {
    alert("Game over. Final length: " + snake.skeleton.length);
    reset();
  }
}

var game_over = false;
var time_old = null;
var dir;

var snake = new Snake();
var dot = [0, 0];

var canvas = document.getElementById('game');
canvas.width = 1000;
canvas.height = 600;

var graphics = canvas.getContext('2d');
graphics.fillStyle = 'white';
graphics.strokeStyle = 'red'; // for debugging the skeleton
// defines size of grid cells
var units = 40;

// 'pause' if tab is not visible
document.addEventListener('visibilitychange', () => {
  if(document.hidden) {
    time_old = null;
  }
});

document.addEventListener('keydown', e => {
  updateInput(e);
});

moveDot();
window.requestAnimationFrame(mainLoop);