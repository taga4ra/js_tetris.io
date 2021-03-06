"use strict";
// 1行目に記載している 'use strict' は削除しないでください

// setup status cells
const cells = {
  score: 0,
  showCells: generateCell(),
  fixedCells: generateCell(),
  mino: {
    minoType: getRandomMinoType(),
    rotateCount: Math.floor(Math.random() * 4),
    color: getRandomMinoColor(),
    // function
    moveDown: minoMoveDown,
    moveLeft: minoMoveLeft,
    moveRight: minoMoveRight,
    rotate: rotateMino,
    isMovable: isMovable,
    show: showMino,
    put: putMino,
    reset: resetMino,
  },
  nextMino: {
    minoType: getRandomMinoType(),
    rotateCount: Math.floor(Math.random() * 4),
    color: getRandomMinoColor(),
  },
  minoPosX: 2,
  minoPosY: 0,
  // function
  updateGame: updateGame,
  checkLine: checkLine,
  checkGameOver: checkGameOver,
  updateScore: updateScore,
  showNextMino: showNextMino,
  resetGame: resetCellsAndMino,
};

if (isSmartPhone()) {
  // no description

  // set smaller table
  config.tableHeight = 16;
  resetCellsAndMino();
} else {
  // draw description
  makeDescription();
}

// make playground
makePlayground();

if (isSmartPhone()) {
  // draw image controller
  drawController();
} else {
  // notting to do
}

//make link
makeLink();

//make link
if (!isSmartPhone()) {
  drawSetting();
}
// enable img controler
applyOnclick();

// resize img
// resizeImgHeight(imgContentsId);

updateView();

// run game
let timerId = 0;
if (!config.testMode) {
  window.addEventListener("load", () => {
    timerId = window.setInterval(cells.updateGame, config.dropSpeed);
  });
}
