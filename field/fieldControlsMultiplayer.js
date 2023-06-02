//initialize the field
const fieldWidth = 20;
const fieldHeight = 20;

let sideDistY = 0;
let sideDistX = 0;

let sectorSize =
  window.innerWidth < window.innerHeight
    ? window.innerWidth / fieldWidth
    : window.innerHeight / fieldHeight;

if (fieldWidth * sectorSize > window.innerWidth) {
  sectorSize = window.innerWidth / fieldWidth;
}

if (fieldHeight * sectorSize > window.innerHeight) {
  sectorSize = window.innerHeight / fieldHeight;
}

if (window.innerWidth < window.innerHeight) {
  let fieldSize = fieldHeight * sectorSize;
  sideDistY = (window.innerHeight - fieldSize) / 2;
}

if (window.innerWidth > window.innerHeight) {
  let fieldSize = fieldWidth * sectorSize;
  sideDistX = (window.innerWidth - fieldSize) / 2;
}

let field = [];

//fill the field with starting values
for (let x = 0; x < fieldWidth; x++) {
  field.push([]);
  for (let y = 0; y < fieldHeight; y++) {
    field[x].push(0);
  }
}

field[5][5] = 1;

field[3][5] = 2;

let currentPlayer = 1;

function draw() {
  context.fillStyle = "#000000";
  context.fillRect(0, 0, window.innerWidth, window.innerHeight);
  //draw the field
  for (let x = 0; x < fieldWidth; x++) {
    for (let y = 0; y < fieldHeight; y++) {
      if (field[x][y] === 0) {
        context.fillStyle = "red";
      }
      if (field[x][y] === 1) {
        context.fillStyle = "blue";
      }
      if (field[x][y] === 2) {
        context.fillStyle = "green";
      }
      context.fillRect(
        x * sectorSize + sideDistX,
        y * sectorSize + sideDistY,
        sectorSize,
        sectorSize
      );
    }
  }
}

function moveOn(key, xChange, yChange) {
  if (isKeyPressed[key]) {
    let once = false;
    for (let x = 0; x < fieldWidth; x++) {
      for (let y = 0; y < fieldHeight; y++) {
        //what will be moved
        if (field[x][y] === currentPlayer && !once) {
          if (
            x >= 0 &&
            x < fieldWidth &&
            x + xChange >= 0 &&
            x + xChange < fieldWidth &&
            y >= 0 &&
            y < fieldHeight &&
            y + yChange >= 0 &&
            y + yChange < fieldHeight
          ) {
            once = true;
            let old = field[x][y];
            field[x][y] = field[x + xChange][y + yChange];
            field[x + xChange][y + yChange] = old;
            if (currentPlayer === 1) {
              currentPlayer = 2;
            } else {
              currentPlayer = 1;
            }
          }
        }
      }
    }
  }
}

let timeBetweenMoves = 10

function update() {
  //movement controls
  if(timeBetweenMoves > 10){
  moveOn(87, 0, -1); //w
  moveOn(65, -1, 0); //a
  moveOn(83, 0, 1); //s
  moveOn(68, 1, 0); //d

  moveOn(38, 0, -1); //arrow up
  moveOn(37, -1, 0); //arrow left
  moveOn(40, 0, 1); //arrow down
  moveOn(39, 1, 0); //arrow right

  timeBetweenMoves = 0
  }
  timeBetweenMoves++
}

function mousedown() {
  let place = {
    x: Math.floor((mouseX - sideDistX) / sectorSize),
    y: Math.floor((mouseY - sideDistY) / sectorSize),
  };
  let once = false;
  for (let x = 0; x < fieldWidth; x++) {
    for (let y = 0; y < fieldHeight; y++) {
      //what will be moved
      if (field[x][y] === currentPlayer && !once) {
        let xChange = place.x - x;
        let yChange = place.y - y;
        //one tile radius only
        if (
          (Math.abs(xChange) <= 1 && Math.abs(xChange) >= 1 && yChange === 0) ||
          (Math.abs(yChange) <= 1 && Math.abs(yChange) >= 1 && xChange === 0)
        )
          if (
            x >= 0 &&
            x < fieldWidth &&
            x + xChange >= 0 &&
            x + xChange < fieldWidth &&
            y >= 0 &&
            y < fieldHeight &&
            y + yChange >= 0 &&
            y + yChange < fieldHeight
          ) {
            once = true;
            let old = field[x][y];
            field[x][y] = field[x + xChange][y + yChange];
            field[x + xChange][y + yChange] = old;
            if (currentPlayer === 1) {
              currentPlayer = 2;
            } else {
              currentPlayer = 1;
            }
          }
      }
    }
  }
}
