//initialize the field
const fieldWidth = 8;
const fieldHeight = 8;

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

let field = [];

//fill the field with starting values
for (let x = 0; x < fieldWidth; x++) {
  field.push([]);
  for (let y = 0; y < fieldHeight; y++) {
    field[x].push(Math.random() > 0.5 ? 0 : 1);
  }
}

function draw() {
  //draw the field
  for (let x = 0; x < fieldWidth; x++) {
    for (let y = 0; y < fieldHeight; y++) {
      context.fillStyle = field[x][y] === 0 ? "red" : "blue";
      context.fillRect(x * sectorSize, y * sectorSize, sectorSize, sectorSize);
    }
  }
}

function update() {}
