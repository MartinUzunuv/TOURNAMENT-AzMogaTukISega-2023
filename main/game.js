times = 0;

function initialize() {
  if (singleplayer) {
    console.log("singleplayer:" + singleplayer);
  }
  //initialize the field
  // fieldWidth = 20;
  // fieldHeight = 20;

  sideDistY = 0;
  sideDistX = 0;

  sectorSize =
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

  field = [];

  //fill the field with starting values
  for (let x = 0; x < fieldWidth; x++) {
    field.push([]);
    for (let y = 0; y < fieldHeight; y++) {
      //0 - empty
      //1 - blue
      //1.5 - blue's
      //2 - green
      //2.5 - green's
      field[x].push({ type: 0, value: Math.floor(Math.random() * 10) });
    }
  }

  for (let x = 0; x < fieldWidth; x++) {
    for (let y = 0; y < fieldHeight; y++) {
      let operation = Math.random();
      if (operation < 0.25) {
        field[x][y].operation = "+";
      } else if (operation < 0.5) {
        field[x][y].operation = "-";
      } else if (operation < 0.75) {
        field[x][y].operation = "*";
      } else {
        field[x][y].operation = "/";
        if (field[x][y].value === 0) {
          field[x][y].operation = "+";
        }
      }
    }
  }

  field[0][0] = { type: 1, value: 0, operation: "" };

  field[fieldWidth - 1][fieldHeight - 1] = { type: 2, value: 0, operation: "" };

  currentPlayer = 1;

  blueScore = 0;
  greenScore = 0;

  gameEnd = false;
}

function draw() {
  if (gameStart && times > 0) {
    if (currentPlayer === 1) {
      context.fillStyle = "#000099";
    } else {
      context.fillStyle = "#009900";
    }

    context.fillRect(0, 0, window.innerWidth, window.innerHeight);

    context.fillStyle = "white";
    context.font = `${30}px serif`;
    context.fillText(blueScore, 5, 30);
    let greenScoreString = greenScore.toString();
    context.fillText(
      greenScore,
      window.innerWidth - 15 * greenScoreString.length,
      window.innerHeight - 15
    );

    //draw the field
    for (let x = 0; x < fieldWidth; x++) {
      for (let y = 0; y < fieldHeight; y++) {
        if (field[x][y].type === 0) {
          context.fillStyle = "white";
        }
        if (field[x][y].type === 1) {
          context.fillStyle = "#9999ff";
        }
        if (field[x][y].type === 1.5) {
          context.fillStyle = "blue";
        }
        if (field[x][y].type === 2) {
          context.fillStyle = "#55ff55";
        }
        if (field[x][y].type === 2.5) {
          context.fillStyle = "green";
        }
        context.fillRect(
          x * sectorSize + sideDistX,
          y * sectorSize + sideDistY,
          sectorSize * 0.99,
          sectorSize * 0.99
        );
        context.fillStyle = "black";
        context.font = `${Math.floor(sectorSize * 0.5)}px serif`;
        if (field[x][y].operation != "") {
          context.fillText(
            field[x][y].operation + field[x][y].value,
            x * sectorSize + sideDistX + sectorSize * 0.3,
            y * sectorSize + sideDistY + sectorSize * 0.7
          );
        } else {
          context.fillText(
            field[x][y].value,
            x * sectorSize + sideDistX + sectorSize * 0.4,
            y * sectorSize + sideDistY + sectorSize * 0.7
          );
        }
      }
    }
    if (gameEnd) {
      context.fillStyle = "black";
      context.fillRect(0, 0, window.innerWidth, window.innerHeight);
      if (blueScore > greenScore) {
        context.fillStyle = "blue";
        context.font = `${30}px serif`;
        context.fillText(
          "BLUE WINS WITH SCORE:" + blueScore,
          sectorSize * 0.5,
          sectorSize
        );
      } else {
        context.fillStyle = "green";
        context.font = `${30}px serif`;
        context.fillText(
          "GREEN WINS WITH SCORE:" + greenScore,
          sectorSize * 0.5,
          sectorSize
        );
      }
    }
  }
}

function moveOn(key, xChange, yChange) {
  if (isKeyPressed[key]) {
    let once = false;
    for (let x = 0; x < fieldWidth; x++) {
      for (let y = 0; y < fieldHeight; y++) {
        //what will be moved
        if (field[x][y].type === currentPlayer && !once) {
          let blockedPaths = 0;
          for (let checkForEndX = -1; checkForEndX < 2; checkForEndX++) {
            for (let checkForEndY = -1; checkForEndY < 2; checkForEndY++) {
              try {
                if (field[x + checkForEndX][y + checkForEndY].type !== 0) {
                  blockedPaths++;
                }
              } catch (e) {
                blockedPaths++;
              }
            }
          }
          if (blockedPaths === 9) {
            gameEnd = true;
          }
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
            if (field[x + xChange][y + yChange].type === 0) {
              once = true;

              if (currentPlayer === 1) {
                field[x][y].type = 1.5;
                field[x + xChange][y + yChange].type = 1;
                if (field[x + xChange][y + yChange].operation === "+") {
                  blueScore += field[x + xChange][y + yChange].value;
                }
                if (field[x + xChange][y + yChange].operation === "-") {
                  blueScore -= field[x + xChange][y + yChange].value;
                }
                if (field[x + xChange][y + yChange].operation === "*") {
                  blueScore *= field[x + xChange][y + yChange].value;
                }
                if (field[x + xChange][y + yChange].operation === "/") {
                  blueScore = blueScore / field[x + xChange][y + yChange].value;
                }
              } else {
                field[x][y].type = 2.5;
                field[x + xChange][y + yChange].type = 2;
                if (field[x + xChange][y + yChange].operation === "+") {
                  greenScore += field[x + xChange][y + yChange].value;
                }
                if (field[x + xChange][y + yChange].operation === "-") {
                  greenScore -= field[x + xChange][y + yChange].value;
                }
                if (field[x + xChange][y + yChange].operation === "*") {
                  greenScore *= field[x + xChange][y + yChange].value;
                }
                if (field[x + xChange][y + yChange].operation === "/") {
                  greenScore =
                    greenScore / field[x + xChange][y + yChange].value;
                }
              }

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
}

let timeBetweenMoves = 10;

function update() {
  if (gameStart) {
    if (times > 0) {
      if (singleplayer && currentPlayer === 2) {
        for (let x = 0; x < fieldWidth; x++) {
          for (let y = 0; y < fieldHeight; y++) {
            let possiblePaths = [];
            let onePath = false;
            if (field[x][y].type === 2 && !onePath) {
              for (let checkForEndX = -1; checkForEndX < 2; checkForEndX++) {
                for (let checkForEndY = -1; checkForEndY < 2; checkForEndY++) {
                  try {
                    if (
                      field[x + checkForEndX][y + checkForEndY].type === 0 &&
                      !onePath
                    ) {
                      console.log(field[x + checkForEndX][y + checkForEndY].operation)
                      if(field[x + checkForEndX][y + checkForEndY].operation === '+'){
                        possiblePaths.push({
                          x: x + checkForEndX,
                          y: y + checkForEndY,
                          value: greenScore + field[x + checkForEndX][y + checkForEndY].value,
                        });
                      }else if(field[x + checkForEndX][y + checkForEndY].operation === '-'){
                        possiblePaths.push({
                          x: x + checkForEndX,
                          y: y + checkForEndY,
                          value: greenScore - field[x + checkForEndX][y + checkForEndY].value,
                        });
                      }else if(field[x + checkForEndX][y + checkForEndY].operation === '*'){
                        possiblePaths.push({
                          x: x + checkForEndX,
                          y: y + checkForEndY,
                          value: greenScore * field[x + checkForEndX][y + checkForEndY].value,
                        });
                      }else{
                        possiblePaths.push({
                          x: x + checkForEndX,
                          y: y + checkForEndY,
                          value: greenScore / field[x + checkForEndX][y + checkForEndY].value,
                        });
                      }
                    }
                  } catch (e) {}
                }
              }
              possiblePaths.sort((a, b) => a.value - b.value);
              if (!onePath)
                if (possiblePaths.length === 0) {
                  gameEnd = true;
                } else {
                  console.log(possiblePaths);
                  field[x][y].type = 2.5;
                  field[possiblePaths[possiblePaths.length - 1].x][
                    possiblePaths[possiblePaths.length - 1].y
                  ].type = 2;
                  greenScore+=field[possiblePaths[possiblePaths.length - 1].x][
                    possiblePaths[possiblePaths.length - 1].y
                  ].value
                  currentPlayer = 1;
                  onePath = true;
                }
            }
          }
        }
      }
      if (timeBetweenMoves > 10) {
        //movement controls
        moveOn(87, 0, -1); //w
        moveOn(65, -1, 0); //a
        moveOn(83, 0, 1); //s
        moveOn(68, 1, 0); //d

        moveOn(38, 0, -1); //arrow up
        moveOn(37, -1, 0); //arrow left
        moveOn(40, 0, 1); //arrow down
        moveOn(39, 1, 0); //arrow right

        timeBetweenMoves = 0;
      }
      timeBetweenMoves++;
    } else {
      initialize();
    }
    times++;
  }
}

function mousedown() {
  if (gameStart && times > 0) {
    let place = {
      x: Math.floor((mouseX - sideDistX) / sectorSize),
      y: Math.floor((mouseY - sideDistY) / sectorSize),
    };
    let once = false;
    for (let x = 0; x < fieldWidth; x++) {
      for (let y = 0; y < fieldHeight; y++) {
        //what will be moved
        if (field[x][y].type === currentPlayer && !once) {
          let blockedPaths = 0;
          for (let checkForEndX = -1; checkForEndX < 2; checkForEndX++) {
            for (let checkForEndY = -1; checkForEndY < 2; checkForEndY++) {
              try {
                if (field[x + checkForEndX][y + checkForEndY].type !== 0) {
                  blockedPaths++;
                }
              } catch (e) {
                blockedPaths++;
              }
            }
          }
          if (blockedPaths === 9) {
            gameEnd = true;
          }
          let xChange = place.x - x;
          let yChange = place.y - y;
          //one tile radius only
          if (
            (Math.abs(xChange) <= 1 &&
              Math.abs(xChange) >= 1 &&
              yChange >= -1 &&
              yChange <= 1) ||
            (Math.abs(yChange) <= 1 &&
              Math.abs(yChange) >= 1 &&
              xChange >= -1 &&
              xChange <= 1)
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
              if (field[x + xChange][y + yChange].type === 0) {
                once = true;
                // let old = field[x][y];
                // field[x][y] = field[x + xChange][y + yChange];
                // field[x + xChange][y + yChange] = old;

                if (currentPlayer === 1) {
                  field[x][y].type = 1.5;
                  field[x + xChange][y + yChange].type = 1;
                  if (field[x + xChange][y + yChange].operation === "+") {
                    blueScore += field[x + xChange][y + yChange].value;
                  }
                  if (field[x + xChange][y + yChange].operation === "-") {
                    blueScore -= field[x + xChange][y + yChange].value;
                  }
                  if (field[x + xChange][y + yChange].operation === "*") {
                    blueScore *= field[x + xChange][y + yChange].value;
                  }
                  if (field[x + xChange][y + yChange].operation === "/") {
                    blueScore =
                      blueScore / field[x + xChange][y + yChange].value;
                  }
                } else {
                  field[x][y].type = 2.5;
                  field[x + xChange][y + yChange].type = 2;
                  if (field[x + xChange][y + yChange].operation === "+") {
                    greenScore += field[x + xChange][y + yChange].value;
                  }
                  if (field[x + xChange][y + yChange].operation === "-") {
                    greenScore -= field[x + xChange][y + yChange].value;
                  }
                  if (field[x + xChange][y + yChange].operation === "*") {
                    greenScore *= field[x + xChange][y + yChange].value;
                  }
                  if (field[x + xChange][y + yChange].operation === "/") {
                    greenScore =
                      greenScore / field[x + xChange][y + yChange].value;
                  }
                }

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
}
