const $sketchBoard = document.querySelector('.sketch-board');

const createBoard = gridNum => {
  for (let i = 1; i <= gridNum * gridNum; i++) {
    const gridEl = document.createElement('div');
    gridEl.classList.add('sketch-board__item');

    $sketchBoard.append(gridEl);
  }
};

createBoard(16);
