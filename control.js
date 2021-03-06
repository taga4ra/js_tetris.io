"use strict";
// 1行目に記載している 'use strict' は削除しないでください

function generateCell() {
  const cells = [];
  for (let col = 0; col < config.tableHeight + config.wallThick; col++) {
    let tmpRow = [];
    for (let row = 0; row < config.tableWidth + config.wallThick * 2; row++) {
      tmpRow.push({
        isBlock: false,
        isWall: false,
        color: config.tableBackground,
      });
      if (row === 0 || row === config.tableWidth + config.wallThick * 2 - 1) {
        tmpRow[row].isWall = true;
      }
    }
    if (col === config.tableHeight + config.wallThick - 1) {
      tmpRow.map((e) => (e.isWall = true));
    }

    cells.push(tmpRow);
  }
  return cells;
}

function getRandomMinoType() {
  const minoType = Object.keys(config.minoTypes);
  return minoType[Math.floor(Math.random() * minoType.length)];
}

function getRandomMinoColor() {
  return config.minoColors[Math.floor(Math.random() * config.minoColors.length)];
}

function getUserInput() {
  window.addEventListener(
    "keydown",
    function (event) {
      if (event.defaultPrevented) {
        return; // Do nothing if the event was already processed
      }

      switch (event.key) {
        case "ArrowDown":
          console.log("down");
          cells.mino.moveDown();
          break;
        case "ArrowUp":
          console.log("up");
          cells.mino.rotateCount++;
          break;
        case "ArrowLeft":
          console.log("left");
          cells.mino.moveLeft();
          break;
        case "ArrowRight":
          console.log("right");
          cells.mino.moveRight();
          break;
        // case "Space":
        //   console.log("pause");
        //   location.reload();
        //   break;
        case "c":
          console.log("chage mino");
          cells.mino.reset();
          break;
        case "q":
          console.log("quit");
          cells.resetGame();
          break;
        case "r":
          console.log("reset");
          cells.resetGame();
          break;
        default:
          console.log("other");
        // return; // Quit when this doesn't handle the key event.
      }

      // Cancel the default action to avoid it being handled twice
      event.preventDefault();
    },
    true
  );
}

function getNowMino() {
  const shape = config.minoTypes[cells.mino.minoType];
  cells.mino.rotateCount %= 4;
  return cells.mino.rotate(shape, cells.mino.rotateCount);
}

function isValidPos(mino, posY, posX) {
  return (
    0 + config.wallThick <= posX &&
    posX + mino[0].length - 1 < cells.showCells[0].length - config.wallThick &&
    0 <= posY &&
    posY + mino.length - 1 < cells.showCells.length - config.wallThick
  );
}

function isMovable(futureY, futureX) {
  const mino = getNowMino();
  if (isValidPos(mino, futureY, futureX)) {
    for (let col = 0; col < mino.length; col++) {
      for (let row = 0; row < mino[col].length; row++) {
        if (
          mino[col][row] === true &&
          (cells.fixedCells[futureY + col][futureX + row].isBlock ||
            cells.fixedCells[futureY + col][futureX + row].isWall)
        ) {
          console.log("mino colide");
          return false;
        }
      }
    }
    return true;
  }
}

function minoMoveDown() {
  if (cells.mino.isMovable(cells.minoPosY + 1, cells.minoPosX)) {
    cells.minoPosY++;
    cells.mino.show();
  } else {
    cells.mino.put();
    cells.mino.reset();
  }
}

function minoMoveLeft() {
  if (cells.mino.isMovable(cells.minoPosY, cells.minoPosX - 1)) {
    cells.minoPosX--;
  }
}

function minoMoveRight() {
  if (cells.mino.isMovable(cells.minoPosY, cells.minoPosX + 1)) {
    cells.minoPosX++;
  }
}

function rotateMino(mino, rotation) {
  for (let r = 0; r < rotation; r++) {
    // rotation
    mino = transpose(mino);
    mino = mino.map((arr) => arr.reverse());
  }
  return mino;
}

function transpose(arr2d) {
  return arr2d[0].map((_, col) => arr2d.map((row) => row[col]));
}

function showMino() {
  const mino = getNowMino();
  mino.forEach((_, col) =>
    _.forEach((e, row) => {
      if (e === true) {
        cells.showCells[cells.minoPosY + col][cells.minoPosX + row].isBlock = true;
        cells.showCells[cells.minoPosY + col][cells.minoPosX + row].color = cells.mino.color;
      }
    })
  );
}

function putMino() {
  const mino = getNowMino();
  mino.forEach((_, col) =>
    _.forEach((e, row) => {
      if (e === true) {
        cells.fixedCells[cells.minoPosY + col][cells.minoPosX + row].isBlock = true;
        cells.fixedCells[cells.minoPosY + col][cells.minoPosX + row].color = cells.mino.color;
      }
    })
  );
  cells.showCells = _.cloneDeep(cells.fixedCells);
}

function resetMino() {
  // set nextMino
  cells.mino.minoType = _.cloneDeep(cells.nextMino.minoType);
  cells.mino.rotateCount = _.cloneDeep(cells.nextMino.rotateCount);
  cells.mino.color = _.cloneDeep(cells.nextMino.color);

  // update nextMino
  cells.nextMino.minoType = getRandomMinoType();
  cells.nextMino.rotateCount = Math.floor(Math.random() * 4);
  cells.nextMino.color = getRandomMinoColor();

  cells.minoPosY = 0;
  cells.minoPosX = config.wallThick + Math.floor(Math.random() * (config.tableWidth + config.wallThick * 2 - 4)); // random
}

function resetCellsAndMino() {
  cells.showCells = generateCell();
  cells.fixedCells = generateCell();
  cells.mino.reset();
}

function isRemovableLine(arr) {
  return arr.every((e) => e.isBlock === true || e.isWall === true);
}

function checkLine() {
  for (let row = 0; row < cells.fixedCells.length - config.wallThick; row++) {
    const arr = cells.fixedCells[row];
    if (isRemovableLine(arr)) {
      cells.fixedCells.splice(row, 1);
      const newRow = [];
      for (let row = 0; row < config.tableWidth + config.wallThick * 2; row++) {
        newRow.push({
          isBlock: false,
          isWall: false,
          color: config.tableBackground,
        });
      }
      newRow[0].isWall = true;
      newRow[config.tableWidth + config.wallThick * 2 - 1].isWall = true;
      cells.fixedCells.unshift(newRow);
      cells.showCells = _.cloneDeep(cells.fixedCells);
      cells.score++;
    }
  }
}

function checkGameOver() {
  const topFixed = cells.fixedCells[0];
  const topShow = cells.showCells[0];

  topFixed.forEach((_, i) => {
    if (topFixed[i].isBlock === true && topShow[i].isBlock === true) {
      console.log("Game Over");
      // window.alert("Game Over");
      location.reload();
    }
  });
}

function updateGame() {
  if (config.debugMode) {
    console.group("");
    console.log("minoPosX:", "X:", cells.minoPosX, "Y:", cells.minoPosY);
    console.log("nextMino:", "type:", cells.nextMino.minoType, "color:", cells.nextMino.color);
    console.log("dropSpeed:", config.dropSpeed);
  }

  cells.showCells = _.cloneDeep(cells.fixedCells);
  getUserInput();
  cells.mino.moveDown();
  updateView();

  cells.checkLine();
  cells.updateScore();
  updateView();

  cells.checkGameOver();
  if (config.debugMode) {
    console.groupEnd();
  }
}

function applyOnclick() {
  const setOnclickFunc = (id, func) => {
    const target = document.querySelector(`#${id}`);
    target.onclick = func;
  };

  descriptionImgID.forEach((id) => {
    switch (id) {
      case "left-btn":
        setOnclickFunc(id, cells.mino.moveLeft);
        break;
      case "right-btn":
        setOnclickFunc(id, cells.mino.moveRight);
        break;
      case "rotate-btn":
        setOnclickFunc(id, (_) => cells.mino.rotateCount++);
        break;
      case "change-btn":
        setOnclickFunc(id, cells.mino.reset);
        break;
      case "reset-btn":
        setOnclickFunc(id, cells.resetGame);
        break;
      default:
        break;
    }
  });
}

/**
 * @see https://qiita.com/mzmz__02/items/8a308e768ae83768a9d5
 * @see https://developer.mozilla.org/ja/docs/Web/HTTP/Browser_detection_using_the_user_agent
 */
function isSmartPhone() {
  // デバイス幅が640px以下の場合にスマホと判定する
  return window.matchMedia && window.matchMedia("(max-device-width: 640px)").matches;
}

function showSettingPanel() {
  const divSettingPanel = document.querySelector("#settingPanel");
  divSettingPanel.style.visibility = "visible";
}

function switchDebugMode() {
  if (config.debugMode) {
    resetCellsAndMino();
    config.debugMode = false;
  } else {
    config.debugMode = true;
  }
}
