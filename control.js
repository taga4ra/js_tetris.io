"use strict";
// 1行目に記載している 'use strict' は削除しないでください

function generateCell() {
  const cells = [];
  for (
    let col = 0;
    col < configTetris.tableHeight + configTetris.wallThickess;
    col++
  ) {
    let tmp_row = [];
    for (
      let row = 0;
      row < configTetris.tableWidth + configTetris.wallThickess * 2;
      row++
    ) {
      tmp_row.push({
        isBlock: false,
        isWall: false,
        color: configTetris.tableBackground,
      });
      if (
        row === 0 ||
        row === configTetris.tableWidth + configTetris.wallThickess * 2 - 1
      ) {
        tmp_row[row].isWall = true;
    }
    }
    if (col === configTetris.tableHeight + configTetris.wallThickess - 1) {
      tmp_row.map((e) => (e.isWall = true));
    }

    cells.push(tmp_row);
  }
  return cells;
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
          cells.moveDown();
          break;
        case "ArrowUp":
          console.log("up");
          break;
        case "ArrowLeft":
          console.log("left");
          cells.moveLeft();
          break;
        case "ArrowRight":
          console.log("right");
          cells.moveRight();
          break;
        case "q":
          console.log("quit");
          location.reload();
          break;
        case "r":
          console.log("reset");
          location.reload();
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

function cellMoveDown() {
  const posY = cells.minoPosY;
  if (0 <= posY + 1 && posY + 1 < configTetris.tableHeight) {
    cells.minoPosY++;
  }
}

function cellMoveLeft() {
  const posX = cells.minoPosX;
  if (0 <= posX - 1 && posX - 1 < configTetris.tableWidth) {
    cells.minoPosX--;
  }
}

function cellMoveRight() {
  const posX = cells.minoPosX;
  if (0 <= posX + 1 && posX + 1 < configTetris.tableWidth) {
    cells.minoPosX++;
  }
}

function rotateMino(mino) {
  cells.mino.rotateCount %= 4;
  for (let r = 0; r < cells.mino.rotateCount; r++) {
    // rotation
    mino = transpose(mino);
    mino = mino.map((arr) => arr.reverse());
  }
  return mino;
}

function transpose(arr2d) {
  return arr2d[0].map((_, col) => arr2d.map((row) => row[col]));
}
const mino = {
  isBlock: true,
  color: "white",
};

function update() {
  cells.showCells = JSON.parse(JSON.stringify(cells.staticCells));
  getUserInput();
  cells.moveDown();
  cells.showCells[cells.minoPosY][cells.minoPosX] = mino;
  updateView();
}
